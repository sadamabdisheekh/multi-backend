import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { ZoneEntity } from 'src/zones/zone.entity';
import { FilePaths } from 'common/enum';
import { StoreSchedule } from './entities/store-schedule.entity';
import { SchedulesDto } from './dto/store-schedule.dto';
import { UploadService } from 'common/UploadService';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    @InjectRepository(StoreSchedule)
    private readonly storeScheduleRepository: Repository<StoreSchedule>,
    @InjectRepository(ZoneEntity)
    private readonly zoneRepository: Repository<ZoneEntity>,
    private readonly uploadService: UploadService
  ) { }

  async create(file: Express.Multer.File, payload: CreateStoreDto) {

    const isStoreExist = await this.storeRepository.findOne({
      where: [
        { name: payload.name },
        { phone: payload.phone },
        { email: payload.email }
      ]
    });

    if (isStoreExist) {
      throw new ConflictException(`Store with name "${payload.name}" or phone "${payload.phone}" already exists`);
    }

    const isZoneExist = await this.zoneRepository.findOne({
      where: { id: payload.zone_id }
    });

    if (!isZoneExist) {
      throw new NotFoundException(`can't find zone`);
    }

    const fileName = this.uploadService.saveFile(file, FilePaths.STORES);



    const store = this.storeRepository.create({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      logo: fileName,
      latitude: payload.latitude,
      longitude: payload.longitude,
      address: payload.address,
      minimum_order: payload.minimum_order,
      comission: payload.commission,
      created_at: new Date(),
      zone: isZoneExist
    });

    return await this.storeRepository.save(store);

  }

  async findAll() {
    return await this.storeRepository.find({
      relations: ['zone']
    });
  }

  async findOne(id: number) {
    return await this.storeRepository.findOne({
      relations: ['zone'],
      where: { id }
    })
  }

  async update(id: number, file: Express.Multer.File, payload: UpdateStoreDto) {
    const findStore = await this.storeRepository.findOneBy({ id });
    if (!findStore) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }

    const findZone = await this.zoneRepository.findOne({
      where: { id: payload.zone_id }
    });

    if (!findZone) {
      throw new NotFoundException(`Can't find zone`);
    }

    let fileName = null;

    if (file) {
      try {
        const existingFilePath = FilePaths.STORES + payload.logo;
        fileName =  this.uploadService.saveFile(file, FilePaths.STORES, existingFilePath);
      } catch (error) {
        throw new BadRequestException(`Failed to process the file: ${error.message}`);
      }
    }

    findStore.name = payload.name;
    findStore.email = payload.email;
    findStore.phone = payload.phone;
    findStore.address = payload.address;
    findStore.comission = payload.commission;
    findStore.logo = fileName ? fileName : payload.logo;
    findStore.latitude = payload.latitude;
    findStore.longitude = payload.longitude;
    findStore.minimum_order = payload.minimum_order;
    findStore.status = payload.status.toString() == 'true';
    findStore.zone = findZone;

    try {
      return await this.storeRepository.save(findStore);
    } catch (error) {
      throw new BadRequestException(`Failed to update store: ${error.message}`);
    }
  }

  async findStoreByUser(user: any) {
    if (user.userType && user.userType.userTypeId == 1) {
      return await this.storeRepository.find()
    }
    return await this.storeRepository.find({
      relations: ['userStore.user'],
      where: { userStore: { user: { userId: user.userId } } }
    })
  }

  async findStoreSchedulerByStore(storeId: number) {
    return await this.storeScheduleRepository.find({
      where: { store: { id: storeId } }
    })
  }

  async addStoreSchedule(storeId: number, payload: SchedulesDto): Promise<void> {
    const store = await this.storeRepository.findOneBy({ id: storeId });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const existingSchedules = await this.storeScheduleRepository.find({
      relations: {
        store: true
      },
      where: { store }
    });

    const newSchedules = await Promise.all(payload.schedules.flatMap(schedule => {
      if (!schedule.openTimes || schedule.openTimes.length === 0) {
        schedule.openTimes = [{ openTime: null, closeTime: null }];
      }

      return schedule.openTimes.map(async (timeRangeDto) => {
        const existingSchedule = existingSchedules.find(
          s => s.dayOfWeek == schedule.dayOfWeek && s.store.id == storeId
        );

        if (existingSchedule) {
          existingSchedule.isOpen = schedule.isOpen;
          existingSchedule.closeTime = timeRangeDto.closeTime;
          existingSchedule.openTime = timeRangeDto.openTime;

          return existingSchedule;
        } else {
          const newSchedule = this.storeScheduleRepository.create({
            store,
            dayOfWeek: schedule.dayOfWeek,
            isOpen: schedule.isOpen,
            openTime: timeRangeDto.openTime,
            closeTime: timeRangeDto.closeTime,
          });

          return newSchedule;
        }
      });
    }));

    try {
      await this.storeScheduleRepository.save(newSchedules);
      console.log('Schedules successfully saved');
    } catch (error) {
      if (error.code === '23505') {
        console.error('Duplicate entry:', error.message);
      } else {
        console.error('Save failed:', error.message);
      }
    }
  }

}
