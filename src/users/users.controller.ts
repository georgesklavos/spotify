import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from 'src/dtos/register.dto';
import { User } from 'src/entities/User.entity';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  async register(@Body() data: RegisterDto): Promise<User> {
    return await this.userService.register(data);
  }
}
