import { IsArray, IsInt, IsObject, IsOptional, IsString, Min, IsBoolean } from 'class-validator';


export class CreateSubscriptionDto {
    @IsString()
    plan_id!: string;


    @IsOptional()
    @IsInt()
    @Min(1)
    total_count?: number; // number of billing cycles


    @IsOptional()
    @IsInt()
    start_at?: number; // unix timestamp


    @IsOptional()
    @IsBoolean()
    customer_notify?: boolean;


    @IsOptional()
    @IsObject()
    notes?: Record<string, any>;


    @IsOptional()
    @IsArray()
    addons?: Array<{ item: { name: string; amount: number; currency: string } }>;
}


export class CancelSubscriptionDto {
    @IsOptional()
    @IsBoolean()
    cancel_at_cycle_end?: boolean;
}