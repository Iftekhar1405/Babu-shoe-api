import { Document, Types } from "mongoose";
import { ProductColorImage } from "./product-color-image.schema";
export type ProductDocument = Product & Document;
export declare class Product {
    name: string;
    image: string;
    price: number;
    categoryId: Types.ObjectId;
    articleNo: string;
    colors: ProductColorImage[];
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product, any, {}> & Product & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Product> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
