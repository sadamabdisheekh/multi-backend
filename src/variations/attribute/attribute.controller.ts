import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';

@Controller('attribute')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  async create(@Body() createAttributeDto: CreateAttributeDto): Promise<any> {
    return await this.attributeService.create(createAttributeDto);
  }

  @Post('/addattributevalue')
  async add(@Body() createAttributeDto: CreateAttributeValueDto): Promise<any> {
      const createdAttributeValue = await this.attributeService.addAttributeValue(createAttributeDto);
      return { attributeValue: createdAttributeValue }; // Adjust response as needed
    
  }

  @Get()
  async findAll(): Promise<any> {
    return await this.attributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttributeDto: any) {
    return this.attributeService.update(+id, updateAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeService.remove(+id);
  }
}
