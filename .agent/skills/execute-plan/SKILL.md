---
name: execute-plan
description: Executa um plano de implementação aprovado pelo Claude (Senior Engineer). Use quando o Claude tiver definido um plano arquitetural e você precisar colocá-lo em prática com precisão e segurança.
argument-hint: [descrição do plano]
---

Execute o plano de implementação a seguir com precisão cirúrgica.

## Protocolo de Execução

### Antes de começar
1. Leia o plano completo fornecido pelo Claude
2. Liste os arquivos que serão criados, modificados ou removidos
3. Identifique dependências entre as etapas (o que precisa ser feito antes do quê)
4. Se algum ponto estiver ambíguo — PARE e pergunte antes de prosseguir

### Durante a execução
- Execute **uma etapa por vez**, na ordem definida
- Após cada etapa, verifique se o resultado é o esperado
- Se encontrar um estado inesperado (arquivo diferente do esperado, import faltando, erro), **PARE e reporte** — não improvise uma solução
- Nunca tome decisões arquiteturais: "qual nome de função usar?", "onde colocar esse componente?" → pergunte ao Claude

### Verificações obrigatórias por tipo de mudança

**Novo arquivo criado:**
- Caminho correto conforme a estrutura de features?
- Imports usando caminhos relativos corretos (verificar profundidade)?
- Sem import direto de `supabaseClient` em componentes?

**Arquivo modificado:**
- As mudanças não quebraram outros imports deste arquivo?
- O arquivo ainda tem menos de 200 linhas?

**Service criado/modificado:**
- Importa apenas de `'../lib/supabaseClient'`?
- Todas as funções fazem `throw error` em caso de falha?
- Retorna `data ?? []` em listagens?

### Ao finalizar

Execute o build de verificação:
```bash
cd app && npm run build
```

Apresente o walkthrough completo:
```
✅ Arquivos criados: [lista]
✅ Arquivos modificados: [lista]
✅ Build: zero erros / [número de chunks]
⚠️ Observações: [qualquer desvio do plano ou decisão tomada]
```

Se o build falhar, **não tente corrigir autonomamente** — reporte o erro completo ao Claude.
