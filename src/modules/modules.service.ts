import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleEntity } from './module.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { deleteFile, uploadFile } from 'common/utils.file';
import { UploadedFilePaths } from 'common/enum';

@Injectable()
export class ModulesService {

  constructor(@InjectRepository(ModuleEntity) private moduleRepository: Repository<ModuleEntity>) {
  }

  async create(file: Express.Multer.File, payload: CreateModuleDto) {

    const { module_name, description } = payload;

    let isModuleExists = await this.moduleRepository.findOneBy({ module_name });
    if (isModuleExists) {
      throw new NotAcceptableException('this module name already exists');
    }

    const savedFile = uploadFile(file, UploadedFilePaths.MODULES);


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

  async update(id: number, file: Express.Multer.File, payload: CreateModuleDto) {
    const module = await this.moduleRepository.findOneBy({ id });
    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    let newFile = null;

    if (file) {
      try {
        const existingFilePath = UploadedFilePaths.MODULES + module.image;
        newFile = uploadFile(file, UploadedFilePaths.MODULES);
      } catch (error) {
        throw new BadRequestException(`Failed to process the file: ${error.message}`);
      }
    }

    module.module_name = payload.module_name;
    module.description = payload.description;
    module.image = newFile ? newFile.filename : module.image;
    module.status = payload.status;

    return await this.moduleRepository.update(module.id, module);
  }

  remove(id: number) {
    return this.moduleRepository.delete(id);
  }
}
