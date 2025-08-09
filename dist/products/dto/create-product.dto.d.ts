export declare class ProductColorImageDto {
    color: string;
    urls: string[];
    availableSize: string[];
}
export declare class CreateProductDto {
    name: string;
    image?: string;
    description?: string;
    price: number;
    categoryId: string;
    articleNo: string;
    colors?: ProductColorImageDto[];
    companyId?: string;
    sizes?: string[];
    inStock?: boolean;
    tags?: string[];
}
