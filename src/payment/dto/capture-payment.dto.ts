import { IsInt, Min, IsOptional, IsString } from 'class-validator';


export class CapturePaymentDto {
    @IsString()
    paymentId!: string;


    @IsInt()
    @Min(1)
    amount!: number; // in subunits


    @IsOptional()
    @IsString()
    currency?: string; // e.g., 'INR'
}