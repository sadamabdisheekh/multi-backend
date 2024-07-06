import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, BadRequestException } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) { }

  @Post('add')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: CreateModuleDto
  ) {
    if (!file) {
      throw new BadRequestException('File is not defined');
    }
    return this.modulesService.create(file, payload);
  }

  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
  }))
  update(
    @Param('id') id: number, 
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: CreateModuleDto
  ) {
    return this.modulesService.update(id, file, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modulesService.remove(+id);
  }
}
