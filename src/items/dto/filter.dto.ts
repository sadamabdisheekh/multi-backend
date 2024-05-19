import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class Filter {
    @IsNotEmpty()
    @IsNumber()
    categoryId: number;
    @IsOptional()
    subCategoryId: number;
    @IsOptional()
    childSubCategoryId: number;
}
