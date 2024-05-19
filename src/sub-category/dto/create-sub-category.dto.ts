import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSubCategoryDto {

    @IsNotEmpty()
    @IsNumber()
    categoryId: number;
    @IsNotEmpty()
    @IsString()
    subCategoryName: string
}
