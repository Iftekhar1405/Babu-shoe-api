import { IsMongoId, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateBillItemDto {
  @IsMongoId()
  productId: string;
  
  @IsOptional()
  @IsString()
  color?: string;
  
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent?: number;
}