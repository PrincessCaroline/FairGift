import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginService } from './login.service';
import { LoginDto } from '@repo/dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const accessToken = await this.loginService.login(loginDto);

    const date = new Date();
    date.setMonth(date.getMonth() + 2);

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: date,
      sameSite: 'lax',
    });

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged in successfully' });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res() res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return res.json({ message: 'Logged out successfully' });
  }

  @Get('/check-token')
  @UseGuards(AuthGuard)
  checkToken() {
    return { message: 'token valide' };
  }
}
