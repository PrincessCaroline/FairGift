import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(2, { message: 'Le nom doit avoir au moins 2 caractères' })
    name: string;

    @IsEmail({}, { message: 'L\'email doit être valide' })
    email: string;

    @IsString()
    @MinLength(7, { message: 'Le mot de passe doit avoir au moins 7 caractères' })
    password: string;
}