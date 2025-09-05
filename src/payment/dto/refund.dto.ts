import { IsInt, IsOptional, IsString, Min, IsIn, IsObject } from 'class-validator';


export class RefundDto {
    @IsString()
    paymentId!: string;


    @IsOptional()
    @IsInt()
    @Min(1)
    amount?: number; // if omitted => full refund


    @IsOptional()
    @IsIn(['normal', 'optimum', 'instant'])
    speed?: 'normal' | 'optimum' | 'instant';


    @IsOptional()
    @IsString()
    receipt?: string;


    @IsOptional()
    @IsObject()
    notes?: Record<string, any>;
}