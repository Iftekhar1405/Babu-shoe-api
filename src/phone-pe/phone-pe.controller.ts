import { Controller, Post, Body, Get, Param, Req, Res } from '@nestjs/common';
import { PhonePeService } from './phone-pe.service';

@Controller('payments/phonepe')
export class PaymentsController {
    constructor(private readonly phonePeService: PhonePeService) { }

    @Post('initiate')
    async initiate(@Body() body: { orderId: string; amountPaise: number; redirectUrl: string }) {
        return this.phonePeService.initiatePayment(body.orderId, body.amountPaise, body.redirectUrl);
    }

    @Get('status/:orderId')
    async status(@Param('orderId') orderId: string) {
        return this.phonePeService.getOrderStatus(orderId);
    }

    @Post('refund')
    async refund(@Body() body: { orderId: string; refundId: string; amountPaise: number }) {
        return this.phonePeService.refund(body.orderId, body.refundId, body.amountPaise);
    }

    @Post('callback')
    async callback(@Req() req, @Res() res) {
        const username = process.env.PHONEPE_CALLBACK_USERNAME;
        const password = process.env.PHONEPE_CALLBACK_PASSWORD;
        const authHeader = req.headers['authorization'] as string;
        const bodyStr = JSON.stringify(req.body);

        const callbackResp = this.phonePeService.validateCallback(username, password, authHeader, bodyStr);
        // Process callbackResp.payload & update DB accordingly
        return res.status(200).send('OK');
    }
}
