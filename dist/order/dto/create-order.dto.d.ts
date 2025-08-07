declare class ProductDetailDto {
    projectId: string;
    quatity: number;
    color: string;
    amount: number;
    discountPercent: number;
}
declare class CommentDto {
    user: string;
    comment: string;
}
export declare class CreateOrderDto {
    user: string;
    productDetails: ProductDetailDto[];
    mode: 'offline' | 'online';
    paymentMode: 'UPI' | 'Cash' | 'credit';
    orderNumber?: number;
    address: string;
    status: string;
    cancelationReason?: string;
    cancelationDescription?: string;
    returnReason?: string;
    returnDescription?: string;
    deliveryDate?: Date;
    shippingPartner?: string;
    phoneNumber: string;
    trackingId?: string;
    paidAt?: Date;
    comments?: CommentDto[];
}
export {};
