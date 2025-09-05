import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsBoolean } from 'class-validator';


export class CreateCustomerDto {
    @IsString()
    name!: string;


    @IsOptional()
    @IsEmail()
    email?: string;


    @IsOptional()
    @IsPhoneNumber('IN')
    contact?: string;


    @IsOptional()
    @IsBoolean()
    fail_existing?: boolean;


    @IsOptional()
    gstin?: string;
}


export class UpdateCustomerDto {
    @IsOptional()
    @IsString()
    name?: string;


    @IsOptional()
    @IsEmail()
    email?: string;


    @IsOptional()
    @IsPhoneNumber('IN')
    contact?: string;


    @IsOptional()
    gstin?: string;
}