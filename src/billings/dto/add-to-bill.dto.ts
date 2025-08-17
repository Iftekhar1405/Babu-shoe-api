import { Type } from "class-transformer";
import { IsMongoId , IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from "class-validator";


export class AddToBillDTO {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  discountPercent: number;

  @IsString()
  @IsOptional()
  salesPerson?: string;
}
