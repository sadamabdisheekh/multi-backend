import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateItemVariationDto {
    @IsNotEmpty()
    @IsNumber()
    itemId: number;
  
    sku: string;
  
    @IsNotEmpty()
    @IsNumber()
    stock: number;
  
    additionalPrice: number;
}
