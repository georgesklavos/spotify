import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Album } from './entities/Album.entity';
import { Song } from './entities/Song.entity';
import { User } from './entities/User.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SongsModule } from './songs/songs.module';
import { AlbumsModule } from './albums/albums.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Album, Song, User],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    UsersModule,
    SongsModule,
    AlbumsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
