import { defineFlow } from '@genkit-ai/flow';
import { generate } from '@genkit-ai/ai';
import * as z from 'zod';
import { db } from '../firebase';

export const vendedorFlow = defineFlow(
    {
        name: 'vendedorFlow',
        inputSchema: z.object({
            user: z.any(),
            message: z.string(),
            chatHistory: z.array(z.any()),
        }),
        outputSchema: z.object({
            responseMessage: z.string(),
            suggestedActions: z.array(z.any()).optional(),
            data: z.any().optional(),
        }),
    },
    async ({ user, message, chatHistory }) => {
        // Buscar planos ativos
        const plansSnap = await db.collection('plans').where('isActive', '==', true).get();
        const plans = plansSnap.docs.map(d => d.data());

        const plansContext = plans.map(p =>
            `- ${p.name} (${p.currency} ${p.price}): ${p.description}. Benefícios: ${p.features.join(', ')}`
        ).join('\n');

        const prompt = `Você é o Vendedor do 'Interlagos Conectado'.
    Seu objetivo é vender planos de destaque para comerciantes.
    
    Planos Disponíveis:
    ${plansContext}
    
    Histórico recente:
    ${chatHistory.map((m: any) => `${m.sender}: ${m.messageContent}`).join('\n')}
    
    Usuário: "${message}"
    
    Use técnicas de venda persuasiva. Enfatize os benefícios. Se o usuário perguntar preço, seja claro.`;

        const llmResponse = await generate({
            model: 'google-cloud/gemini-1.5-flash',
            prompt: prompt,
            config: {
                temperature: 0.8,
            },
        });

        return {
            responseMessage: llmResponse.text(),
            suggestedActions: [
                { label: 'Ver Planos', action: 'open_modal_plans' }
            ]
        };
    }
);
