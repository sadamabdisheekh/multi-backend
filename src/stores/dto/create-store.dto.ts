import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches } from "class-validator";

export class CreateStoreDto {

  @IsNotEmpty()
  @IsString()
  @Length(5,30)
  name: string;

  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'phone must be a valid phone number' })
  phone: string;

  @IsNotEmpty()
  email: string;

  @IsOptional()
  logo: string;

  @IsNotEmpty()
  latitude: string;

  @IsNotEmpty()
  longitude: string;

  @IsOptional()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  minimum_order: number;

  @IsNotEmpty()
  @IsNumber()
  comission: number;

  @IsOptional()
  @IsBoolean()
  status: boolean;

  @IsOptional()
  @IsDateString()
  created_at: Date;

  @IsOptional()
  @IsDateString()
  updated_at: Date;

  @IsNotEmpty()
  @IsNumber()
  zone_id: number;
}
