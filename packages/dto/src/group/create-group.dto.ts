import { IsString, MinLength } from 'class-validator';

export class CreateGroupDto {
    @IsString()
    @MinLength(2, { message: 'Le nom doit avoir au moins 2 caractères' })
    name: string;
}