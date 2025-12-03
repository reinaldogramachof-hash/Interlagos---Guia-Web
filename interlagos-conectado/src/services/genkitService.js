import { auth } from '../firebaseConfig';
import { getToken } from 'firebase/app-check';
// Import appCheck if initialized in firebaseConfig, otherwise handle gracefully
// import { appCheck } from '../firebaseConfig'; 

const GENKIT_API_URL = 'http://localhost:5001/interlagos-conectado/us-central1/mainChatFlow'; // Local emulator URL for testing
// const GENKIT_API_URL = 'https://mainchatflow-YOUR_PROJECT_ID.a.run.app'; // Production URL

export const sendMessageToGenkit = async ({ message, context, userProfile, history = [] }) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("Usuário não autenticado.");
        }

        const token = await user.getIdToken();

        // App Check Token (Placeholder - uncomment when App Check is configured)
        // let appCheckToken = '';
        // try {
        //     if (appCheck) {
        //         const tokenResult = await getToken(appCheck, /* forceRefresh */ false);
        //         appCheckToken = tokenResult.token;
        //     }
        // } catch (e) {
        //     console.warn("Erro ao obter App Check token:", e);
        // }

        const payload = {
            userId: user.uid,
            message: message,
            currentContext: context,
            userProfile: {
                name: user.displayName || 'Usuário',
                isPremium: false, // Pode vir do Firestore no futuro
                hasCompletedOnboarding: true // Assumindo true se já está logado e usando
            },
            locale: 'pt-BR',
            timestamp: new Date().toISOString()
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // if (appCheckToken) {
        //     headers['X-Firebase-AppCheck'] = appCheckToken;
        // }

        const response = await fetch(GENKIT_API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        // Genkit returns { result: { ...outputSchema } }
        return data.result;

    } catch (error) {
        console.error("Erro ao enviar mensagem para Genkit:", error);
        throw error;
    }
};
