import {
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumber,
    IsArray,
    ValidateNested,
    IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductDetailDto {
    @IsMongoId()
    @IsNotEmpty()
    projectId: string;

    @IsNumber()
    @IsNotEmpty()
    quatity: number;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsNumber()
    @IsNotEmpty()
    discountPercent: number;
}

class CommentDto {
    @IsMongoId()
    @IsNotEmpty()
    user: string;

    @IsString()
    @IsNotEmpty()
    comment: string;
}

export class CreateOrderDto {
    @IsMongoId()
    @IsNotEmpty()
    user: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDetailDto)
    productDetails: ProductDetailDto[];

    @IsEnum(['offline', 'online'])
    mode: 'offline' | 'online';

    @IsEnum(['UPI', 'Cash', 'credit'])
    paymentMode: 'UPI' | 'Cash' | 'credit';

    // `orderNumber` is auto-calculated in service, so it's optional here
    @IsOptional()
    @IsNumber()
    orderNumber?: number;

    @IsMongoId()
    @IsNotEmpty()
    address: string;

    @IsEnum([
        'pending',
        'confirmed',
        'packed',
        'dispatched',
        'outfordeliver',
        'delivered',
        'cancelled',
        'return',
    ])
    status: string;

    @IsOptional()
    @IsEnum(['customer_cancel', 'inventory_issue', 'others'])
    cancelationReason?: string;

    @IsOptional()
    @IsString()
    cancelationDescription?: string;

    @IsOptional()
    @IsEnum(['damaged', 'wrong_product', 'others'])
    returnReason?: string;

    @IsOptional()
    @IsString()
    returnDescription?: string;

    @IsOptional()
    @IsDateString()
    deliveryDate?: Date;

    @IsOptional()
    @IsMongoId()
    shippingPartner?: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsOptional()
    @IsString()
    trackingId?: string;

    @IsOptional()
    @IsDateString()
    paidAt?: Date;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CommentDto)
    comments?: CommentDto[];
}
