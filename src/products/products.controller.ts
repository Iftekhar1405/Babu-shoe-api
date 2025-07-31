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
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    const product = this.productsService.create(createProductDto);
    return {
      success: true,
      data: product,
      message: 'Product created successfully',
    };
  }

  @Get()
  findAll(
    @Query('category') categoryId?: string,
    @Query('search') search?: string,
  ) {
    const products = this.productsService.findAll(categoryId, search);
    return {
      success: true,
      data: products,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const product = this.productsService.findOne(id);
    return {
      success: true,
      data: product,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.productsService.remove(id);
    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}