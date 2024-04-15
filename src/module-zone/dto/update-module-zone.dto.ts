import { PartialType } from '@nestjs/mapped-types';
import { CreateModuleZoneDto } from './create-module-zone.dto';

export class UpdateModuleZoneDto extends PartialType(CreateModuleZoneDto) {}
