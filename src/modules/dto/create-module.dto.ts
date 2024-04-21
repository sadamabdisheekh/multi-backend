import { IsNotEmpty, ValidateIf } from "class-validator";

export class CreateModuleDto {

    @IsNotEmpty()
    module_name: string;

    image: string;

    status: boolean;

    description: string;

    created_at: Date;

    updated_at: Date;
}
