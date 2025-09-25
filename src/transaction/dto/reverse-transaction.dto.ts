import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class ReverseTransactionDto {
    @IsMongoId()
    transactionId: string;

    @IsOptional()
    @IsString()
    reason?: string;

    // optional idempotency key to avoid double reversals
    @IsOptional()
    @IsString()
    idempotencyKey?: string;
}
