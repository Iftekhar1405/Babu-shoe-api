import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


export type CompanyDocument = Comapny & Document;

@Schema({ timestamps: true })
export class Comapny {
    @Prop({ required: true, maxlength: 200 })
    name: string;

    @Prop({ required: false })
    logo: string;

}

export const CompanySchema = SchemaFactory.createForClass(Comapny);
