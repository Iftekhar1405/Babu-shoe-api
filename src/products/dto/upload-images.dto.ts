import { IsString, IsNotEmpty, IsArray, IsOptional } from "class-validator";

export class UploadImagesDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  colors: string[];
}

export class ColorImageUploadDto {
  @IsArray()
  @IsOptional()
  images?: Express.Multer.File[];
}

export class UploadImagesResponseDto {
  [color: string]: string[];
}
