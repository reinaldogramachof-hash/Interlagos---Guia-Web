# Tem No Bairro — Guia de Deploy no Hostgator

> **Versão:** 2.0
> **Data:** 25/03/2026
> **Domínio:** https://temnobairro.online
> **Primeiro bairro:** Interlagos → https://temnobairro.online/interlagos

---

## VISÃO GERAL DA ARQUITETURA DE DEPLOY

```
temnobairro.online/
├── public_html/
│   ├── index.html          ← landing page (futuro)
│   ├── .htaccess           ← regras raiz (opcional)
│   ├── interlagos/         ← bairro 1 (ESTE DEPLOY)
│   │   ├── index.html
│   │   ├── .htaccess       ← SPA fallback (incluído no zip)
│   │   ├── assets/
│   │   ├── sw.js
│   │   └── ...
│   ├── moema/              ← bairro 2 (futuro)
│   └── sjc/                ← bairro 3 (futuro)
```

Cada bairro é uma pasta independente com seu próprio build do app.

---

## PARTE 1 — UPLOAD NO HOSTGATOR

### Passo a passo via cPanel → File Manager

1. Acesse **cPanel** → **File Manager**
2. Navegue até `public_html/`
3. Clique em **+ Folder** e crie a pasta `interlagos`
4. Acesse `public_html/interlagos/`
5. Clique em **Upload** e envie o arquivo `interlagos-deploy.zip`
6. Após o upload, clique no zip → **Extract** → extraia para a pasta atual
7. Delete o arquivo zip após extrair
8. Verifique se `public_html/interlagos/index.html` existe

### Alternativa via FTP (FileZilla)

```
Host: temnobairro.online
Usuário: (seu usuário FTP do cPanel)
Senha: (sua senha cPanel)
Porta: 21

1. Conectar ao servidor
2. Navegar até /public_html/
3. Criar pasta interlagos/
4. Arrastar o conteúdo da pasta dist/ local para interlagos/ no servidor
```

### Alternativa via SSH (se habilitado no Hostgator)

```bash
# Conectar via SSH
ssh usuario@temnobairro.online

# Criar pasta e subir zip
mkdir -p ~/public_html/interlagos
cd ~/public_html/interlagos

# Após enviar o zip por FTP
unzip interlagos-deploy.zip
rm interlagos-deploy.zip
```

---

## PARTE 2 — CONFIGURAÇÕES OBRIGATÓRIAS NO SUPABASE

Acesse: https://supabase.com/dashboard/project/jfjavgjeylahhcfcixtv

### 2.1 — Authentication → URL Configuration

Adicione o domínio de produção:

| Campo | Valor |
|---|---|
| **Site URL** | `https://temnobairro.online/interlagos` |
| **Redirect URLs** (adicionar) | `https://temnobairro.online/interlagos` |
| **Redirect URLs** (adicionar) | `https://temnobairro.online/interlagos/` |

> ⚠️ **IMPORTANTE:** Mantenha também `http://localhost:5173` nos Redirect URLs para desenvolvimento local.

**Caminho no Dashboard:**
`Authentication` → `URL Configuration` → `Site URL` e `Redirect URLs`

### 2.2 — Authentication → Providers → Google OAuth

Adicione `https://temnobairro.online` como domínio autorizado no Google Cloud Console:

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Abra seu projeto → **APIs & Services** → **Credentials**
3. Edite seu **OAuth 2.0 Client ID**
4. Em **Authorized JavaScript origins**, adicione:
   - `https://temnobairro.online`
5. Em **Authorized redirect URIs**, adicione:
   - `https://jfjavgjeylahhcfcixtv.supabase.co/auth/v1/callback`
   (já deve existir — apenas confirme)

### 2.3 — Storage → Buckets (verificar CORS)

Verifique se os buckets permitem acesso do novo domínio:

No Supabase Dashboard → **Storage** → selecione cada bucket → **Policies** — as policies públicas já devem funcionar, pois usam `anon` key.

