import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryType } from './entities/delivery-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeliveryService {
    constructor(
        @InjectRepository(DeliveryType) 
        private deliveryRepository: Repository<DeliveryType>,
    ) {}

    async getDeliveryTypes() {
        return await this.deliveryRepository.find({
            where: {isActive: true}
        });
    }
}
