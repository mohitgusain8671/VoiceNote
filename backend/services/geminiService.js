import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

class GeminiService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is required in environment variables');
        }
        
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async generateSummary(transcription) {
        try {
            if (!transcription || transcription.trim().length === 0) {
                throw new Error('Transcription is required for summary generation');
            }

            const prompt = `
                Please provide a concise and well-structured summary of the following text. 
                Focus on the key points, main ideas, and important details. 
                Keep the summary clear and informative while being significantly shorter than the original text.
                
                Text to summarize:
                ${transcription}
                
                Summary:
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const summary = response.text();

            if (!summary || summary.trim().length === 0) {
                throw new Error('Failed to generate summary - empty response');
            }

            return summary.trim();
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error(`Failed to generate summary: ${error.message}`);
        }
    }
    async transcribeAudio(audioFilePath) {
        try {
            if(!fs.existsSync(audioFilePath)) {
                throw new Error('Audio file does not exist');
            }
            const audioBuffer = fs.readFileSync(audioFilePath);
            const transcriptionModel = this.genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                systemInstruction: 'You are a transcription service. Transcribe the following audio precisely. Do not add any extra commentary or information.'
            })
            const audioFile = {
                inlineData: {
                    data: audioBuffer.toString('base64'),
                    mimeType: 'audio/mpeg'
                }
            }

            const prompt = 'Transcribe the following audio:';
            const result = await transcriptionModel.generateContent([prompt, audioFile]);
            const response = await result.response;
            const transcriptionText = response.text();
            if (!transcriptionText || transcriptionText.trim().length === 0) {
                throw new Error('Failed to transcribe audio - empty response');
            }
            
            return {
                success: true,
                transcription: transcriptionText,
                confidence: 1.0,
                duration: null // seconds
            };
            
        } catch (error) {
            console.error('Transcription error:', error);
            return {
                success: false,
                error: 'Failed to transcribe audio',
                transcription: null
            };
        }
    }
}

export default new GeminiService();