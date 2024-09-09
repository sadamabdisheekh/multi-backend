import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ItemVariationDto {
    @Type(() => Number)
    itemCost: number;

    @Type(() => Number)
    itemPrice: number;

    @IsString()
    sku: string;

    @Type(() => Number)
    stockAlert: number;
}
