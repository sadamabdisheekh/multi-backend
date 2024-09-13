import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ItemVariationDto {
    @IsOptional()
    @IsNumber()
    itemId?: number;

    @IsOptional()
    @IsNumber()
    attributeId?: number;

    @IsOptional()
    @IsNumber()
    attributeValueId?: number

    @Type(() => Number)
    itemCost: number;

    @Type(() => Number)
    itemPrice: number;

    @IsString()
    sku: string;

    @Type(() => Number)
    stock?: number;

    @Type(() => Number)
    stockAlert: number;

    @IsOptional()
    @IsString()
    description: string;
}
