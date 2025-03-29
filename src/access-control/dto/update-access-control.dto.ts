import { PartialType } from '@nestjs/mapped-types';
import { CreateAccessControlDto } from './create-access-control.dto';

export class UpdateAccessControlDto extends PartialType(CreateAccessControlDto) {}
