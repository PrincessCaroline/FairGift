import { Controller, Post, Body, Res, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
    constructor(
        private readonly loginService: LoginService,
    ) { }

    @Post('/')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const accessToken = await this.loginService.login(loginDto);

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Assure le cookie en HTTPS en production
            maxAge: 60 * 24 * 60 * 60 * 1000, // 2 mois en millisecondes
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax', // Empêche l'envoi du cookie sur des sites externes
        });

        return res.status(HttpStatus.OK).json({ message: 'Logged in successfully' });
    }


    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Res() res: Response) {
        // Efface le cookie en le vidant
        res.clearCookie('token');
        return res.json({ message: 'Logged out successfully' });
    }

}