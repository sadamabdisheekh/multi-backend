import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemTypes } from 'src/item/entities/item-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemTypes])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
