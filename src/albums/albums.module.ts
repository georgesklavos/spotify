import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from 'src/entities/Album.entity';
import { SongsModule } from 'src/songs/songs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Album]), SongsModule],
  providers: [AlbumsService],
  controllers: [AlbumsController],
})
export class AlbumsModule {}
