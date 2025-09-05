import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { CapturePaymentDto } from './dto/capture-payment.dto';
import { RefundDto } from './dto/refund.dto';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/create-customer.dto';
import { CreateSubscriptionDto, CancelSubscriptionDto } from './dto/subscription.dto';
import { PaginationQueryDto } from './dto/pagination.dto';
import { verifyPaymentSignature } from './utils';
import Razorpay = require('razorpay');


@Injectable()
export class PaymentService {
    private razorpay: Razorpay;

    constructor() {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID as string,
            key_secret: process.env.RAZORPAY_KEY_SECRET as string,
        });
    }

    async createOrder(dto: CreateOrderDto) {
        return await this.razorpay.orders.create({
            amount: dto.amount,
            currency: dto.currency,
            receipt: dto.receipt,
            notes: dto.notes,
            partial_payment: dto.partial_payment,
        });
    }


    fetchOrder(orderId: string) {
        return this.razorpay.orders.fetch(orderId);
    }


    fetchAllOrders(query: PaginationQueryDto & { receipt?: string; status?: string }) {
        return this.razorpay.orders.all(query as any);
    }


    fetchPaymentsForOrder(orderId: string) {
        return this.razorpay.orders.fetchPayments(orderId);
    }


    // ── Payments ──────────────────────────────────────────────────────────────
    fetchPayment(paymentId: string) {
        return this.razorpay.payments.fetch(paymentId);
    }

    fetchPayments(query: PaginationQueryDto & { order_id?: string; email?: string; contact?: string }) {
        return this.razorpay.payments.all(query as any);
    }


    capturePayment(dto: CapturePaymentDto) {
        return this.razorpay.payments.capture(dto.paymentId, dto.amount, dto.currency as any);
    }


    verifyPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string) {
        const ok = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!ok) throw new BadRequestException('Invalid payment signature');
        return { success: true };
    }


    // ── Refunds ───────────────────────────────────────────────────────────────
    createRefund(dto: RefundDto) {
        return this.razorpay.payments.refund(dto.paymentId, {
            amount: dto.amount,
            speed: dto.speed,
            receipt: dto.receipt,
            notes: dto.notes,
        } as any);
    }


    fetchRefund(refundId: string) {
        return this.razorpay.refunds.fetch(refundId);
    }


    fetchRefunds(query: PaginationQueryDto & { payment_id?: string }) {
        return this.razorpay.refunds.all(query as any);
    }

    createCustomer(dto: CreateCustomerDto) {
        return this.razorpay.customers.create(dto as any);
    }


    fetchCustomer(id: string) {
        return this.razorpay.customers.fetch(id);
    }


    updateCustomer(id: string, dto: UpdateCustomerDto) {
        return this.razorpay.customers.edit(id, dto as any);
    }


    // ── Subscriptions ────────────────────────────────────────────────────────
    createSubscription(dto: CreateSubscriptionDto) {
        return this.razorpay.subscriptions.create(dto as any);
    }


    cancelSubscription(id: string, dto: CancelSubscriptionDto) {
        return this.razorpay.subscriptions.cancel(id, dto as any);
    }


    fetchSubscription(id: string) {
        return this.razorpay.subscriptions.fetch(id);
    }
}
