import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { createReadStream, createWriteStream, writeFileSync } from 'fs';
import { join } from 'path';
import { createSongDto } from 'src/dtos/createSong.dto';
import { Song } from 'src/entities/Song.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song) private readonly songRepository: Repository<Song>,
  ) {}

  async create(
    req,
    data: createSongDto,
    file: Express.Multer.File,
  ): Promise<Song> {
    try {
      const song = this.songRepository.create({
        name: data.name,
        user: req.user.id,
      });

      const savedSong = await this.songRepository.save(song);

      writeFileSync(
        `${process.env.SONG_FOLDER}/${savedSong.id}.mp3`,
        file.buffer,
      );

      return savedSong;
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  async getAll() {
    try {
      return await this.songRepository.find();
    } catch {
      throw new BadRequestException();
    }
  }

  async getOne(id: string) {
    try {
      return await this.songRepository.findOne({
        where: {
          id,
        },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async playSong(id: string) {
    const song = await this.getOne(id);
    if (await !song) {
      throw new NotFoundException();
    }

    try {
      return {
        name: song.name,
        data: createReadStream(join(process.env.SONG_FOLDER, `${id}.mp3`)),
      };
    } catch {
      throw new BadRequestException();
    }
  }
}
