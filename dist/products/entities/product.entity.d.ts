export interface ProductColorImage {
    color: string;
    urls: string[];
}
export declare class Product {
    id: string;
    name: string;
    price: number;
    categoryId: string;
    articleNo: string;
    colors?: ProductColorImage[];
    createdAt: string;
    constructor(partial: Partial<Product>);
}
