import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").Product;
        message: string;
    }>;
    findAll(categoryId?: string, search?: string): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").Product[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").Product;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
