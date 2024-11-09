import { IsNotEmpty, IsNumber } from "class-validator";

export class ItemDetailsDto {
    @IsNumber()
    itemId: number;

    @IsNumber() 
    storeId: number;
  }