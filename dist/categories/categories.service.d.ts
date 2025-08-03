import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesService {
    private categoryModel;
    constructor(categoryModel: Model<CategoryDocument>);
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    remove(id: string): Promise<void>;
}
