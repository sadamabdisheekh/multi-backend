import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { SchedulesDto } from './dto/store-schedule.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post('/add')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
  }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: CreateStoreDto
  ) {
    if (!file) {
      throw new BadRequestException('File is not defined');
    }
    return this.storesService.create(file,payload);
  }

  @Get('/all')
  findAll() {
    return this.storesService.findAll();
  }

  @Get('/findStoreScheduler')
  async findStoreSchedulerByStore(@Query('storeId') storeId: number) {
    return await this.storesService.findStoreSchedulerByStore(storeId);
  }


  @Get(':id')
  findStoreById(@Param('id') storeId: number ) {
    return this.storesService.findOne(storeId);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
  }))
  update(
    @Param('id') id: number, 
    @UploadedFile() file: Express.Multer.File,
    @Body() updateStoreDto: UpdateStoreDto
  ) {
    return this.storesService.update(id,file, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storesService.remove(+id);
  }
  @Post('/schedule')
  async addStoreSchedule(@Query('storeId') storeId: number,@Body() body: SchedulesDto) {
    return await this.storesService.addStoreSchedule(storeId,body);
  }
}
