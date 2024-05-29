import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { ZoneEntity } from 'src/zones/zone.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    @InjectRepository(ZoneEntity)
    private readonly zoneRepository: Repository<ZoneEntity>,
  ) {}
  
  async create(payload: CreateStoreDto) {

    const isStoreExist = await this.storeRepository.findOne({
      where: [
        { name: payload.name },
        { phone: payload.phone },
        {email: payload.email}
      ]
    });
    
    if (isStoreExist) {
      throw new ConflictException(`Store with name "${payload.name}" or phone "${payload.phone}" already exists`);
    }

    const isZoneExist = await this.zoneRepository.findOne({
      where: {id: payload.zone_id}
    });
    
    if (!isZoneExist) {
      throw new NotFoundException(`can't find zone`);
    }



    const store = this.storeRepository.create({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      logo: payload.logo,
      latitude: payload.latitude,
      longitude: payload.longitude,
      address: payload.address,
      minimum_order: payload.minimum_order,
      comission: payload.comission,
      created_at: new Date(),
      zone: isZoneExist
    });

    return await this.storeRepository.save(store);
    
  }

  findAll() {
    return `This action returns all stores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} store`;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
