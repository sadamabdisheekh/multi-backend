import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    image: string;

    parent_id: number;

    priority: number;

    position: number;
}
