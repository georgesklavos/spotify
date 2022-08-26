import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGaurd } from 'src/auth/jwt.auth.guard';
import { CreateAlbumDto } from 'src/dtos/createAlbum.dto';
import { Album } from 'src/entities/Album.entity';
import { AlbumsService } from './albums.service';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumService: AlbumsService) {}

  @UseGuards(JwtAuthGaurd)
  @Post()
  async createAlbum(@Body() data: CreateAlbumDto): Promise<Album> {
    return await this.albumService.create(data);
  }

  @UseGuards(JwtAuthGaurd)
  @Post('addSong')
  async addSong(
    @Query('albumId', ParseUUIDPipe) albumId: string,
    @Query('songId', ParseUUIDPipe) songId: string,
  ) {
    return await this.albumService.addSongToAlbum(albumId, songId);
  }

  @UseGuards(JwtAuthGaurd)
  @Get()
  async getAlbums(): Promise<Album[]> {
    return await this.albumService.getAlbums();
  }
}
