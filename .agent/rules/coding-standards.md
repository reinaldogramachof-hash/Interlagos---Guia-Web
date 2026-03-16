# Padrões de Código — Regras de Qualidade

**Escopo:** Global — verificar em toda geração de código.

## Regras de Componentes JSX

1. **Máximo 200 linhas por arquivo.** Se ultrapassar, extrair sub-componentes.
2. **Sem lógica de negócio inline.** Lógica vai nos `services/` ou `stores/`.
3. **Mobile-First rigoroso.** Projetar para 375px primeiro, depois breakpoints maiores.
4. **Lazy Login.** Nunca redirecionar para login ao visualizar conteúdo. Login só ao interagir.

## Regras de Serviços (services/)

```js
// ✅ Correto
import { supabase } from '../lib/supabaseClient';
export async function fetchItems() {
  const { data, error } = await supabase.from('table').select('*');
  if (error) throw error;
  return data ?? [];
}

// ❌ Errado — supabase em componente
import { supabase } from '../../lib/supabaseClient'; // dentro de features/
```

## Regras de Nomenclatura

| Tipo | Formato | Exemplo |
|---|---|---|
| Componentes React | PascalCase | `MerchantCard.jsx` |
| Services | camelCase + Service | `merchantService.js` |
| Stores Zustand | camelCase + Store | `authStore.js` |
| Funções de serviço | verbo + Entidade | `fetchMerchants`, `createAd` |
| Colunas Supabase | snake_case | `created_at`, `is_active` |

## Regras de Performance

- Imagens com `loading="lazy"` e dimensões explícitas
- Subscriptions realtime com cleanup: `return () => supabase.removeChannel(channel)`
- Sem `console.log` de debug em commits
- LCP target: < 2.5s em 4G lento

## Regras de Segurança e Ambiente

- **NUNCA ler ou usar `.env.local`** — variáveis de ambiente são exclusivas do processo Vite em runtime. Nunca ler o arquivo diretamente, nunca usar as chaves em scripts Node.js de terminal.
- **NUNCA usar a service role key** (`sb_secret_...`) em nenhum script, mesmo que local. Essa chave bypassa todas as RLS policies.
- **Para criar usuários de teste:** usar o Supabase Dashboard (Authentication → Users → Invite) ou pedir ao usuário. Nunca via script de terminal.
- **Para verificar dados do banco em debug:** solicitar ao usuário que verifique no Supabase Dashboard diretamente.

## Anti-Padrões Proibidos

```jsx
// ❌ NÃO fazer
const [data, setData] = useState(null);
useEffect(() => {
  supabase.from('table').select('*').then(({ data }) => setData(data)); // sem cleanup, sem error handling
}, []);

// ✅ FAZER
useEffect(() => {
  const unsubscribe = subscribeItems((items) => setData(items)); // via service
  return unsubscribe;
}, []);
```

## Verificação Antes de Cada Commit

Executar obrigatoriamente em `app/`:
```bash
npm run build
```

Zero erros = pode commitar. Qualquer warning relevante = reportar ao Claude antes de commitar.

## Mensagem de Commit

Formato obrigatório:
```
<tipo>: <descrição curta em português>

[detalhes opcionais]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Tipos: `feat`, `fix`, `refactor`, `chore`, `docs`
