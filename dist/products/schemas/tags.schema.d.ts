import { Document, Types } from "mongoose";
export type TagsDocument = Tags & Document;
export declare class Tags {
    name: string;
}
export declare const CompanySchema: import("mongoose").Schema<Tags, import("mongoose").Model<Tags, any, any, any, Document<unknown, any, Tags, any, {}> & Tags & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Tags, Document<unknown, {}, import("mongoose").FlatRecord<Tags>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Tags> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
