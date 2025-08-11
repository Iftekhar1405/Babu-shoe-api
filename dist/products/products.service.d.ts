import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { TagsDocument } from './schemas/tags.schema';
export declare class ProductsService {
    private productModel;
    private tagsModel;
    private readonly categoriesService;
    constructor(productModel: Model<ProductDocument>, tagsModel: Model<TagsDocument>, categoriesService: CategoriesService);
    findAll(categoryId?: string, search?: string): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    create(createProductDto: CreateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
    getTags(): Promise<void>;
}
