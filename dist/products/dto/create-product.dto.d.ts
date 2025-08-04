export declare class ProductColorImageDto {
    color: string;
    urls: string[];
}
export declare class CreateProductDto {
    name: string;
    price: number;
    categoryId: string;
    articleNo: string;
    colors?: ProductColorImageDto[];
}
