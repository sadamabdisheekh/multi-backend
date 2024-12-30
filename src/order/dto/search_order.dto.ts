import { IsOptional, IsDateString, IsInt } from 'class-validator';

export class SearchOrdersDto {
  @IsOptional()
  @IsInt()
  storeId?: number;

  @IsOptional()
  @IsInt()
  orderStatusId?: number;

  @IsOptional()
  @IsInt()
  paymentStatusId?: number;

  @IsDateString()
  date?: string;
}
