import { Injectable, NotFoundException } from '@nestjs/common';
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
      status: payload.status,
      coordinates: coordinates,
      created_at: new Date()
    });
    return await this.zoneRepository.save(zone);
  }

  async findAll() {
    return await this.zoneRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} zone`;
  }

  async update(id: number, payload: UpdateZoneDto) {
    let foundedZone = await this.zoneRepository.findOneBy({ id })
    if (!foundedZone) {
      throw new NotFoundException(`zone with id ${id} not found`);
    }
    foundedZone.name = payload.name;
    foundedZone.status = payload.status;

    return await this.zoneRepository.update(foundedZone.id, foundedZone);
  }

  remove(id: number) {
    return `This action removes a #${id} zone`;
  }
}
