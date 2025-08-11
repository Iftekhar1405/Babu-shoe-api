import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { Tags, TagsDocument } from './schemas/tags.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Tags.name) private tagsModel: Model<TagsDocument>,
    private readonly categoriesService: CategoriesService,
  ) { }

  async findAll(categoryId?: string, search?: string): Promise<Product[]> {
    const filter: any = {};

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { articleNo: { $regex: search, $options: 'i' } },
      ];
    }

    return await this.productModel.find(filter).populate('categoryId').exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('categoryId').exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Verify category exists
    await this.categoriesService.findOne(createProductDto.categoryId);

    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async getTags() {

    // return 
  }
}