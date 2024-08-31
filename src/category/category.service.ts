import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { deleteFile, uploadFile } from 'common/utils.file';
import { UploadedFilePaths } from 'common/enum';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { SubCategoryEntity } from './entities/sub-category.entity';

@Injectable()
export class CategoryService {
  constructor(
  @InjectRepository(CategoryEntity) 
  private categoryRepository: Repository<CategoryEntity>,
  @InjectRepository(SubCategoryEntity) 
  private subCategoryRepository: Repository<SubCategoryEntity>
) {}

   
  async create(file: Express.Multer.File,payload: CreateCategoryDto) {

    const isCategory = await this.categoryRepository.findOne({where: {name: payload.name}});
    if (isCategory) {
      throw new NotAcceptableException('this category already exists');
    }

    const savedFile = uploadFile(file,UploadedFilePaths.CATEGERORY);

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
    .leftJoinAndSelect('sub.childSubcat','childSub')
    // .where("cat.status = :status", { status: true })
    .getMany();
  
    return categoriesWithSub;
  }
  

  



  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: number,file: Express.Multer.File,payload: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`category with ID ${id} not found`);
    }

    let newFile = null;

    if (file) {
      try {
        const existingFilePath = UploadedFilePaths.MODULES + category.image;
        deleteFile(existingFilePath);
        newFile = uploadFile(file, UploadedFilePaths.MODULES);
      } catch (error) {
        throw new BadRequestException(`Failed to process the file: ${error.message}`);
      }
    }

    category.name = payload.name;
    category.image = newFile ? newFile.filename : category.image;
    category.status = payload.status  == 'true' ? true : false;

    return await this.categoryRepository.update(category.id, category);
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }



  async createSubCategory(file: Express.Multer.File, payload: CreateSubCategoryDto) {

    const category = await this.categoryRepository.findOneBy({ id: payload.categoryId })
    if (!category) {
      throw new NotFoundException('this category not found')
    }

    let newFile = null;

    if (file) {
      try {
        newFile = uploadFile(file, UploadedFilePaths.SUBCATEGERORY);
      } catch (error) {
        throw new BadRequestException(`Failed to process the file: ${error.message}`);
      }
    }

    const data = this.subCategoryRepository.create({
      subCategoryName: payload.subCategoryName,
      category: category,
      status: payload.status,
      image: newFile ? newFile.filename : null
    });

    return await this.subCategoryRepository.save(data);
  }
}
