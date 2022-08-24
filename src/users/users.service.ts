import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/dtos/register.dto';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async register(data: RegisterDto): Promise<User> {
    const findUser = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });
    console.log(findUser);
    if (findUser) {
      throw new ConflictException();
    }
    try {
      data.password = await bcrypt.hash(
        data.password,
        +process.env.BCRYPT_ROUNDS,
      );
      const user = this.userRepository.create(data);
      return await this.userRepository.save(user);
    } catch {
      throw new BadRequestException();
    }
  }
}
