import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Product, ProductDocument } from "./schemas/product.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CategoriesService } from "../categories/categories.service";
import { Tags, TagsDocument } from "./schemas/tags.schema";
import { OpenaiService } from "src/openai/openai.service";
import { Company, CompanyDocument } from "src/company/schemas/company.schema";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Tags.name) private tagsModel: Model<TagsDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    private readonly categoriesService: CategoriesService,
    private readonly openaiService: OpenaiService
  ) {}

  async findAll(categoryId?: string, search?: string, companyId?: string) {
    const filter: any = {};

    if (categoryId) {
      filter.categoryId = new Types.ObjectId(categoryId);
    }

    if (companyId) {
      filter.companyId = new Types.ObjectId(companyId);
    }
    if (search) {
      const queryEmbedding =
        await this.openaiService.generateGeminiEmbedding(search);
      const pipeline: any[] = [
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 20,
            limit: 5,
          },
        },
        {
          $project: {
            embedding: 0, // remove embedding from results
          },
        },
      ];

      return await this.productModel.aggregate(pipeline);
    }

    // For non-search queries, use regular find with populate
    return await this.productModel
      .find(filter)
      .populate("categoryId")
      .populate("companyId")
      .populate("tags")
      .sort({ createdAt: -1 })
      .lean(true);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate("categoryId")
      .populate("companyId")
      .populate("tags")
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
      articleNo: createProductDto.articleNo,
    });

    if (existingProduct) {
      throw new ConflictException(
        "Product with this article number already exists"
      );
    }

    const company = await this.companyModel
      .findById(createProductDto.companyId)
      .select("name")
      .lean(true);
    const tags = await this.tagsModel
      .find({
        _id: { $in: createProductDto.tags.map((t) => new Types.ObjectId(t)) },
      })
      .lean(true);
    const category = await this.categoriesService.findOne(
      createProductDto.categoryId
    );

    const textForEmbedding = JSON.stringify({
      name: createProductDto.name,
      description: createProductDto.description,
      company: company.name,
      price: createProductDto.price,
      category: category.name,
      articleNo: createProductDto.articleNo,
      sizes: createProductDto.sizes,
      tags: tags,
      colors: createProductDto.colors,
    });

    createProductDto.embedding =
      await this.openaiService.generateGeminiEmbedding(textForEmbedding);

    const createdProduct = new this.productModel(createProductDto);
    const savedProduct = await createdProduct.save();

    // Return populated product
    return await this.productModel
      .findById(savedProduct._id)
      .populate("categoryId")
      .populate("companyId")
      .populate("tags")
      .exec();
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
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
        _id: { $ne: id },
      });

      if (duplicateProduct) {
        throw new ConflictException(
          "Product with this article number already exists"
        );
      }
    }

    // Convert string IDs to ObjectIds for update
    const updateData = {
      ...updateProductDto,
      ...(updateProductDto.companyId && {
        companyId: new Types.ObjectId(updateProductDto.companyId),
      }),
      ...(updateProductDto.tags && {
        tags: updateProductDto.tags.map((tagId) => new Types.ObjectId(tagId)),
      }),
      ...(updateProductDto.categoryId && {
        categoryId: new Types.ObjectId(updateProductDto.categoryId),
      }),
    };

    const company = await this.companyModel
      .findById(updateData.companyId)
      .select("name")
      .lean(true);
    const tags = await this.tagsModel
      .find({ _id: { $in: updateData.tags } })
      .lean(true);
    const category = await this.categoriesService.findOne(
      updateData.categoryId.toString()
    );

    const textForEmbedding = JSON.stringify({
      name: updateData.name,
      description: updateData.description,
      company: company.name,
      price: updateData.price,
      category: category.name,
      articleNo: updateData.articleNo,
      sizes: updateData.sizes,
      tags: tags,
      colors: updateData.colors,
    });

    updateData.embedding =
      await this.openaiService.generateEmbedding(textForEmbedding);

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("categoryId")
      .populate("companyId")
      .populate("tags")
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
    return await this.tagsModel.find().lean(true);
  }

  async createTag(name: string) {
    return await this.tagsModel.create({ name });
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return await this.productModel
      .find({ categoryId: new Types.ObjectId(categoryId) })
      .populate("categoryId")
      .populate("companyId")
      .populate("tags")
      .exec();
  }

  async findByCompany(companyId: string): Promise<Product[]> {
    return await this.productModel
      .find({ companyId: new Types.ObjectId(companyId) })
      .populate("categoryId")
      .populate("companyId")
      .populate("tags")
      .exec();
  }

  async findByTags(tagIds: string[]): Promise<Product[]> {
    const objectIdTags = tagIds.map((tagId) => new Types.ObjectId(tagId));
    return await this.productModel
      .find({ tags: { $in: objectIdTags } })
      .populate("categoryId")
      .populate("companyId")
      .populate("tags")
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
      .populate("categoryId")
      .populate("companyId")
      .populate("tags")
      .exec();
  }
}
