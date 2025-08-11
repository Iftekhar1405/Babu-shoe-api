
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;
}


import { PartialType } from '@nestjs/mapped-types';


export class UpdateTagDto extends PartialType(CreateTagDto) {}
