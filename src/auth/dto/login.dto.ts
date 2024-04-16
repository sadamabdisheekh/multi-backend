import { IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    mobile: string;
    @IsNotEmpty()
    password: any;
}