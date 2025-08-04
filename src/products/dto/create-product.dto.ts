import {
  IsString,
  IsUrl,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  MaxLength,
  IsArray,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class ProductColorImageDto {
  @IsString()
  @IsNotEmpty()
  color: string;

  @IsArray()
  @IsString({ each: true })
  urls: string[];
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
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
}
