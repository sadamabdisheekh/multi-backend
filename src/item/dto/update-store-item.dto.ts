import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateStoreItemDto {

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isItemHasVariations: boolean;

  @IsInt()
  itemId: number;

  @IsInt()
  storeId: number;

  @IsOptional()
  @IsNumber()
  storeItemVariationId?: number;

  @IsOptional()
  @IsNumber()
  storeItemId?: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number' })
  @Min(1, { message: 'Price must be greater than to 0' })
  price: number;

  @IsInt()
  @Min(1)
  stock: number;
}
