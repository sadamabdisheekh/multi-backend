import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModuleZoneService } from './module-zone.service';
import { CreateModuleZoneDto } from './dto/create-module-zone.dto';
import { UpdateModuleZoneDto } from './dto/update-module-zone.dto';

@Controller('module-zone')
export class ModuleZoneController {
  constructor(private readonly moduleZoneService: ModuleZoneService) {}

  @Post()
  create(@Body() createModuleZoneDto: CreateModuleZoneDto) {
    return this.moduleZoneService.create(createModuleZoneDto);
  }

  @Get()
  findAll() {
    return this.moduleZoneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moduleZoneService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModuleZoneDto: UpdateModuleZoneDto) {
    return this.moduleZoneService.update(+id, updateModuleZoneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moduleZoneService.remove(+id);
  }
}
