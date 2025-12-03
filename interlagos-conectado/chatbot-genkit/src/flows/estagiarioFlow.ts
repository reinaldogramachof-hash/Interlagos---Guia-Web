import { defineFlow } from '@genkit-ai/flow';
import { generate } from '@genkit-ai/ai';
import * as z from 'zod';

export const estagiarioFlow = defineFlow(
    {
        name: 'estagiarioFlow',
        inputSchema: z.object({
            user: z.any(),
            message: z.string(),
            chatHistory: z.array(z.any()),
            currentContext: z.any(),
        }),
        outputSchema: z.object({
            responseMessage: z.string(),
            suggestedActions: z.array(z.any()).optional(),
        }),
    },
    async ({ user, message, chatHistory, currentContext }) => {
        const contextDescription = currentContext
            ? `O usuário está na página '${currentContext.pageName}' (${currentContext.pageUrl}).`
            : 'O contexto da página é desconhecido.';

        const prompt = `Você é o Estagiário Super Inteligente do 'Interlagos Conectado'.
    Sua função é ajudar com dúvidas técnicas e de uso do app.
    ${contextDescription}
    
    Histórico recente:
    ${chatHistory.map((m: any) => `${m.sender}: ${m.messageContent}`).join('\n')}
    
    Usuário: "${message}"
    
    Responda de forma direta e técnica, mas acessível. Se ele estiver com problemas, sugira soluções.`;

        const llmResponse = await generate({
            model: 'google-cloud/gemini-1.5-flash',
            prompt: prompt,
            config: {
                temperature: 0.5,
            },
        });

        return {
            responseMessage: llmResponse.text(),
        };
    }
);
