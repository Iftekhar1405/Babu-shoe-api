import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';
export declare class ProductsService {
    private productModel;
    private readonly categoriesService;
    constructor(productModel: Model<ProductDocument>, categoriesService: CategoriesService);
    findAll(categoryId?: string, search?: string, companyId?: string): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    create(createProductDto: CreateProductDto): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
    findByCategory(categoryId: string): Promise<Product[]>;
    findByCompany(companyId: string): Promise<Product[]>;
    findByTags(tagIds: string[]): Promise<Product[]>;
    getProductsCount(): Promise<number>;
    toggleStock(id: string): Promise<Product>;
}
