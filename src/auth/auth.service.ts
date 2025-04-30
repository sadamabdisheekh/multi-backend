import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';
import { UserPermission } from 'src/access-control/entities/user-permission.entity';
import { RolePermission } from 'src/access-control/entities/role-permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) { }

  async customerSignIn(payload: LoginDto): Promise<any> {
    const customer = await this.findByEmailAndPassword(payload);
    customer.token = this.jwtService.sign(customer,{
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRY, // Users' tokens expire
    });
    return customer;
  }

  async signIn(
    payload: LoginDto
  ): Promise<any> {

    const user = await this.findByUsernameAndPassword(payload);
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
      relations: ['userStore','userRole.role','userType'],
      where: { username, password: hashedPassword } 
    });
    if (!user) {
      throw new NotFoundException('Invalid username or password.');
    }
    if (!user.isActive) {
      throw new NotFoundException('The user account is currently inactive. Please contact support for assistance.');
    }

    let userPermissions = [];

    const role = user.userRole ? user.userRole.role : null;
    if(role) {
      userPermissions = await this.rolePermissionRepository.find({
        relations: ['permission'],
        where: { role: {roleId: role.roleId} }
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
    return {
      userId: user.userId,
      customerId: user.customerUser.customer.id,
      firstName: user.customerUser.customer.firstName,
      middleName: user.customerUser.customer.middleName,
      lastName: user.customerUser.customer.lastName,
      mobile: user.customerUser.customer.mobile,
      email: user.customerUser.customer.email
    };
  }
}