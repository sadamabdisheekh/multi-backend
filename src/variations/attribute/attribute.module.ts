import { Module } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { AttributeController } from './attribute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';
import { AttributeValue } from './entities/attribute-value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute,AttributeValue])],
  controllers: [AttributeController],
  providers: [AttributeService],
})
export class AttributeModule {}
