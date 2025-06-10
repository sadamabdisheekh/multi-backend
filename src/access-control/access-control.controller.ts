import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, Request, UseGuards, Req } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
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

  @Get('/menuswithpermission')
  async getMenusWithPermission(@Req() req: any): Promise<any> {
      const menus = await this.accessControlService.getMenusWithPermission(req.user);
      return menus;
  }
}
