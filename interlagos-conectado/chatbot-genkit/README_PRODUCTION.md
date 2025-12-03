# Guia de Produção - Chatbot Genkit

Este arquivo resume as configurações e comandos necessários para levar o chatbot para produção.

## 1. Deployment (Cloud Functions)

O chatbot é implantado como uma Cloud Function (2nd Gen).

### Comandos
```bash
# 1. Compilar o projeto
npm run build

# 2. Fazer deploy (apenas functions)
firebase deploy --only functions
```

### Variáveis de Ambiente
O Genkit usa a credencial padrão do Google Cloud (ADC). Certifique-se de que a API **Vertex AI** esteja ativada no seu projeto Google Cloud.

## 2. Segurança Implementada

### Backend (`mainChatFlow.ts`)
- **Validação de Input:** Mensagens vazias ou > 500 caracteres são rejeitadas.
- **Rate Limiting:** Usuários limitados a 1 mensagem a cada 2 segundos.

### Frontend (Recomendado)
- **App Check:** Configure o Firebase App Check no `src/firebaseConfig.js` para impedir chamadas não autorizadas.
  ```javascript
  import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
  
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('SUA-SITE-KEY'),
    isTokenAutoRefreshEnabled: true
  });
  ```

## 3. Monitoramento

- **Logs:** Acesse no [Console Firebase > Functions > Logs](https://console.firebase.google.com/).
- **Métricas:** Monitore latência e erros no [Google Cloud Console](https://console.cloud.google.com/monitoring).

## 4. Versionamento

- Mantenha o `package.json` atualizado.
- Use tags no Git para marcar releases (ex: `git tag v1.0.0`).
