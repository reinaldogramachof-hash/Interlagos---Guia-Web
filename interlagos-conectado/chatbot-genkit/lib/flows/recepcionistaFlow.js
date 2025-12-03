"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.recepcionistaFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const ai_1 = require("@genkit-ai/ai");
const z = __importStar(require("zod"));
const firebase_1 = require("../firebase");
exports.recepcionistaFlow = (0, flow_1.defineFlow)({
    name: 'recepcionistaFlow',
    inputSchema: z.object({
        user: z.any(),
        message: z.string(),
    }),
    outputSchema: z.object({
        responseMessage: z.string(),
        suggestedActions: z.array(z.any()).optional(),
    }),
}, async ({ user, message }) => {
    const displayName = (user === null || user === void 0 ? void 0 : user.displayName) || 'Visitante';
    const isFirstAccess = !(user === null || user === void 0 ? void 0 : user.hasCompletedOnboarding);
    let prompt = '';
    if (isFirstAccess) {
        prompt = `Você é a Recepcionista do 'Interlagos Conectado', um guia digital do bairro.
      O usuário ${displayName} acabou de chegar. Dê as boas-vindas calorosas, explique brevemente que aqui ele encontra comércios locais, notícias e pode fazer doações.
      Seja simpática e breve.
      Mensagem do usuário: "${message}"`;
        // Update onboarding status
        if (user === null || user === void 0 ? void 0 : user.uid) {
            await firebase_1.db.collection('users').doc(user.uid).update({ hasCompletedOnboarding: true });
        }
    }
    else {
        prompt = `Você é a Recepcionista do 'Interlagos Conectado'.
      O usuário ${displayName} disse: "${message}".
      Responda de forma útil e amigável, guiando-o para as seções do app (Comércios, Notícias, Doações).`;
    }
    const llmResponse = await (0, ai_1.generate)({
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
});
//# sourceMappingURL=recepcionistaFlow.js.map