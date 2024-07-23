import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategoryEntity } from './sub-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadedFilePaths } from 'common/enum';
import { uploadFile } from 'common/utils.file';
import { CategoryEntity } from 'src/category/category.entity';

@Injectable()
export class SubCategoryService {

  constructor(
    @InjectRepository(SubCategoryEntity)
    private subcatRepository: Repository<SubCategoryEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>
  ) { }

  async create(file: Express.Multer.File, payload: CreateSubCategoryDto) {

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

    const data = this.subcatRepository.create({
      subCategoryName: payload.subCategoryName,
      category: category,
      status: payload.status,
      image: newFile ? newFile.filename : null
    });

    return await this.subcatRepository.save(data);
  }

  async findSubCategory(categoryId: number): Promise<any> {
    return await this.subcatRepository.createQueryBuilder('s')
      .leftJoinAndSelect('s.childSubcat', 'c')
      .where('s.status = :status AND s.categoryId = :categoryId', { status: true, categoryId })
      .getMany();
  }

  async findAll() {
    return await this.subcatRepository.find({
      relations: {
        category: true
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} subCategory`;
  }

  update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    return `This action updates a #${id} subCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} subCategory`;
  }
}
