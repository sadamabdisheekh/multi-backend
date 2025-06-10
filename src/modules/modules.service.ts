import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { ModuleEntity } from './entities/module.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilePaths } from 'common/enum';
import { UploadService } from 'common/UploadService';
import { ZoneEntity } from './entities/zone.entity';

@Injectable()
export class ModulesService {

  constructor(
    @InjectRepository(ModuleEntity) 
    private moduleRepository: Repository<ModuleEntity>,
    private readonly uploadService: UploadService, 
    @InjectRepository(ZoneEntity)
    private readonly zoneRepository: Repository<ZoneEntity>,
  ) {}

  async create(file: Express.Multer.File, payload: CreateModuleDto) {

    const { module_name, description } = payload;

    let isModuleExists = await this.moduleRepository.findOneBy({ module_name });
    if (isModuleExists) {
      throw new NotAcceptableException('this module name already exists');
    }

    const filename = this.uploadService.saveFile(file,FilePaths.MODULES);


    const module = this.moduleRepository.create({
      module_name: module_name,
      image: filename,
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

  async update(id: number, file: Express.Multer.File, payload: CreateModuleDto) {
    const module = await this.moduleRepository.findOneBy({ id });
    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    let newFile = null;

    if (file) {
      try {
        const existingFilePath = FilePaths.MODULES + module.image;
        newFile = this.uploadService.saveFile(file, FilePaths.MODULES,existingFilePath)
      } catch (error) {
        throw new BadRequestException(`Failed to process the file: ${error.message}`);
      }
    }

    module.module_name = payload.module_name;
    module.description = payload.description;
    module.image = newFile ? newFile : module.image;
    module.status = payload.status;

    return await this.moduleRepository.update(module.id, module);
  }

  remove(id: number) {
    return this.moduleRepository.delete(id);
  }

  async addZone(payload: any) {
    const {name,status} = payload;
    const isZoneExist = await this.zoneRepository.findOneBy({ name });
    if (isZoneExist) {
      throw new NotAcceptableException('This zone already exists');
    }
    const zone = this.zoneRepository.create({
      name: name,
      status: status,
      created_at: new Date()
    });
    return await this.zoneRepository.save(zone);

  }
  async getZones() {
    return await this.zoneRepository.find({
      where: { status: true }
    });
  }
}