Se necessário, adicione header CORS nos buckets:
```json
[
  {
    "origin": ["https://temnobairro.online"],
    "methods": ["GET", "POST", "PUT", "DELETE"],
    "headers": ["*"],
    "maxAgeSeconds": 3600
  }
]
```

---

## PARTE 3 — VERIFICAÇÃO PÓS-DEPLOY (CHECKLIST V2.0)

□ 1. Acesse https://temnobairro.online/interlagos
→ App carrega sem erros no console

□ 2. Abra o console (F12)
→ Sem erros de CORS, 404 ou mixed content

□ 3. Recarregue a página (F5)
→ Não deve dar 404 (SPA routing via .htaccess)

□ 4. Faça login com Google OAuth
→ Redireciona corretamente após login

□ 5. Acesse Perfil → "Quero anunciar meu comércio"
→ Abre MerchantLandingView com link "Começar gratuitamente →"

□ 6. Clique em "Começar gratuitamente →" sem estar logado
→ Abre modal de login; após login, redireciona para painel

□ 7. Acesse o Painel do Comerciante
→ Sidebar exibe 5 tabs: Visão Geral, Anúncios, Configurações, Relatórios, Campanhas

□ 8. Abra no celular e instale como PWA
→ Ícone aparece na tela inicial, app abre em modo standalone

□ 9. Desative a internet no celular e abra o PWA
→ App carrega (Service Worker + Workbox cache)


---

## PARTE 4 — ADICIONAR NOVO BAIRRO (FUTURO)

Para lançar um novo bairro (ex: Moema), o processo é simples:

### 1. Atualizar `.env.production`

```env
VITE_NEIGHBORHOOD=moema
```

### 2. Executar o build

```bash
cd app/
npm run build:interlagos  # o script usa .env.production
```

### 3. Criar pasta e enviar zip

```bash
# Gerar novo zip
powershell -Command "Compress-Archive -Path 'dist/*' -DestinationPath '../moema-deploy.zip' -Force"
```

Enviar `moema-deploy.zip` para `public_html/moema/` no Hostgator.

### 4. Atualizar Supabase

Adicionar `https://temnobairro.online/moema` nos Redirect URLs do Supabase.

---

## PARTE 5 — REBUILD RÁPIDO (ATUALIZAÇÕES FUTURAS)

Sempre que houver atualização de código:

```bash
cd "c:/Users/reina/OneDrive/Desktop/Projetos/Guia Digital Interlagos/app"

# 1. Build
npm run build:interlagos

# 2. Gerar zip
powershell -Command "Compress-Archive -Path 'dist/*' -DestinationPath '../interlagos-deploy.zip' -Force"

# 3. Upload do zip para public_html/interlagos/ no Hostgator
#    Apagar arquivos antigos e extrair o novo zip
```

> **Dica:** No cPanel → File Manager, você pode selecionar todos os arquivos em `interlagos/`, deletar, e então fazer o upload e extrair o novo zip.

---

## ARQUIVO GERADO

| Arquivo | Localização | Descrição |
|---|---|---|
| `interlagos-deploy.zip` | `config/hostgator/deploy/` | Pacote pronto para upload no Hostgator |
| `app/public/.htaccess` | incluído no zip | SPA routing para Apache |
| `app/.env.interlagos` | local apenas | Variáveis de build (não commitar) |
| `app/vite.config.js` | repositório | Suporte a base path dinâmico |

## VERSÃO DESTE BUILD

| Commit | Descrição |
|---|---|
| `125708a` | feat(merchant-panel): tabs Campanhas + Relatórios + cadastro gratuito |
| `55f671f` | feat(plans): padroniza nomenclatura free/basic/pro/premium |
| `5196332` | fix(toast): corrige useToast em 22 arquivos |
| `9e9289b` | fix(ads): remove campo image do payload |
| `cb6568a` | fix(admin): centraliza lógica nos services |

---

*Documento criado em 24/03/2026. Última atualização: 25/03/2026 — v2.0.*  
*Para dúvidas sobre configuração do Supabase: ver `docs/10-guia-de-execucao.md` seção 3.*
