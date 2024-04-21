import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ParseFilePipeBuilder, UploadedFile, HttpStatus, HttpException } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFileUploadConfig } from 'src/common/file-upload.config';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', getFileUploadConfig('module')))
  create(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() body: CreateModuleDto
  ) {
    body.image = file.filename;
    return this.modulesService.create(body);
  }




  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(+id, updateModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modulesService.remove(+id);
  }
}
