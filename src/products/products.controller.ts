import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return {
      success: true,
      data: product,
      message: 'Product created successfully',
    };
  }

  @Get()
  async findAll(
    @Query('category') categoryId?: string,
    @Query('search') search?: string,
  ) {
    const products = await this.productsService.findAll(categoryId, search);
    return {
      success: true,
      data: products,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    return {
      success: true,
      data: product,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}