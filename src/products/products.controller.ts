import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
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
    @Query('company') companyId?: string,
  ) {
    const products = await this.productsService.findAll(categoryId, search, companyId);
    return {
      success: true,
      data: products,
      count: products.length,
    };
  }

  @Get('count')
  async getCount() {
    const count = await this.productsService.getProductsCount();
    return {
      success: true,
      data: { count },
    };
  }

  @Get('tags')
  async getTags() {
    return await this.productsService.getTags();
  }

  @Post('tag')
  async createTag(@Body() data: { name: string }) {
    return await this.productsService.createTag(data.name);
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string) {
    const products = await this.productsService.findByCategory(categoryId);
    return {
      success: true,
      data: products,
      count: products.length,
    };
  }

  @Get('company/:companyId')
  async findByCompany(@Param('companyId') companyId: string) {
    const products = await this.productsService.findByCompany(companyId);
    return {
      success: true,
      data: products,
      count: products.length,
    };
  }

  @Post('by-tags')
  async findByTags(@Body() body: { tagIds: string[] }) {
    const products = await this.productsService.findByTags(body.tagIds);
    return {
      success: true,
      data: products,
      count: products.length,
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(id, updateProductDto);
    return {
      success: true,
      data: product,
      message: 'Product updated successfully',
    };
  }

  @Patch(':id/toggle-stock')
  async toggleStock(@Param('id') id: string) {
    const product = await this.productsService.toggleStock(id);
    return {
      success: true,
      data: product,
      message: `Product stock status updated to ${product.inStock ? 'In Stock' : 'Out of Stock'}`,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}