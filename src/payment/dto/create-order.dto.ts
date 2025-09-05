import { IsInt, Min, IsOptional, IsString, IsIn, IsObject, IsBoolean } from 'class-validator';


export class CreateOrderDto {
    @IsInt()
    @Min(1)
    amount!: number; // in subunits (paise)


    @IsString()
    @IsIn(['INR', 'USD', 'EUR']) // extend as needed
    currency: string = 'INR';


    @IsString()
    receipt!: string;


    @IsOptional()
    @IsObject()
    notes?: Record<string, any>;


    @IsOptional()
    @IsBoolean()
    partial_payment?: boolean;
}