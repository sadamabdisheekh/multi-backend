import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParcelTypes } from './entities/parcel-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParcelService {
    constructor(
        @InjectRepository(ParcelTypes) 
        private parcelRepository: Repository<ParcelTypes>,
    ) {}

    async getParcelTypes() {
        return await this.parcelRepository.find({
            where: {isActive: true}
        });
    }
}
