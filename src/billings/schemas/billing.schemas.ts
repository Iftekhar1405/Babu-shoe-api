import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Product } from "src/products/entities/product.entity";

export type BillDocument = Bill & Document;

@Schema({ _id: false })
export class ProductDetail {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: String })
  color?: string;

  @Prop({ type: String })
  size?: string;

  @Prop({ type: Number, required: true })
  discountPercent: number;

  @Prop({ type: String })
  salesPerson?: string;
}
export const ProductDetailSchema = SchemaFactory.createForClass(ProductDetail);

@Schema({ timestamps: true })
export class Bill {
  @Prop({ type: [ProductDetailSchema], required: true })
  items: ProductDetail[];

  @Prop({ type: Boolean, default: false })
  billPrinted: boolean;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  biller: Types.ObjectId;

  @Prop({ type: Number, required: true })
  totalAmount: number;
}
export const BillSchema = SchemaFactory.createForClass(Bill);
