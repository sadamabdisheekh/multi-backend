import { Injectable } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleEntity } from './module.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ModulesService {

  constructor(@InjectRepository(ModuleEntity) private moduleRepository: Repository<ModuleEntity>) {
  }

  async create(payload: CreateModuleDto) {
    const { module_name, module_type, thumbnail, icon, description, created_at, updated_at } = payload;

    const module = this.moduleRepository.create({
      module_name: module_name,
      module_type: module_type,
      thumbnail: thumbnail ?? '',
      icon: icon ?? '',
      description: description ?? '',
      created_at: new Date()
    });
    return await this.moduleRepository.save(module);
  }

  findOne(id: number) {
    return `This action returns a #${id} module`;
  }

  update(id: number, updateModuleDto: UpdateModuleDto) {
    return `This action updates a #${id} module`;
  }

  remove(id: number) {
    return `This action removes a #${id} module`;
  }
}
