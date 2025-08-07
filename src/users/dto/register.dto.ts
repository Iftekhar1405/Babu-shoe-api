import { IsString, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  password: string;
}