import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Request,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGaurd } from 'src/auth/jwt.auth.guard';
import { createSongDto } from 'src/dtos/createSong.dto';
import { Song } from 'src/entities/Song.entity';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @UseGuards(JwtAuthGaurd)
  @Get()
  async getSongs(): Promise<Song[]> {
    return await this.songsService.getAll();
  }

  @UseGuards(JwtAuthGaurd)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() data: createSongDto,
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 200 }),
          new FileTypeValidator({ fileType: 'audio/mpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.songsService.create(req, data, file);
  }

  @Get(':id')
  async playSong(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const fileData = await this.songsService.playSong(id);

    res.set({
      'Content-Type': 'audio/mpeg',
      // 'Content-Disposition': `attachment; filename="${fileData.name}"`,
    });
    return new StreamableFile(fileData.data);
  }
}
