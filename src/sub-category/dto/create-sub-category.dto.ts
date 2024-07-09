import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSubCategoryDto {

    @IsNotEmpty()
    @Type(() => Number)
    categoryId: number;
    @IsNotEmpty()
    @IsString()
    subCategoryName: string
    @IsOptional()
    status: boolean
}
