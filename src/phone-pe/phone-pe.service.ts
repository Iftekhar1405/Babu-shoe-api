import { Injectable, HttpException } from '@nestjs/common';
import {
    StandardCheckoutClient,
    Env,
    StandardCheckoutPayRequest,
    CreateSdkOrderRequest,
} from 'pg-sdk-node';

@Injectable()
export class PhonePeService {
    private client: StandardCheckoutClient;

    constructor() {
        const clientId = process.env.PHONEPE_CLIENT_ID;
        const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
        const clientVersion = Number(process.env.PHONEPE_CLIENT_VERSION);
        const env = process.env.PHONEPE_ENV === 'PRODUCTION' ? Env.PRODUCTION : Env.SANDBOX;

        this.client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);
    }

    async initiatePayment(orderId: string, amountPaise: number, redirectUrl: string) {
        try {
            const request = StandardCheckoutPayRequest.builder()
                .merchantOrderId(orderId)
                .amount(amountPaise)
                .redirectUrl(redirectUrl)
                .build();
            const response = await this.client.pay(request);
            return response; // Contains redirectUrl, state, order_id, expire_at
        } catch (err) {
            throw new HttpException(err.message || 'PhonePe pay error', 500);
        }
    }

    async createSdkOrder(orderId: string, amountPaise: number, redirectUrl: string) {
        try {
            const request = CreateSdkOrderRequest.StandardCheckoutBuilder()
                .merchantOrderId(orderId)
                .amount(amountPaise)
                .redirectUrl(redirectUrl)
                .build();
            return await this.client.createSdkOrder(request);
        } catch (err) {
            throw new HttpException(err.message || 'PhonePe SDK Order error', 500);
        }
    }

    async getOrderStatus(orderId: string) {
        try {
            return await this.client.getOrderStatus(orderId);
        } catch (err) {
            throw new HttpException(err.message || 'PhonePe status error', 500);
        }
    }

    async refund(orderId: string, refundId: string, amountPaise: number) {
        try {
            return await this.client.refund(
                { originalMerchantOrderId: orderId, merchantRefundId: refundId, amount: amountPaise },
            );
        } catch (err) {
            throw new HttpException(err.message || 'PhonePe refund error', 500);
        }
    }

    validateCallback(username: string, password: string, authorization: string, body: string) {
        return this.client.validateCallback(username, password, authorization, body);
    }
}
