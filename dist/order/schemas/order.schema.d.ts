import { Document, Schema as MongooseSchema, Types } from 'mongoose';
export type OrderDocument = Order & Document;
export declare enum ORDER_STATUS {
    'pending' = 0,
    'confirmed' = 1,
    'packed' = 2,
    'dispatched' = 3,
    'outfordeliver' = 4,
    'delivered' = 5,
    'cancelled' = 6,
    'return' = 7
}
export declare enum ORDER_MODE {
    'offline' = 0,
    'online' = 1
}
export declare enum ORDER_PAYMENT_MODE {
    'UPI' = 0,
    'Cash' = 1,
    'credit' = 2
}
export declare enum ORDER_CANCELATION_REASON {
    'customer_cancel' = 0,
    'inventory_issue' = 1,
    'others' = 2
}
export declare enum ORDER_RETURN_REASON {
    'damaged' = 0,
    'wrong_product' = 1,
    'others' = 2
}
declare class ProductDetail {
    projectId: Types.ObjectId;
    quatity: number;
    color: string;
    amount: number;
    discountPercent: number;
    salesPerson: Types.ObjectId;
}
declare class Comment {
    user: Types.ObjectId;
    comment: string;
}
export declare class Order {
    user: Types.ObjectId;
    productDetails: ProductDetail[];
    mode: string;
    paymentMode: string;
    orderNumber: number;
    address: Types.ObjectId;
    status: string;
    cancelationReason?: string;
    cancelationDescription?: string;
    returnReason?: string;
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
