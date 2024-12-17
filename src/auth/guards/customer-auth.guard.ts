import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomerAuthGuard extends AuthGuard('customer-jwt') {}