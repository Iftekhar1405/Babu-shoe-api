import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class OpenaiService {

    private client: OpenAI;
    private geminiClient: GoogleGenerativeAI;

    constructor() {
        this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }

    async generateEmbedding(text: string, model: 'text-embedding-3-large' | 'text-embedding-3-small' = 'text-embedding-3-large') {
        const res = await this.client.embeddings.create({
            model,
            input: text,
        });
        return res.data[0].embedding;
    }

    async generateGeminiEmbedding(input: string | object) {
        const text = typeof input === 'string' ? input : JSON.stringify(input);
        const model = this.geminiClient.getGenerativeModel({ model: 'embedding-001' });
        const res = await model.embedContent(text);
        return res.embedding.values; // array of numbers
    }


    async transcribeAudio(filePath: string) {
        const transcription = await this.client.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: 'whisper-1',
        });
        return transcription.text;
    }

    estimateEmbeddingCost(tokenCount: number, model: 'text-embedding-3-large' | 'text-embedding-3-small') {
        const costPerMillion = model === 'text-embedding-3-large' ? 0.065 : 0.01;
        return (tokenCount / 1_000_000) * costPerMillion;
    }

    estimateWhisperCost(durationMinutes: number) {
        return durationMinutes * 0.006;
    }
}