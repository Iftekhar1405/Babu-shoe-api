import { IsArray, IsMongoId, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDetailDto {
    @IsMongoId()
    productId: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsArray()
    @IsString({ each: true })
    sizes: string[];

    @IsNumber()
    quantity: number;

    @IsOptional()
    @IsNumber()
    matchedQuantity?: number;
}

class CommentDto {
    @IsMongoId()
    user: string;

    @IsString()
    comment: string;
}

export class CreateOrderDto {
    @IsMongoId()
    vendorId: string;

    @IsArray()
    @Type(() => ProductDetailDto)
    productDetails: ProductDetailDto[];

    @IsOptional()
    @IsMongoId()
    matchedBy?: string;

    @IsOptional()
    matchedAt?: Date;

    @IsOptional()
    @IsString()
    billImgUrl?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    matchPercentage?: number;

    @IsOptional()
    @IsArray()
    @Type(() => CommentDto)
    comments?: CommentDto[];
}
