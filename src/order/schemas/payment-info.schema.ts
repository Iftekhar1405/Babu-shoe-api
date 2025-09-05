import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PaymentCurrency, PaymentMethod, PaymentStatus, RazorpayWebhookEvent } from './payment-info.enums';


export type PaymentInfoDocument = PaymentInfo & Document;

@Schema({ timestamps: true, collection: 'paymentInfo' })
export class PaymentInfo {
    @Prop({ required: true })
    orderId: string;

    @Prop({ required: true })
    paymentId: string;

    @Prop()
    signature: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ enum: PaymentCurrency, default: PaymentCurrency.INR })
    currency: PaymentCurrency;

    @Prop({ enum: PaymentStatus, default: PaymentStatus.CREATED })
    status: PaymentStatus;

    @Prop({ enum: PaymentMethod })
    method: PaymentMethod;

    @Prop()
    email: string;

    @Prop()
    contact: string;

    @Prop({ type: Object })
    notes: Record<string, any>;

    @Prop()
    receipt: string;

    @Prop({ type: Object })
    rawResponse: Record<string, any>;

    @Prop()
    capturedAt?: Date;

    @Prop()
    refundedAt?: Date;

    @Prop()
    refundId?: string;

    @Prop()
    customerId?: string;

    @Prop({ default: false })
    verified: boolean;

    @Prop({ enum: RazorpayWebhookEvent })
    webhookEvent?: RazorpayWebhookEvent;
}

export const PaymentInfoSchema = SchemaFactory.createForClass(PaymentInfo);
