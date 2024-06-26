import { Injectable } from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { ZoneEntity } from './zone.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ZonesService {
  constructor(@InjectRepository(ZoneEntity) private zoneRepository: Repository<ZoneEntity>) {
  }

  async create(payload: CreateZoneDto) {
    const { name, coordinates } = payload;

    const zone = this.zoneRepository.create({
      name: name,
      coordinates: coordinates,
      created_at: new Date()
    });
    return await this.zoneRepository.save(zone);
  }

  findAll() {
    return `This action returns all zones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} zone`;
  }

  update(id: number, updateZoneDto: UpdateZoneDto) {
    return `This action updates a #${id} zone`;
  }

  remove(id: number) {
    return `This action removes a #${id} zone`;
  }
}
