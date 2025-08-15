import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsappService {
    private readonly token = process.env.WHATSAPP_TOKEN;
    private readonly phoneNumberId = process.env.PHONE_NUMBER_ID;
    private readonly apiUrl = 'https://graph.facebook.com/v20.0';

    async sendMessage(to: string, message: string) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/${this.phoneNumberId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to,
                    text: { body: message },
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            return response.data;
        } catch (error) {
            console.error('Error sending WhatsApp message:', error.response?.data || error.message);
            throw error;
        }
    }
}
