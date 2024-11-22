import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Res,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserAuth } from '../auth/auth.entity';
import { AuthUser } from '../auth/auth.decorator';
import { Response } from 'express';
import { CreateUserDto, UpdateUserDto } from '@repo/dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const accessToken = await this.usersService.createUser(createUserDto);

    const date = new Date();
    date.setMonth(date.getMonth() + 2);

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: date,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return res.status(HttpStatus.OK).json({ message: 'User Created' });
  }

  @Patch('/')
  @UseGuards(AuthGuard) // Vérifie que l'utilisateur est authentifié
  async updateUser(
    @AuthUser() user: UserAuth,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(Number(user.id), updateUserDto);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  getProfile(@AuthUser() user: UserAuth) {
    return this.usersService.getUserById(Number(user.id));
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  getUser(@Param('id') id: number) {
    return this.usersService.getUserById(Number(id));
  }
}
