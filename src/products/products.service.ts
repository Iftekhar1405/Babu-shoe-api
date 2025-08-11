import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { Tags, TagsDocument } from './schemas/tags.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Tags.name) private tagsModel: Model<TagsDocument>,
    private readonly categoriesService: CategoriesService,
  ) { }

  async findAll(categoryId?: string, search?: string, companyId?: string): Promise<Product[]> {
    const filter: any = {};

    if (categoryId) {
      filter.categoryId = new Types.ObjectId(categoryId);
    }

    if (companyId) {
      filter.companyId = new Types.ObjectId(companyId);
    }

    if (search) {
      // Used MongoDB aggregation pipeline for optimized search
      const pipeline: any[] = [
        // Lookup tags to search in tag names
        {
          $lookup: {
            from: 'tags',
            localField: 'tags',
            foreignField: '_id',
            as: 'tagDetails'
          }
        },
        // Match products based on search criteria gad fat gya
        {
          $match: {
            $and: [
              // Apply category and company filters if provided
              ...(categoryId ? [{ categoryId: new Types.ObjectId(categoryId) }] : []),
              ...(companyId ? [{ companyId: new Types.ObjectId(companyId) }] : []),
              // Search across multiple fields
              {
                $or: [
                  { name: { $regex: search, $options: 'i' } },
                  { articleNo: { $regex: search, $options: 'i' } },
                  { description: { $regex: search, $options: 'i' } },
                  { 'tagDetails.name': { $regex: search, $options: 'i' } }
                ]
              }
            ]
          }
        },
        // Sort by creation date (newest first)
        { $sort: { createdAt: -1 } },
        // Lookup category details
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'categoryId'
          }
        },
        // Lookup company details
        {
          $lookup: {
            from: 'companies',
            localField: 'companyId',
            foreignField: '_id',
            as: 'companyId'
          }
        },
        // Unwind single document fields
        {
          $unwind: {
            path: '$categoryId',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $unwind: {
            path: '$companyId',
            preserveNullAndEmptyArrays: true
          }
        },
        // Replace tags array with populated tag details
        {
          $addFields: {
            tags: '$tagDetails'
          }
        },
        // Remove temporary tagDetails field
        {
          $project: {
            tagDetails: 0
          }
        }
      ];

      return await this.productModel.aggregate(pipeline).exec();
    }

    // For non-search queries, use regular find with populate
    return await this.productModel
      .find(filter)
      .populate('categoryId')
      .populate('companyId')
      .populate('tags')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('categoryId')
      .populate('companyId')
      .populate('tags')
      .exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Verify category exists
    await this.categoriesService.findOne(createProductDto.categoryId);

    // Check if article number already exists
    const existingProduct = await this.productModel.findOne({
      articleNo: createProductDto.articleNo
    });

    if (existingProduct) {
      throw new ConflictException('Product with this article number already exists');
    }

    // Convert string IDs to ObjectIds
    const productData = {
      ...createProductDto,
      companyId: createProductDto.companyId ? new Types.ObjectId(createProductDto.companyId) : undefined,
      tags: createProductDto.tags?.map(tagId => new Types.ObjectId(tagId)),
      categoryId: new Types.ObjectId(createProductDto.categoryId),
    };

    const createdProduct = new this.productModel(productData);
    const savedProduct = await createdProduct.save();

    // Return populated product
    return await this.productModel
      .findById(savedProduct._id)
      .populate('categoryId')
      .populate('companyId')
      .populate('tags')
      .exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // Check if product exists
    const existingProduct = await this.productModel.findById(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // If updating category, verify it exists
    if (updateProductDto.categoryId) {
      await this.categoriesService.findOne(updateProductDto.categoryId);
    }

    // If updating article number, check for duplicates
    if (updateProductDto.articleNo) {
      const duplicateProduct = await this.productModel.findOne({
        articleNo: updateProductDto.articleNo,
        _id: { $ne: id }
      });

      if (duplicateProduct) {
        throw new ConflictException('Product with this article number already exists');
      }
    }

    // Convert string IDs to ObjectIds for update
    const updateData = {
      ...updateProductDto,
      ...(updateProductDto.companyId && { companyId: new Types.ObjectId(updateProductDto.companyId) }),
      ...(updateProductDto.tags && { tags: updateProductDto.tags.map(tagId => new Types.ObjectId(tagId)) }),
      ...(updateProductDto.categoryId && { categoryId: new Types.ObjectId(updateProductDto.categoryId) }),
    };

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('categoryId')
      .populate('companyId')
      .populate('tags')
      .exec();

    return updatedProduct;
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

  async findByCategory(categoryId: string): Promise<Product[]> {
    return await this.productModel
      .find({ categoryId: new Types.ObjectId(categoryId) })
      .populate('categoryId')
      .populate('companyId')
      .populate('tags')
      .exec();
  }

  async findByCompany(companyId: string): Promise<Product[]> {
    return await this.productModel
      .find({ companyId: new Types.ObjectId(companyId) })
      .populate('categoryId')
      .populate('companyId')
      .populate('tags')
      .exec();
  }

  async findByTags(tagIds: string[]): Promise<Product[]> {
    const objectIdTags = tagIds.map(tagId => new Types.ObjectId(tagId));
    return await this.productModel
      .find({ tags: { $in: objectIdTags } })
      .populate('categoryId')
      .populate('companyId')
      .populate('tags')
      .exec();
  }

  async getProductsCount(): Promise<number> {
    return await this.productModel.countDocuments();
  }

  async toggleStock(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.inStock = !product.inStock;
    await product.save();

    return await this.productModel
      .findById(id)
      .populate('categoryId')
      .populate('companyId')
      .populate('tags')
      .exec();
  }
}
