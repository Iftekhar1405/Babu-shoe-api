import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): {
        success: boolean;
        data: Promise<import("./schemas/category.schema").Category>;
        message: string;
    };
    findAll(): {
        success: boolean;
        data: Promise<import("./schemas/category.schema").Category[]>;
    };
    findOne(id: string): {
        success: boolean;
        data: Promise<import("./schemas/category.schema").Category>;
    };
    remove(id: string): {
        success: boolean;
        message: string;
    };
}
