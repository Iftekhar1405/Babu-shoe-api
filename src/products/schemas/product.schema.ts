import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import {
  ProductColorImage,
  ProductColorImageSchema,
} from "./product-color-image.schema";
import { Type } from "class-transformer";
import { Company } from "../../company/schemas/company.schema";
import { Tags } from "./tags.schema";
import { compare } from "bcryptjs";

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, maxlength: 200 })
  name: string;

  @Prop({ required: false })
  image: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ type: Types.ObjectId, ref: "Category", required: true })
  categoryId: Types.ObjectId;

  @Prop({ required: true, maxlength: 50 })
  articleNo: string;

  @Prop({ type: [ProductColorImageSchema], default: [], required: false })
  colors: ProductColorImage[];

  @Prop({ type: Types.ObjectId, ref: Company.name })
  companyId: Types.ObjectId

  @Prop({ type: [String] })
  sizes: string[]

  @Prop({ type: Boolean, default: true })
  inStock: boolean

  @Prop({ type: [Types.ObjectId], ref: Tags.name })
  tags: Types.ObjectId[]

}

export const ProductSchema = SchemaFactory.createForClass(Product);
