import { IsNotEmpty } from "class-validator";

export class CreateItemVariationAttributeDto {
    @IsNotEmpty()
    @IsNotEmpty()
    itemVariationId: number;
  
    @IsNotEmpty()
    @IsNotEmpty()
    attributeId: number;
  
    @IsNotEmpty()
    @IsNotEmpty()
    attributeValueId: number;
}
