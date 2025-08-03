import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);
    return {
      success: true,
      data: category,
      message: 'Category created successfully',
    };
  }

  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return {
      success: true,
      data: categories,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoriesService.findOne(id);
    return {
      success: true,
      data: category,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return {
      success: true,
      message: 'Category deleted successfully',
    };
  }
}