import { Document, Types } from "mongoose";
export type CompanyDocument = Comapny & Document;
export declare class Comapny {
    name: string;
    logo: string;
}
export declare const CompanySchema: import("mongoose").Schema<Comapny, import("mongoose").Model<Comapny, any, any, any, Document<unknown, any, Comapny, any, {}> & Comapny & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Comapny, Document<unknown, {}, import("mongoose").FlatRecord<Comapny>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Comapny> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
