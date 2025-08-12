import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  MaxLength,
  IsArray,
  IsOptional,
  ValidateNested,
  IsMongoId,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

export class ProductColorImageDto {
  @IsString()
  @IsNotEmpty()
  color: string;

  @IsArray()
  @IsString({ each: true })
  urls: string[];

  @IsArray()
  @IsString({ each: true })
  availableSize: string[];
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  articleNo: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductColorImageDto)
  colors?: ProductColorImageDto[];

  @IsOptional()
  // @IsMongoId()
  companyId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  embedding: number[]

}
