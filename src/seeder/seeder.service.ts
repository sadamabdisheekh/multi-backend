import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemTypes } from 'src/item/entities/item-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
    private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(ItemTypes)
    private readonly itemTypesRepository: Repository<ItemTypes>,
  ) {}

  async seed() {
    await this.seedItemTypes();
  }

  private async seedItemTypes() {
    try {
      const itemTypeCount = await this.itemTypesRepository.count();
      
      if (itemTypeCount === 0) {
        const itemTypes = [
          { name: 'Food' },
          { name: 'Drink' },
          { name: 'Snack' },
        ];
        await this.itemTypesRepository.save(itemTypes);

        this.logger.log('Users seeded successfully');
      } else {
        this.logger.log('Users already exist - skipping seed');
      }
    } catch (error) {
      this.logger.error('Error seeding users', error.stack);
      throw error;
    }
  }
}
