import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type OrderDocument = Order & Document;

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

    @Prop({ enum: ['offline', 'online'], required: true })
    mode: 'offline' | 'online';

    @Prop({ enum: ['UPI', 'Cash', 'credit'], required: true })
    paymentMode: 'UPI' | 'Cash' | 'credit';

    @Prop({ required: true })
    orderNumber: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Address', required: true })
    address: Types.ObjectId;

    @Prop({
        enum: [
            'pending',
            'confirmed',
            'packed',
            'dispatched',
            'outfordeliver',
            'delivered',
            'cancelled',
            'return',
        ],
        default: 'pending',
    })
    status:
        | 'pending'
        | 'confirmed'
        | 'packed'
        | 'dispatched'
        | 'outfordeliver'
        | 'delivered'
        | 'cancelled'
        | 'return';

    @Prop({ enum: ['customer_cancel', 'inventory_issue', 'others'], required: false })
    cancelationReason?: 'customer_cancel' | 'inventory_issue' | 'others';

    @Prop({ required: false })
    cancelationDescription?: string;

    @Prop({ enum: ['damaged', 'wrong_product', 'others'], required: false })
    returnReason?: 'damaged' | 'wrong_product' | 'others';

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
