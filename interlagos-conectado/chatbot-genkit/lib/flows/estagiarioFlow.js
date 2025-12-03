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
exports.estagiarioFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const ai_1 = require("@genkit-ai/ai");
const z = __importStar(require("zod"));
exports.estagiarioFlow = (0, flow_1.defineFlow)({
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
}, async ({ user, message, chatHistory, currentContext }) => {
    const contextDescription = currentContext
        ? `O usuário está na página '${currentContext.pageName}' (${currentContext.pageUrl}).`
        : 'O contexto da página é desconhecido.';
    const prompt = `Você é o Estagiário Super Inteligente do 'Interlagos Conectado'.
    Sua função é ajudar com dúvidas técnicas e de uso do app.
    ${contextDescription}
    
    Histórico recente:
    ${chatHistory.map((m) => `${m.sender}: ${m.messageContent}`).join('\n')}
    
    Usuário: "${message}"
    
    Responda de forma direta e técnica, mas acessível. Se ele estiver com problemas, sugira soluções.`;
    const llmResponse = await (0, ai_1.generate)({
        model: 'google-cloud/gemini-1.5-flash',
        prompt: prompt,
        config: {
            temperature: 0.5,
        },
    });
    return {
        responseMessage: llmResponse.text(),
    };
});
//# sourceMappingURL=estagiarioFlow.js.map