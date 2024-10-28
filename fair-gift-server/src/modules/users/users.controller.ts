import { Controller, Get, UseGuards, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAuth } from '../auth/auth.entity';
import { AuthUser } from '../auth/auth.decorator';
import { Response } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('/')
    async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        const accessToken = await this.usersService.createUser(createUserDto)

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Assure le cookie en HTTPS en production
            maxAge: 60 * 24 * 60 * 60 * 1000, // 2 mois en millisecondes
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax', // Empêche l'envoi du cookie sur des sites externes
        });

        return res.status(HttpStatus.OK).json({ message: 'User Created' });
    }

    @Get('/me')
    @UseGuards(AuthGuard)
    getProfile(@AuthUser() user: UserAuth) {
        console.log('Authenticated user:', user);
        return this.usersService.getMe(Number(user.id));
    }





}

