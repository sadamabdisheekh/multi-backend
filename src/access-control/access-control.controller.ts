import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { AccessControlService } from './access-control.service';

@Controller('access-control')
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Post('menu')
  getMenusByRole(@Body() payload: any) {
    if (!payload.roleId && !payload.userId) {
      throw new BadRequestException('Role ID or User ID is required');
    }
    return this.accessControlService.getMenusByRole(payload);
  }
}
