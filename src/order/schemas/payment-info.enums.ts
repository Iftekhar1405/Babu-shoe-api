// Currencies supported by Razorpay (most common, extend as needed)
export enum PaymentCurrency {
    INR = 'INR',
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
}

// Payment status lifecycle
export enum PaymentStatus {
    CREATED = 'created',
    AUTHORIZED = 'authorized',
    CAPTURED = 'captured',
    REFUNDED = 'refunded',
    FAILED = 'failed',
}

// Payment methods
export enum PaymentMethod {
    CARD = 'card',
    NETBANKING = 'netbanking',
    WALLET = 'wallet',
    UPI = 'upi',
    EMI = 'emi',
    PAYLATER = 'paylater',
    BANK_TRANSFER = 'bank_transfer',
    COD = 'cod', // cash on delivery (custom use case, not Razorpay direct)
}

// Razorpay webhook events (main categories)
export enum RazorpayWebhookEvent {
    PAYMENT_AUTHORIZED = 'payment.authorized',
    PAYMENT_CAPTURED = 'payment.captured',
    PAYMENT_FAILED = 'payment.failed',
    PAYMENT_REFUNDED = 'payment.refunded',

    ORDER_PAID = 'order.paid',

    REFUND_PROCESSED = 'refund.processed',

    SUBSCRIPTION_AUTHENTICATED = 'subscription.authenticated',
    SUBSCRIPTION_CHARGED = 'subscription.charged',
    SUBSCRIPTION_PAUSED = 'subscription.paused',
    SUBSCRIPTION_CANCELLED = 'subscription.cancelled',
    SUBSCRIPTION_COMPLETED = 'subscription.completed',
    SUBSCRIPTION_PENDING = 'subscription.pending',
}

export interface RazorpayOrderResponse {
    id: string;
    entity: "order";
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    offer_id: string | null;
    status: "created" | "attempted" | "paid";
    attempts: number;
    notes: Record<string, any> | any[];
    created_at: number;
}