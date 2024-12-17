import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';


@Injectable()
export class CustomersService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Customer) 
    private customerRepository: Repository<Customer>,
  ) {}

  create(payload: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  async signIn(payload: LoginDto): Promise<any> {
    const hashedPassword = crypto.createHmac('sha256', payload.password).digest('hex');

    const customer =  await this.customerRepository.findOne({
      where: {
        mobile: payload.mobile,
        password: hashedPassword
      }
    })

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const {password,...result} = customer as any;

    result.type = 'customer';
    result.token = this.jwtService.sign(result,{
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('CUSTOMER_TOKEN_EXPIRY'),
    });

    return result;

  }

  async findAll() {
    const customers = await this.customerRepository.find({
      select: [
        'id', 'firstName', 'lastName', 'email', 
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
