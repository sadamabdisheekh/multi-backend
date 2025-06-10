import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UserDto {
    userId: number;
    
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    middleName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    username: string;

    @IsOptional()
    @IsNumber()
    isActive: boolean;
    
    dateCreated: Date;
    dateModified: Date;

    @IsNotEmpty()
    mobile: string;

    @IsNotEmpty()
    userType: number;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsNumber()
    storeId: number;
}
