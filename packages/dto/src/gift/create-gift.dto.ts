import { IsString, IsOptional, IsNumber } from "class-validator";

export class CreateGiftDto {
  @IsString()
  name: string;

  @IsNumber()
  ownerId: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  purchaseLink?: string;
}
