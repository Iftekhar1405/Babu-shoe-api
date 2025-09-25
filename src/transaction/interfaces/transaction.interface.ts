import { TransactionType } from '../schema/transaction.schema';
import { Types } from 'mongoose';

export interface ICreateTransaction {
    customerId: Types.ObjectId | string;
    orderId?: Types.ObjectId | string;
    type: TransactionType;
    amount: number;
    paymentMethod?: string;
    remarks?: string;
    idempotencyKey?: string;
    metadata?: Record<string, any>;
    createdBy?: Types.ObjectId | string; // user who created the transaction
}
