import { PartialType } from '@nestjs/mapped-types';
import { CartDto } from './create-cart.dto';

export class UpdateCartDto extends PartialType(CartDto) {}
