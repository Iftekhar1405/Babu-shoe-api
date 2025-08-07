import { Document, Schema as MongooseSchema, Types } from 'mongoose';
export type OrderDocument = Order & Document;
declare class ProductDetail {
    projectId: Types.ObjectId;
    quatity: number;
    color: string;
    amount: number;
    discountPercent: number;
}
declare class Comment {
    user: Types.ObjectId;
    comment: string;
}
export declare class Order {
    user: Types.ObjectId;
    productDetails: ProductDetail[];
    mode: 'offline' | 'online';
    paymentMode: 'UPI' | 'Cash' | 'credit';
    orderNumber: number;
    address: Types.ObjectId;
    status: 'pending' | 'confirmed' | 'packed' | 'dispatched' | 'outfordeliver' | 'delivered' | 'cancelled' | 'return';
    cancelationReason?: 'customer_cancel' | 'inventory_issue' | 'others';
    cancelationDescription?: string;
    returnReason?: 'damaged' | 'wrong_product' | 'others';
    returnDescription?: string;
    deliveryDate?: Date;
    shippingPartner?: Types.ObjectId;
    phoneNumber: string;
    trackingId?: string;
    paidAt?: Date;
    comments: Comment[];
}
export declare const OrderSchema: MongooseSchema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any, {}> & Order & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Order> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
