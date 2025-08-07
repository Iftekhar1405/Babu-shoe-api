import { Document } from "mongoose";
export type ProductColorImageDocument = ProductColorImage & Document;
export declare class ProductColorImage {
    color: string;
    urls: string[];
    availableSize: string[];
}
export declare const ProductColorImageSchema: import("mongoose").Schema<ProductColorImage, import("mongoose").Model<ProductColorImage, any, any, any, Document<unknown, any, ProductColorImage, any, {}> & ProductColorImage & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProductColorImage, Document<unknown, {}, import("mongoose").FlatRecord<ProductColorImage>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ProductColorImage> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
