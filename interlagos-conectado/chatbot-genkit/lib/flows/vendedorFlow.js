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
exports.vendedorFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const ai_1 = require("@genkit-ai/ai");
const z = __importStar(require("zod"));
const firebase_1 = require("../firebase");
exports.vendedorFlow = (0, flow_1.defineFlow)({
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
}, async ({ user, message, chatHistory }) => {
    // Buscar planos ativos
    const plansSnap = await firebase_1.db.collection('plans').where('isActive', '==', true).get();
    const plans = plansSnap.docs.map(d => d.data());
    const plansContext = plans.map(p => `- ${p.name} (${p.currency} ${p.price}): ${p.description}. Benefícios: ${p.features.join(', ')}`).join('\n');
    const prompt = `Você é o Vendedor do 'Interlagos Conectado'.
    Seu objetivo é vender planos de destaque para comerciantes.
    
    Planos Disponíveis:
    ${plansContext}
    
    Histórico recente:
    ${chatHistory.map((m) => `${m.sender}: ${m.messageContent}`).join('\n')}
    
    Usuário: "${message}"
    
    Use técnicas de venda persuasiva. Enfatize os benefícios. Se o usuário perguntar preço, seja claro.`;
    const llmResponse = await (0, ai_1.generate)({
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
});
//# sourceMappingURL=vendedorFlow.js.map