import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';
import { UserRoles } from 'src/access-control/entities/user_roles.entity';
import { UserPermission } from 'src/access-control/entities/user-permission.entity';
import { Permission } from 'src/access-control/entities/permission.entity';
import { RolePermission } from 'src/access-control/entities/role-permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/user.entity';
import { UserStore } from 'src/users/user-store.entity';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserStore)
    private readonly userStoreRepository: Repository<UserStore>,
    @InjectRepository(UserRoles)
    private readonly userRoleRepository: Repository<UserRoles>,
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) { }



  async signIn(
    payload: LoginDto
  ): Promise<any> {

    const user = payload.isCustomerLogin ? await this.findByEmailAndPassword(payload) : await this.findByUsernameAndPassword(payload);
    const { password, ...result } = user as any;
    result.token = this.jwtService.sign(result,{
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRY, // Users' tokens expire
    });
    
    return result;
  }

  // is portal login
  async findByUsernameAndPassword(payload: LoginDto): Promise<any> {
    const {username, password} = payload;
    const hashedPassword = crypto.createHmac('sha256', password).digest('hex');
  
    const user = await this.userRepository.findOne({
      relations: ['userStore','userRole'],
      where: { username, password: hashedPassword } 
    });
    if (!user) {
      throw new NotFoundException('Invalid username or password.');
    }
    if (!user.isActive) {
      throw new NotFoundException('The user account is currently inactive. Please contact support for assistance.');
    }

    let userPermissions = [];

    const {userRole} = user;
    if(userRole && userRole.role) {
      userPermissions = await this.rolePermissionRepository.find({
        relations: ['permission'],
        where: { role: {roleId: userRole.role.roleId} }
      });
    }else{
      userPermissions = await this.userPermissionRepository.find({
        relations: ['permission'],
        where: { user: {userId: user.userId} }
      });
    }

    const permissions = userPermissions.map(permission => permission.permission.permission);

    user['permissions'] = permissions;

  
    return user;
  }

  async findByEmailAndPassword(payload: LoginDto): Promise<any> {
    const {username, password} = payload;
    const hashedPassword = crypto.createHmac('sha256', password).digest('hex');

    const user = await this.userRepository.findOne({
      relations: ['customerUser.customer'],
      where: {username: username, password: hashedPassword } 
    });
    
    if(!user) {
      throw new NotFoundException('Invalid email or password.');
    }

    if(!user.isActive) {
      throw new NotFoundException('The user account is currently inactive. Please contact support for assistance.');
    }
    return user;
  }
}