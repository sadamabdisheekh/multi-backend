import { IsNotEmpty, ValidateIf } from "class-validator";

export class CreateModuleDto {

    @IsNotEmpty()
    module_name: string;

    @IsNotEmpty()
    module_type: string;

    @ValidateIf(obj => !obj.icon)
    @IsNotEmpty()
    thumbnail: string;

    status: boolean;

    @ValidateIf(obj => !obj.thumbnail)
    icon: string;

    description: string;

    created_at: Date;

    updated_at: Date;
}
