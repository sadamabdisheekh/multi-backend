import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleEntity } from './module.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { saveFile } from 'common/utils.file';
import { UploadedFilePaths } from 'common/enum';

@Injectable()
export class ModulesService {

  constructor(@InjectRepository(ModuleEntity) private moduleRepository: Repository<ModuleEntity>) {
  }

  async create(file: Express.Multer.File,payload: CreateModuleDto) {

    const { module_name,description } = payload;

    let isModuleExists = await this.moduleRepository.findOneBy({ module_name });
    if (isModuleExists) {
      throw new NotAcceptableException('this module name already exists');
    }

    const savedFile = saveFile(file,UploadedFilePaths.MODULES);


    const module = this.moduleRepository.create({
      module_name: module_name,
      image: savedFile.filename,
      description: description,
      created_at: new Date()
    });
    return await this.moduleRepository.save(module);
  }

  findAll() {
    return this.moduleRepository.find({
      where: { status: true }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} module`;
  }

  update(id: number, updateModuleDto: UpdateModuleDto) {
    return `This action updates a #${id} module`;
  }

  remove(id: number) {
    return this.moduleRepository.delete(id);
  }
}
