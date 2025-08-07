import { IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  password: string;
}