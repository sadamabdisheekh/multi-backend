import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAttributeValueDto {

    @IsNotEmpty()
    @IsString()
    value: string

    @IsNotEmpty()
    @Type(() => Number)
    attributeId: number
}
