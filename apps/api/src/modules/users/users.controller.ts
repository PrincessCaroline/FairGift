import { Controller, Get, UseGuards, Post, Body, Res, HttpStatus, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserAuth } from '../auth/auth.entity';
import { AuthUser } from '../auth/auth.decorator';
import { Response } from 'express';
import { CreateUserDto } from '@repo/dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('/')
    @UsePipes(new ValidationPipe())
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


    @Get('/:id')
    @UseGuards(AuthGuard)
    getUser(@Param("id") id: number) {
        return this.usersService.getUserById(Number(id));
    }

    @Get('/me')
    @UseGuards(AuthGuard)
    getProfile(@AuthUser() user: UserAuth) {
        return this.usersService.getUserById(Number(user.id));
    }





}

