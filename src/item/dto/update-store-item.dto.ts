import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateStoreItemDto {
  @IsInt()
  itemId: number;

  @IsInt()
  storeId: number;

  @IsOptional()
  @IsString()
  itemVariation: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number' })
  @Min(1, { message: 'Price must be greater than to 0' })
  price: number;

  @IsInt()
  @Min(1)
  stock: number;
}
