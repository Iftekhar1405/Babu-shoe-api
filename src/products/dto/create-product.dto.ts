import { IsString, IsUrl, IsNotEmpty, IsNumber, IsPositive, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

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
}