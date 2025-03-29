import { IsNotEmpty, IsOptional } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: any;

    @IsOptional()
    isCustomerLogin: boolean;
}