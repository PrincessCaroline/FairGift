import { IsString, IsOptional, IsNumber } from "class-validator";

export class UpdateGiftDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  purchaseLink?: string;
}
