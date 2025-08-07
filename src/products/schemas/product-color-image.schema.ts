import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProductColorImageDocument = ProductColorImage & Document;

@Schema({ _id: false })
export class ProductColorImage {
  @Prop({ required: true })
  color: string;

  @Prop({ type: [String], required: true, default: [] })
  urls: string[];

  @Prop({ type: [String] })
  availableSize: string[]
}

export const ProductColorImageSchema =
  SchemaFactory.createForClass(ProductColorImage);
