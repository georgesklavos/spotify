import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAlbumDto } from 'src/dtos/createAlbum.dto';
import { Album } from 'src/entities/Album.entity';
import { SongsService } from 'src/songs/songs.service';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albmumRepository: Repository<Album>,
    private readonly songsService: SongsService,
  ) {}

  async create(data: CreateAlbumDto): Promise<Album> {
    try {
      const album = this.albmumRepository.create(data);

      return await this.albmumRepository.save(album);
    } catch {
      throw new BadRequestException();
    }
  }

  async addSongToAlbum(albumId: string, songId: string) {
    const album = await this.albmumRepository.findOne({
      where: {
        id: albumId,
      },
      relations: ['songs'],
    });

    const song = await this.songsService.getOne(songId);

    if (!album || !song) {
      throw new NotFoundException();
    }

    try {
      album.songs.push(song);
      await this.albmumRepository.save(album);
    } catch {
      throw new BadRequestException();
    }
  }

  async getAlbums(): Promise<Album[]> {
    try {
      return await this.albmumRepository.find({
        relations: ['songs'],
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }
}
