import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, SchemaTypes, Types } from "mongoose";
import { Customer } from "src/customer/schema/customer.schema";

export type OrderDocument = Order & Document;

export enum ORDER_STATUS {
  pending = "pending",
  confirmed = "confirmed",
  packed = "packed",
  dispatched = "dispatched",
  outfordeliver = "outfordeliver",
  delivered = "delivered",
  cancelled = "cancelled",
  return = "return",
}

export enum ORDER_MODE {
  offline = "offline",
  online = "online",
}

export enum ORDER_PAYMENT_MODE {
  "UPI",
  "Cash",
  "credit",
}

export enum ORDER_CANCELATION_REASON {
  "customer_cancel",
  "inventory_issue",
  "others",
}

export enum ORDER_RETURN_REASON {
  "damaged",
  "wrong_product",
  "others",
}

export enum ORDER_PAYMENT_STATUS {
  Due = 'due',
  Done = 'done',
  Partial = 'partial',
  Credit = 'credit'
}
@Schema()
export class ProductDetail {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Product", required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  discountPercent: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: false })
  salesPerson: Types.ObjectId;
}

@Schema()
class Comment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: false })
  user: Types.ObjectId;

  @Prop({ required: false })
  comment: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", })
  user: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [ProductDetail], required: true, _id: false })
  productDetails: ProductDetail[];

  @Prop({ enum: ORDER_MODE, required: true })
  mode: string;

  @Prop({ enum: ORDER_PAYMENT_MODE, required: true })
  paymentMode: string;

  @Prop({ required: true })
  orderNumber: number;

  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Address', required: true }) //will be later
  @Prop({ required: true })
  address: Types.ObjectId;

  @Prop({
    enum: ORDER_STATUS,
    default: "pending",
  })
  status: string;

  @Prop({ enum: ORDER_CANCELATION_REASON, required: false })
  cancelationReason?: string;

  @Prop({ required: false })
  cancelationDescription?: string;

  @Prop({ enum: ORDER_RETURN_REASON, required: false })
  returnReason?: string;

  @Prop({ required: false })
  returnDescription?: string;

  @Prop({ required: false })
  deliveryDate?: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "ShippingPartner",
    required: false,
  })
  shippingPartner?: Types.ObjectId;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: false })
  trackingId?: string;

  // Payment tracking fields used by transactions module
  @Prop({ required: false, default: 0 })
  totalAmount?: number;

  @Prop({ required: false, default: 0 })
  paidAmount?: number;

  @Prop({ required: false, default: 0 })
  dueAmount?: number;

  @Prop({ required: false, default: 'Due' })
  paymentStatus?: string;

  @Prop({ required: false })
  totalDue?: number;

  @Prop({ required: false })
  paidAt?: Date;

  @Prop({ type: [Comment], default: [], _id: false, })
  comments: Comment[];

  @Prop({ type: SchemaTypes.ObjectId, ref: Customer.name })
  customerId: string
}

export const OrderSchema = SchemaFactory.createForClass(Order);
