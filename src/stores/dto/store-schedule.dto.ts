import { IsArray, IsBoolean, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


export class SchedulesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedules: ScheduleDto[];
}


export class ScheduleDto {
    @IsString()
    dayOfWeek: string;
  
    @IsBoolean()
    isOpen: boolean;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TimeRangeDto)
    openTimes: TimeRangeDto[];
  }


export class TimeRangeDto {
    @IsString()
    openTime: string;
  
    @IsString()
    closeTime: string;
  }