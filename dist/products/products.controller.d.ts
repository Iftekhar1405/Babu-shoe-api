import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").Product;
        message: string;
    }>;
    findAll(categoryId?: string, search?: string, companyId?: string): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").Product[];
        count: number;
    }>;
    getCount(): Promise<{
        success: boolean;
        data: {
            count: number;
        };
    }>;
    findByCategory(categoryId: string): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").Product[];
        count: number;
    }>;
    findByCompany(companyId: string): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").Product[];
        count: number;
    }>;
    findByTags(body: {
        tagIds: string[];
    }): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").Product[];
        count: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").Product;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").Product;
        message: string;
    }>;
    toggleStock(id: string): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").Product;
        message: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
