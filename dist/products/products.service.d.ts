import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { TagsDocument } from './schemas/tags.schema';
export declare class ProductsService {
    private productModel;
    private tagsModel;
    private readonly categoriesService;
<<<<<<< HEAD
    constructor(productModel: Model<ProductDocument>, tagsModel: Model<TagsDocument>, categoriesService: CategoriesService);
    findAll(categoryId?: string, search?: string): Promise<Product[]>;
=======
    constructor(productModel: Model<ProductDocument>, categoriesService: CategoriesService);
    findAll(categoryId?: string, search?: string, companyId?: string): Promise<Product[]>;
>>>>>>> 8f609498f31261dc8049272f7eace82e2805d4b6
    findOne(id: string): Promise<Product>;
    create(createProductDto: CreateProductDto): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
<<<<<<< HEAD
    getTags(): Promise<void>;
=======
    findByCategory(categoryId: string): Promise<Product[]>;
    findByCompany(companyId: string): Promise<Product[]>;
    findByTags(tagIds: string[]): Promise<Product[]>;
    getProductsCount(): Promise<number>;
    toggleStock(id: string): Promise<Product>;
>>>>>>> 8f609498f31261dc8049272f7eace82e2805d4b6
}
