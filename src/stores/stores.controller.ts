import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Query, Req, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { SchedulesDto } from './dto/store-schedule.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
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
  findAll(@Req() req: any) {
    return this.storesService.findAll(req.user);
  }

  @Get('/findStoreScheduler')
  async findStoreSchedulerByStore(@Query('storeId') storeId: number) {
    return await this.storesService.findStoreSchedulerByStore(storeId);
  }

  @Get('/findStoreByUser')
  async findStoreByUser(@Req() req: any) {
    return await this.storesService.findStoreByUser(req.user);
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


  @Post('/schedule')
  async addStoreSchedule(@Query('storeId') storeId: number,@Body() body: SchedulesDto) {
    return await this.storesService.addStoreSchedule(storeId,body);
  }
}
