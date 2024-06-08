import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateItemDto {
    @IsNotEmpty()
    name: string;

    @IsOptional()
    description: string;

    @IsOptional()
    created_at: Date;

    @IsNotEmpty()
    @IsNumber()
    categoryId: number;

    @IsOptional()
    @IsNumber()
    subCategoryId: number;

    @IsOptional()
    @IsNumber()
    childSubCategoryId: number;

    @IsNotEmpty()
    @IsNumber()
    store_id: number;

    @IsNotEmpty()
    price: number;

    @IsOptional()
    discount: number;

    @IsNotEmpty()
    available_time_starts: string;

    @IsNotEmpty()
    available_time_ends: string;
}
