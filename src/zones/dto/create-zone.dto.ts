import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateZoneDto {
    @IsNotEmpty()
    name: string;
    @IsOptional()
    coordinates: string;

    @IsOptional()
    status: boolean
}
