import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


export type TagsDocument = Tags & Document;

@Schema({ timestamps: true })
export class Tags {
    @Prop({ required: true, maxlength: 200 })
    name: string;
}

export const TagSchema = SchemaFactory.createForClass(Tags);
