import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsNotEmpty } from 'class-validator';

export class CartDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsInt()
  @IsNotEmpty()
  storeId: number;

  @IsInt()
  @IsNotEmpty()
  itemId: number;

  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  storeItemId: number;
}
