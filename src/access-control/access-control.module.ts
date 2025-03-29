import { Module } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { AccessControlController } from './access-control.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Tab } from './entities/tab.entity';
import { TabPermission } from './entities/tab-permission.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { UserPermission } from './entities/user-permission.entity';
import { UserRoles } from './entities/user_roles.entity';
@Module({
  imports: [TypeOrmModule.forFeature([
    Menu,
    Tab,
    TabPermission,
    RolePermission,
    Role,
    UserPermission,
    Permission,
    UserRoles
  ])],
  controllers: [AccessControlController],
  providers: [AccessControlService],
})
export class AccessControlModule {}
