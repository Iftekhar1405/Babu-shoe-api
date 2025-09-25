import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { TransactionType } from '../schema/transaction.schema';

export class CreateTransactionDto {
    @IsMongoId()
    customerId: string;

    @IsOptional()
    @IsMongoId()
    orderId?: string;

    @IsEnum(TransactionType)
    type: TransactionType;

    @IsNumber()
    amount: number;

    @IsOptional()
    @IsString()
    paymentMethod?: string;

    @IsOptional()
    @IsString()
    remarks?: string;

    // optional idempotency key for retry protection
    @IsOptional()
    @IsString()
    idempotencyKey?: string;

    // for ADJUSTMENT transactions you may optionally supply signedAmount in metadata
    @IsOptional()
    metadata?: Record<string, any>;
}
