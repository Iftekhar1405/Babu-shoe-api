import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Customer } from 'src/customer/schema/customer.schema';
import { Order } from 'src/order/schemas/order.schema';

export type TransactionDocument = Transaction & Document;

export enum TransactionType {
    CHARGE = 'CHARGE', // e.g. invoice / sell-on-credit (increases customer's outstanding)
    PAYMENT = 'PAYMENT', // e.g. customer pays money (decreases outstanding)
    REFUND = 'REFUND', // refund to customer (decreases outstanding or recorded separately)
    ADJUSTMENT = 'ADJUSTMENT', // manual correction (signedAmount must be provided in metadata or service)
    REVERSAL = 'REVERSAL', // reversal of a previous transaction
}

@Schema({ timestamps: true })
export class Transaction {
    @Prop({ type: Types.ObjectId, ref: Customer.name, required: true, index: true })
    customerId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Order.name, index: true })
    orderId?: Types.ObjectId;

    @Prop({ enum: TransactionType, required: true })
    type: TransactionType;

    // positive number, absolute amount of the transaction
    @Prop({ type: Number, required: true, min: 0 })
    amount: number;

    // signedAmount: the real delta to apply to the customer's balance.
    // e.g. for CHARGE it's +amount, for PAYMENT it's -amount, for ADJUSTMENT it may be +/- depending on intent
    @Prop({ type: Number, required: true })
    signedAmount: number;

    // customer balance after applying this transaction (stored for quick ledger reads)
    @Prop({ type: Number })
    balanceAfter?: number;

    @Prop({ type: String })
    paymentMethod?: string; // optional enum like 'CASH'|'UPI'|'BANK' etc.

    @Prop({ type: String })
    remarks?: string;

    // idempotency key to prevent duplicate creation from retries
    @Prop({ type: String })
    idempotencyKey?: string;

    // if this transaction is a reversal, point to the original
    @Prop({ type: Types.ObjectId, ref: 'Transaction' })
    reversedFrom?: Types.ObjectId;

    @Prop({ type: Boolean, default: false })
    isReversed: boolean;

    // free-form metadata map for extensibility
    @Prop({ type: Object })
    metadata?: Record<string, any>;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Indexes: compound idempotency per customer (helps in multi-tenant/idempotent clients)
TransactionSchema.index({ customerId: 1, createdAt: -1 });
TransactionSchema.index({ orderId: 1 });
