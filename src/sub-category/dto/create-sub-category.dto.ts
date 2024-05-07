import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateSubCategoryDto {

    @IsNotEmpty()
    @IsNumber()
    categoryId: number;
    @IsNotEmpty()
    @IsNumber()
    subCategoryName: string
}
