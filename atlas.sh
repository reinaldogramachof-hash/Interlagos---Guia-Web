#!/usr/bin/env bash
# ============================================================
# atlas.sh — Bridge Claude Code ↔ ATLAS
#
# Envia uma task ao agente ATLAS (OpenClaw no VPS Hostgator)
# e retorna a resposta diretamente neste terminal.
#
# Uso:
#   bash atlas.sh "mensagem"
#   bash atlas.sh "mensagem" medium        # com thinking ativado
#
# Níveis de thinking: off | minimal | low | medium | high
#
# Exemplos:
#   bash atlas.sh "Liste os arquivos em /home/node/clawd/"
#   bash atlas.sh "Qual é o status do gateway?" low
#   bash atlas.sh "Gere o boilerplate do bairro santa-julia" medium
# ============================================================

set -euo pipefail

VPS_HOST="129.121.47.217"
VPS_PORT="22022"
VPS_USER="root"
CTR="moltbot-clawdbot-1"
MESSAGE="${1:-}"
THINKING="${2:-off}"

# SSH key: tenta atlas_bridge primeiro, depois id_ed25519, depois id_rsa
SSH_KEY=""
for key in "$HOME/.ssh/atlas_bridge" "$HOME/.ssh/id_ed25519" "$HOME/.ssh/id_rsa"; do
  if [ -f "$key" ]; then
    SSH_KEY="$key"
    break
  fi
done
SSH_OPTS="-p $VPS_PORT -o ConnectTimeout=15 -o BatchMode=yes -o StrictHostKeyChecking=accept-new"
[ -n "$SSH_KEY" ] && SSH_OPTS="$SSH_OPTS -i $SSH_KEY"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

if [ -z "$MESSAGE" ]; then
  echo -e "${RED}Erro: mensagem obrigatória.${NC}"
  echo ""
  echo "Uso: bash atlas.sh \"mensagem\" [off|minimal|low|medium|high]"
  echo ""
  echo "Exemplos:"
  echo "  bash atlas.sh \"status do sistema\""
  echo "  bash atlas.sh \"gere boilerplate do bairro santa-julia\" medium"
  exit 1
fi

echo -e "${CYAN}📤 ATLAS ← ${NC}${MESSAGE}"
[ "$THINKING" != "off" ] && echo -e "${YELLOW}🧠 Thinking: ${THINKING}${NC}"
echo "---"

# Escapa a mensagem localmente e passa como variável de ambiente para o SSH,
# evitando problemas de quoting com o wrapper openclaw (que usa sh -lc "$APP $*")
ESCAPED_MSG=$(printf '%s' "$MESSAGE" | base64)

ssh $SSH_OPTS "$VPS_USER@$VPS_HOST" \
  "MSG=\$(echo '$ESCAPED_MSG' | base64 -d); \
   docker exec -i \
     -u node \
     -e HOME=/home/node \
     -e XDG_CONFIG_HOME=/home/node/.clawdbot \
     $CTR \
     node /app/dist/index.js agent \
     --agent main \
     -m \"\$MSG\" \
     --thinking $THINKING \
     --json" \
  | python3 -c "
import sys, json
raw = sys.stdin.read()
try:
    data = json.loads(raw)
    # Estrutura OpenClaw: payloads[0].text
    payloads = data.get('payloads', [])
    if payloads and payloads[0].get('text'):
        print(payloads[0]['text'])
    else:
        reply = data.get('reply') or data.get('message') or data.get('text') or str(data)
        print(reply)
except Exception:
    print(raw)
" 2>/dev/null || echo -e "${RED}Erro ao processar resposta do ATLAS.${NC}"

echo ""
echo -e "${GREEN}✓ ATLAS respondeu.${NC}"
