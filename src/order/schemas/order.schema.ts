import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type OrderDocument = Order & Document;


export enum ORDER_STATUS {
    'pending',
    'confirmed',
    'packed',
    'dispatched',
    'outfordeliver',
    'delivered',
    'cancelled',
    'return',
}

export enum ORDER_MODE { 'offline', 'online' }

export enum ORDER_PAYMENT_MODE { 'UPI', 'Cash', 'credit' }

export enum ORDER_CANCELATION_REASON { 'customer_cancel', 'inventory_issue', 'others' }

export enum ORDER_RETURN_REASON { 'damaged', 'wrong_product', 'others' }
@Schema()
class ProductDetail {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true })
    projectId: Types.ObjectId;

    @Prop({ required: true })
    quatity: number;

    @Prop({ required: true })
    color: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    discountPercent: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    salesPerson: Types.ObjectId;
}

@Schema()
class Comment {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ required: true })
    comment: string;
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ type: [ProductDetail], required: true, _id: false })
    productDetails: ProductDetail[];

    @Prop({ enum: ORDER_MODE, required: true })
    mode: string;

    @Prop({ enum: ORDER_PAYMENT_MODE, required: true })
    paymentMode: string;

    @Prop({ required: true })
    orderNumber: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Address', required: true })
    address: Types.ObjectId;

    @Prop({
        enum: ORDER_STATUS,
        default: 'pending',
    })
    status: string

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

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ShippingPartner', required: false })
    shippingPartner?: Types.ObjectId;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ required: false })
    trackingId?: string;

    @Prop({ required: false })
    paidAt?: Date;

    @Prop({ type: [Comment], default: [], _id: false })
    comments: Comment[];

}

export const OrderSchema = SchemaFactory.createForClass(Order);
