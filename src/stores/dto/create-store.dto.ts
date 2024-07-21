import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches } from "class-validator";

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 30)
  name: string;

  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone must be a valid phone number' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  logo: string;

  @IsNotEmpty()
  @IsString()
  latitude: string;

  @IsNotEmpty()
  @IsString()
  longitude: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @Type(() => Number)
  minimum_order: number;

  @IsOptional()
  @Type(() => Number)
  commission: number;

  @IsOptional()
  @Type(() => Boolean)
  status: boolean;

  @IsNotEmpty()
  @Type(() => Number)
  zone_id: number;
}
