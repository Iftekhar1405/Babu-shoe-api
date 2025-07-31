import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): {
        success: boolean;
        data: Promise<import("./schemas/product.schema").Product>;
        message: string;
    };
    findAll(categoryId?: string, search?: string): {
        success: boolean;
        data: Promise<import("./schemas/product.schema").Product[]>;
    };
    findOne(id: string): {
        success: boolean;
        data: Promise<import("./schemas/product.schema").Product>;
    };
    remove(id: string): {
        success: boolean;
        message: string;
    };
}
