import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as crypto from 'crypto';
import { UserStore } from './user-store.entity';
import { Store } from 'src/stores/entities/store.entity';
import { UserType } from './user-types.entity';
import { UserRoles } from 'src/access-control/entities/user_roles.entity';
import { Role } from 'src/access-control/entities/role.entity';
import * as _ from 'underscore';
import { UserPermission } from 'src/access-control/entities/user-permission.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(UserStore)
    private readonly userStoreRepository: Repository<UserStore>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
    @InjectRepository(UserRoles)
    private readonly userRoleRepository: Repository<UserRoles>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
  ) {
  }

  async create(payload: UserDto) {
    const { firstName, middleName, lastName, username, mobile, userType, storeId, isActive } = payload;

    // Check for existing mobile number and username
    const existingUser = await this.userRepository.findOne({ where: { mobile } });
    if (existingUser) throw new NotAcceptableException('Mobile number already in use.');

    const existingUsername = await this.userRepository.findOne({ where: { username } });
    if (existingUsername) throw new NotAcceptableException('Username already in use.');

    // Hash the password
    const hashedPassword = crypto.createHmac('sha256', payload.password).digest('hex');

    // Create user
    const user = this.userRepository.create({
      firstName,
      middleName,
      lastName,
      username,
      mobile,
      userType: { userTypeId: userType },
      password: hashedPassword,
      datecreated: new Date(),
      isActive,
    });

    const savedUser = await this.userRepository.save(user);

    // Create user store if userType is not 1
    if (userType == 1) {
      // user role is admin
      const userRole = this.userRoleRepository.create({ user: savedUser, role: { roleId: 1 } });
      await this.userRoleRepository.save(userRole);
    } else {
      const store = await this.storeRepository.findOne({ where: { id: storeId } });
      const userStore = this.userStoreRepository.create({ user: savedUser, store: store || null });
      await this.userStoreRepository.save(userStore);
    }

    const { password, ...result } = savedUser;
    return result;
  }


  async findAll(storeId: number) {
    const users = await this.userRepository.find({
      relations: ['userStore.store'],
      where: {
        userStore: {
          store: { id: storeId }
        }
      }
    });
     return users;

  }

  async getUserTypes({ userType }: any) {
    const condition = userType.userTypeId === 1 ? {} : { userTypeId: Not(1) };
    return await this.userTypeRepository.find({ where: condition });
  }

  async getUserPermission(userId: number): Promise<any> {
    const user = await this.userRepository.findOne({
      relations: ['userRole', 'userRole.role', 'userPermissions', 'userPermissions.permission'],
       where: { userId } 
      });
    const roleId = user?.userRole?.role?.roleId;

    let  permissions =roleId ?
      await this.roleRepository.find({ relations: ['rolePermissions', 'rolePermissions.permission'] })
    : user.userPermissions;

    return permissions.map(({ permission }: any) => ({
      permissionId: permission.permissionId,
      permission: permission.permission,
      description: permission.description,
    }));
  }

  async updateUserPermission(body: any){
    const { userId, latestPermissionIds } = body;
    const user = await this.userRepository.findOne({ where: { userId } });
    const userPermissions = await this.userPermissionRepository.find({ 
      relations: ['permission'],
      where: { user: { userId: user.userId } } 
    });
    const userPermissionsIds = userPermissions.map(({ permission }: any) => permission.permissionId);
    const oldPermissions =  _.difference(userPermissionsIds,latestPermissionIds);
    const newPermissions = _.difference(latestPermissionIds, userPermissionsIds);
    for(let i = 0; i < oldPermissions.length; i++){
      await this.userPermissionRepository.delete({ user: user, permission: { permissionId: oldPermissions[i] } });
    }
    for(let i = 0; i < newPermissions.length; i++){
      const newPermission = this.userPermissionRepository.create({ user: user, permission: { permissionId: newPermissions[i] } });
      await this.userPermissionRepository.save(newPermission);
    }
    return { message: 'Permissions updated successfully' };
  }
}
