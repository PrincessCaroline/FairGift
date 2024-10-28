import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'JohnDoe@gmail.com', description: 'Email de l\'utilisateur' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'Mot de passe de l\'utilisateur' })
    @IsString()
    @MinLength(7, { message: 'Password must be at least 7 characters long' })
    password: string;
}
