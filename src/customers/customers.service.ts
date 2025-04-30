import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { CustomerUser } from './entities/customer-users.entity';
import { UserEntity } from 'src/users/user.entity';


@Injectable()
export class CustomersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Customer) 
    private customerRepository: Repository<Customer>,
    @InjectRepository(CustomerUser)
    private customerUserRepository: Repository<CustomerUser>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(payload: CreateCustomerDto): Promise<any> {
    
    const createdCustomer = this.customerRepository.create({
      firstName: payload.firstName,
      middleName: payload.middleName,
      lastName: payload.lastName,
      mobile: payload.mobile,
      email: payload.email,
    });

    const hashedPassword = crypto.createHmac('sha256', payload.password).digest('hex');

    const createUser = this.userRepository.create({
      firstName: payload.firstName,
      middleName: payload.middleName,
      lastName: payload.lastName,
      username: payload.email,
      password: hashedPassword,
      mobile: payload.mobile,
      userType: {userTypeId: 3}
    });
    const customer = await this.customerRepository.save(createdCustomer);
    const user = await this.userRepository.save(createUser);
    const customerUser = this.customerUserRepository.create({
      customerId: customer.id,
      userId: user.userId,
    });
    await this.customerUserRepository.save(customerUser);

    const customerData = {
      userId: user.userId,
      customerId: customer.id,
      firstName: customer.firstName,
      middleName: customer.middleName,
      lastName: customer.lastName,
      mobile: customer.mobile,
      email: customer.email,
    }
    return customerData;
  }

  async findAll() {
    const customers = await this.customerRepository.find({
      select: [
        'id', 'firstName', 'lastName', 
        'mobile', 'isActive', 'createdAt', 'updatedAt'
      ]
    });
    return customers;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
