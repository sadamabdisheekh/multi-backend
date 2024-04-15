import { Injectable } from '@nestjs/common';
import { CreateModuleZoneDto } from './dto/create-module-zone.dto';
import { UpdateModuleZoneDto } from './dto/update-module-zone.dto';

@Injectable()
export class ModuleZoneService {
  create(createModuleZoneDto: CreateModuleZoneDto) {
    return 'This action adds a new moduleZone';
  }

  findAll() {
    return `This action returns all moduleZone`;
  }

  findOne(id: number) {
    return `This action returns a #${id} moduleZone`;
  }

  update(id: number, updateModuleZoneDto: UpdateModuleZoneDto) {
    return `This action updates a #${id} moduleZone`;
  }

  remove(id: number) {
    return `This action removes a #${id} moduleZone`;
  }
}
