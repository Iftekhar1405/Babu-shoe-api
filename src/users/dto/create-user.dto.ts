import { IsString, IsNotEmpty, IsPhoneNumber, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';


export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}