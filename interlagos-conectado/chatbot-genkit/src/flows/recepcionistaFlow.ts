import { defineFlow } from '@genkit-ai/flow';
import { generate } from '@genkit-ai/ai';
import * as z from 'zod';
import { db } from '../firebase';

export const recepcionistaFlow = defineFlow(
    {
        name: 'recepcionistaFlow',
        inputSchema: z.object({
            user: z.any(),
            message: z.string(),
        }),
        outputSchema: z.object({
            responseMessage: z.string(),
            suggestedActions: z.array(z.any()).optional(),
        }),
    },
    async ({ user, message }) => {
        const displayName = user?.displayName || 'Visitante';
        const isFirstAccess = !user?.hasCompletedOnboarding;

        let prompt = '';
        if (isFirstAccess) {
            prompt = `Você é a Recepcionista do 'Interlagos Conectado', um guia digital do bairro.
      O usuário ${displayName} acabou de chegar. Dê as boas-vindas calorosas, explique brevemente que aqui ele encontra comércios locais, notícias e pode fazer doações.
      Seja simpática e breve.
      Mensagem do usuário: "${message}"`;

            // Update onboarding status
            if (user?.uid) {
                await db.collection('users').doc(user.uid).update({ hasCompletedOnboarding: true });
            }
        } else {
            prompt = `Você é a Recepcionista do 'Interlagos Conectado'.
      O usuário ${displayName} disse: "${message}".
      Responda de forma útil e amigável, guiando-o para as seções do app (Comércios, Notícias, Doações).`;
        }

        const llmResponse = await generate({
            model: 'google-cloud/gemini-1.5-flash',
            prompt: prompt,
            config: {
                temperature: 0.7,
            },
        });

        return {
            responseMessage: llmResponse.text(),
            suggestedActions: isFirstAccess ? [
                { label: 'Ver Comércios', action: 'navigate', payload: 'merchants' },
                { label: 'Ler Notícias', action: 'navigate', payload: 'news' }
            ] : []
        };
    }
);
