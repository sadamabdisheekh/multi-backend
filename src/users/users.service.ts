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


  async findAll() {
    return await this.userRepository.find({
      relations: ['profile.store']
    });
  }

  async getUserTypes({ userType }: any) {
    const condition = userType.userTypeId === 1 ? {} : { userTypeId: Not(1) };
    return await this.userTypeRepository.find({ where: condition });
  }
}
