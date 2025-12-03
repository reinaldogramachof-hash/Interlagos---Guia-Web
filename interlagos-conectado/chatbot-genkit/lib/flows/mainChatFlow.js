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
exports.mainChatFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const firebase_1 = require("../firebase");
const recepcionistaFlow_1 = require("./recepcionistaFlow");
const estagiarioFlow_1 = require("./estagiarioFlow");
const vendedorFlow_1 = require("./vendedorFlow");
const ChatInputSchema = z.object({
    userId: z.string(),
    message: z.string(),
    currentContext: z.object({
        pageName: z.string(),
        pageUrl: z.string(),
        actionInProgress: z.string().optional(),
        selectedItemId: z.string().optional(),
    }).optional(),
    userProfile: z.object({
        name: z.string(),
        isPremium: z.boolean(),
        hasCompletedOnboarding: z.boolean(),
    }).optional(),
    locale: z.string().optional().default('pt-BR'),
    timestamp: z.string().optional(),
});
exports.mainChatFlow = (0, flow_1.defineFlow)({
    name: 'mainChatFlow',
    inputSchema: ChatInputSchema,
}, async (input) => {
    const { userId, message, currentContext } = input;
    // --- SEGURANÇA: Validação de Input ---
    if (!message || message.trim().length === 0) {
        throw new Error("Mensagem inválida.");
    }
    if (message.length > 500) {
        throw new Error("Mensagem muito longa. Por favor, seja mais breve (máx 500 caracteres).");
    }
    // 1. Fetch User Data (if not fully provided or to get history)
    const userDocRef = firebase_1.db.collection('users').doc(userId);
    const userDocSnap = await userDocRef.get();
    const userData = userDocSnap.data();
    // 2. Fetch Chat History (Window of last 10 messages)
    const historySnap = await userDocRef.collection('chatHistory')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get();
    // Reverse to get chronological order
    const chatHistory = historySnap.docs.map(d => d.data()).reverse();
    // --- SEGURANÇA: Rate Limiting Básico ---
    // Verifica se a última mensagem do usuário foi há menos de 2 segundos
    const lastUserMsg = chatHistory.slice().reverse().find((m) => m.sender === 'user');
    if (lastUserMsg && lastUserMsg.timestamp) {
        // Handle Firestore Timestamp or Date string
        const lastTime = lastUserMsg.timestamp.toDate ? lastUserMsg.timestamp.toDate().getTime() : new Date(lastUserMsg.timestamp).getTime();
        const now = new Date().getTime();
        if (now - lastTime < 2000) {
            return {
                responseMessage: "Você está enviando mensagens muito rápido. Aguarde um instante.",
                personaUsed: "system"
            };
        }
    }
    // 3. Router Logic
    let selectedPersona = 'recepcionista';
    // Priority 1: Onboarding
    if (userData && !userData.hasCompletedOnboarding) {
        selectedPersona = 'recepcionista';
    }
    // Priority 2: Purchase Intent
    else if (/(preço|valor|custo|premium|destaque|assinar|comprar|plano)/i.test(message)) {
        selectedPersona = 'vendedor';
    }
    // Priority 3: Contextual Help
    else if (/(como|onde|erro|não consigo|ajuda)/i.test(message) && currentContext) {
        selectedPersona = 'estagiario';
    }
    // Priority 4: Fallback
    else {
        // Default to recepcionista for general chat or estagiario for specific pages
        if ((currentContext === null || currentContext === void 0 ? void 0 : currentContext.pageName) === 'AdminPanel') {
            selectedPersona = 'estagiario';
        }
        else {
            selectedPersona = 'recepcionista';
        }
    }
    // 4. Delegate to Persona Flow
    let response;
    switch (selectedPersona) {
        case 'vendedor':
            response = await (0, flow_1.runFlow)(vendedorFlow_1.vendedorFlow, { user: userData, message, chatHistory });
            break;
        case 'estagiario':
            response = await (0, flow_1.runFlow)(estagiarioFlow_1.estagiarioFlow, { user: userData, message, chatHistory, currentContext });
            break;
        case 'recepcionista':
        default:
            response = await (0, flow_1.runFlow)(recepcionistaFlow_1.recepcionistaFlow, { user: userData, message });
            break;
    }
    // 5. Save User Message and Bot Response to History
    const now = new Date();
    await userDocRef.collection('chatHistory').add({
        timestamp: now,
        sender: 'user',
        messageContent: message
    });
    await userDocRef.collection('chatHistory').add({
        timestamp: new Date(now.getTime() + 100), // Slight delay
        sender: 'chatbot',
        messageContent: response.responseMessage,
        chatbotPersona: selectedPersona
    });
    return Object.assign(Object.assign({}, response), { personaUsed: selectedPersona });
});
//# sourceMappingURL=mainChatFlow.js.map