import { IsMongoId, IsOptional, IsString } from "class-validator";

export class RemoveBillItemDto {
  @IsMongoId()
  productId: string;
  
  @IsOptional()
  @IsString()
  color?: string;
}