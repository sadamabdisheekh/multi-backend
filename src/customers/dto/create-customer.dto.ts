import { IsNotEmpty, IsString, IsMobilePhone, Length, IsEmail, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
  firstName: string;

  @IsOptional()
  @IsString({ message: 'Middle name must be a string' })
  @Length(2, 50, { message: 'Middle name must be between 2 and 50 characters' })
  middleName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
  lastName: string;

  @IsNotEmpty({ message: 'Mobile number is required' })
  @IsMobilePhone(undefined, { message: 'Mobile number is invalid' } as any) 
  mobile: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 50, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}
