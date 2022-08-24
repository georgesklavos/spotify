import { IsNotEmpty, IsString } from 'class-validator';

export class createSongDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
