import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  Matches,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: "Le nom doit avoir au moins 2 caractères" })
  name: string;

  @IsEmail({}, { message: "L'email doit être valide" })
  email: string;

  @IsString()
  @MinLength(7, { message: "Le mot de passe doit avoir au moins 7 caractères" })
  @Matches(/[A-Z]/, {
    message: "Le mot de passe doit contenir au moins une majuscule",
  })
  @Matches(/\d/, {
    message: "Le mot de passe doit contenir au moins un chiffre",
  })
  password: string;
}
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  currentPassword?: string;

  @IsOptional()
  @IsString()
  @MinLength(7, {
    message: "Le mot de passe doit contenir au moins 7 caractères",
  })
  newPassword?: string;
}
