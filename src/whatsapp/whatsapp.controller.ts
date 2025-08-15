import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
    constructor(private readonly whatsappService: WhatsappService) { }

    @Post('send')
    async send(@Body() body: { phone: string; message: string }) {
        return this.whatsappService.sendMessage(body.phone, body.message);
    }
}
