import { Body, Controller, Get, Headers, HttpCode, Param, Post, Query, Req } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { CapturePaymentDto } from './dto/capture-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { RefundDto } from './dto/refund.dto';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/create-customer.dto';
import { CreateSubscriptionDto, CancelSubscriptionDto } from './dto/subscription.dto';
import { PaginationQueryDto } from './dto/pagination.dto';
import { verifyWebhookSignature } from './utils';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private readonly svc: PaymentService) { }

    @Post('orders')
    async createOrder(@Body() dto: CreateOrderDto) {
        return await this.svc.createOrder(dto);
    }


    @Get('orders/:id')
    fetchOrder(@Param('id') id: string) {
        return this.svc.fetchOrder(id);
    }


    @Get('orders')
    fetchAllOrders(@Query() q: PaginationQueryDto & { receipt?: string; status?: string }) {
        return this.svc.fetchAllOrders(q);
    }


    @Get('orders/:id/payments')
    fetchPaymentsForOrder(@Param('id') id: string) {
        return this.svc.fetchPaymentsForOrder(id);
    }


    // ── Payments
    @Get('payments/:id')
    fetchPayment(@Param('id') id: string) {
        return this.svc.fetchPayment(id);
    }


    @Get('payments')
    fetchPayments(@Query() q: PaginationQueryDto & { order_id?: string; email?: string; contact?: string }) {
        return this.svc.fetchPayments(q);
    }

    @Post('payments/capture')
    capture(@Body() dto: CapturePaymentDto) {
        return this.svc.capturePayment(dto);
    }


    @Post('/verify')
    verify(@Body() dto: VerifyPaymentDto) {
        return this.svc.verifyPayment(dto.razorpay_order_id, dto.razorpay_payment_id, dto.razorpay_signature);
    }


    // ── Refunds
    @Post('refunds')
    createRefund(@Body() dto: RefundDto) {
        return this.svc.createRefund(dto);
    }


    @Get('refunds/:id')
    fetchRefund(@Param('id') id: string) {
        return this.svc.fetchRefund(id);
    }


    @Get('refunds')
    fetchRefunds(@Query() q: PaginationQueryDto & { payment_id?: string }) {
        return this.svc.fetchRefunds(q);
    }


    // ── Customers
    @Post('customers')
    createCustomer(@Body() dto: CreateCustomerDto) {
        return this.svc.createCustomer(dto);
    }


    @Get('customers/:id')
    fetchCustomer(@Param('id') id: string) {
        return this.svc.fetchCustomer(id);
    }


    @Post('customers/:id')
    updateCustomer(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
        return this.svc.updateCustomer(id, dto);
    }


    @Post('subscriptions')
    createSubscription(@Body() dto: CreateSubscriptionDto) {
        return this.svc.createSubscription(dto);
    }


    @Post('subscriptions/:id/cancel')
    cancelSubscription(@Param('id') id: string, @Body() dto: CancelSubscriptionDto) {
        return this.svc.cancelSubscription(id, dto);
    }


    @Get('subscriptions/:id')
    fetchSubscription(@Param('id') id: string) {
        return this.svc.fetchSubscription(id);
    }


    // ── Webhook
    /**
    * NOTE: requires raw body capture in main.ts; see below.
    */
    @Post('webhook')
    @HttpCode(200)
    handleWebhook(
        @Req() req: any,
        @Headers('x-razorpay-signature') signature: string,
    ) {
        const raw = req.rawBody as Buffer; // set by body-parser json verify hook
        if (!raw || !signature) return { status: 'ignored' };


        const ok = verifyWebhookSignature(raw, signature);
        if (!ok) return { status: 'invalid' };


        const event = req.body; // parsed JSON


        // TODO: idempotency using `x-razorpay-event-id` header and your DB
        // Handle events: payment.captured, refund.processed, subscription.charged, etc.


        return { status: 'ok' };
    }
}