import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Country) 
        private addressRepository: Repository<Country>,
    ) {}

    async getAddresses() {
        const addresses = await this.addressRepository.find({
            relations: ['regions','regions.cities.villages']
        })
        return addresses;
    }
}
