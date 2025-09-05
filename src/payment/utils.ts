import { createHmac, timingSafeEqual } from 'crypto';


export function verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
    keySecret: string = process.env.RAZORPAY_KEY_SECRET,
): boolean {
    const payload = `${orderId}|${paymentId}`;
    const expected = createHmac('sha256', keySecret).update(payload).digest('hex');
    // Use timing-safe compare to avoid timing attacks
    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expected, 'hex');
    return sigBuf.length === expBuf.length && timingSafeEqual(sigBuf, expBuf);
}


export function verifyWebhookSignature(
    rawBody: Buffer,
    headerSignature: string,
    secret: string = process.env.RAZORPAY_KEY_SECRET,
): boolean {
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    const sigBuf = Buffer.from(headerSignature, 'hex');
    const expBuf = Buffer.from(expected, 'hex');
    return sigBuf.length === expBuf.length && timingSafeEqual(sigBuf, expBuf);
}