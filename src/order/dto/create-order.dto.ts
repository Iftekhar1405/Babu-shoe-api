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
import { ORDER_CANCELATION_REASON, ORDER_MODE, ORDER_PAYMENT_MODE, ORDER_RETURN_REASON, ORDER_STATUS } from '../schemas/order.schema';

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

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDetailDto)
    productDetails: ProductDetailDto[];

    @IsEnum(ORDER_MODE)
    mode: string;

    @IsEnum(ORDER_PAYMENT_MODE)
    paymentMode: string;

    @IsMongoId()
    @IsNotEmpty()
    address: string;

    @IsOptional()
    @IsEnum(ORDER_CANCELATION_REASON)
    cancelationReason?: string;

    @IsOptional()
    @IsString()
    cancelationDescription?: string;

    @IsOptional()
    @IsEnum(ORDER_RETURN_REASON)
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
