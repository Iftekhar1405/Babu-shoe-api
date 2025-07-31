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
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesService.create(createCategoryDto);
    return {
      success: true,
      data: category,
      message: 'Category created successfully',
    };
  }

  @Get()
  findAll() {
    const categories = this.categoriesService.findAll();
    return {
      success: true,
      data: categories,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const category = this.categoriesService.findOne(id);
    return {
      success: true,
      data: category,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.categoriesService.remove(id);
    return {
      success: true,
      message: 'Category deleted successfully',
    };
  }
}