import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserDto {
    userId: number;
    @IsNotEmpty()
    firstName: string;
    @IsNotEmpty()
    middleName: string;
    @IsNotEmpty()
    lastName: string;
    isActive: boolean;
    dateCreated: Date;
    dateModified: Date;
    @IsNotEmpty()
    mobile: string;
    @IsNotEmpty()
    password: string;

    @IsNumber()
    storeId: number;
}
