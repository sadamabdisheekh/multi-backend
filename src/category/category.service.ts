import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { saveFile } from 'common/utils.file';
import { UploadedFilePaths } from 'common/enum';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>) {
  }

   
  async create(file: Express.Multer.File,payload: CreateCategoryDto) {

    const isCategory = await this.categoryRepository.findOne({where: {name: payload.name}});
    if (isCategory) {
      throw new NotAcceptableException('this category already exists');
    }

    const savedFile = saveFile(file,UploadedFilePaths.CATEGERORY);

    const category = this.categoryRepository.create({
      name: payload.name,
      image: savedFile.filename,
      priority: payload.priority,
      created_at: new Date()
    })
    return await this.categoryRepository.save(category);
  }

  async findCategoryWithSub(): Promise<any> {
    const categoriesWithSub = await this.categoryRepository
    .createQueryBuilder("cat")
    .leftJoinAndSelect("cat.subCategory", "sub")
    .where("cat.status = :status", { status: true })
    .getMany();
  
    return categoriesWithSub;
  }
  

  



  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
