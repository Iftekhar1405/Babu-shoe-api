import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        success: boolean;
        data: import("./schemas/category.schema").Category;
        message: string;
    }>;
    findAll(): Promise<{
        success: boolean;
        data: import("./schemas/category.schema").Category[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./schemas/category.schema").Category;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
