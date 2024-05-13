import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    moduleId: number;

    image: string;

    priority: number;
}
