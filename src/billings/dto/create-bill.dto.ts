import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

class CreateProductDetailDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsNumber()
  discountPercent: number;

  @IsNumber()
  finalPrice: number;

  @IsOptional()
  @IsString()
  salesPerson?: string;
}

export class CreateBillDto {
  @IsArray()
  @Type(() => CreateProductDetailDto)
  items: CreateProductDetailDto[];

  @IsBoolean()
  billPrinted: boolean;

  @IsNumber()
  totalAmount: number;
}
