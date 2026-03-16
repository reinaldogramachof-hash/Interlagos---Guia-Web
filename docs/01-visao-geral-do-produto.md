# Tem No Bairro — Documento de Visão Geral do Produto

> **Versão:** 1.0
> **Data:** Março/2026
> **Status:** Em Desenvolvimento — Lançamento previsto Maio/2026
> **Responsável:** Equipe Tem No Bairro

---

## 1. O QUE É O TEM NO BAIRRO

O **Tem No Bairro** é uma plataforma digital comunitária hiperlocal, focada em bairros, que conecta moradores, comerciantes e prestadores de serviço em um único ecossistema digital.

Não é um guia de cidade. Não é um marketplace genérico. É a **rede social do seu bairro** — onde cada informação, negócio, notícia e oportunidade é de quem vive ao lado.

### Frase de Posicionamento

> *"Tudo o que acontece no seu bairro, você encontra no Tem No Bairro."*

---

## 2. PROBLEMA QUE RESOLVE

| Problema | Público Afetado |
|---|---|
| Morador não sabe quais comércios e serviços existem no próprio bairro | Moradores |
| Pequeno comerciante não tem presença digital acessível e acessível ao bolso | Comerciantes (MEIs e PMEs) |
| Informações sobre o bairro estão espalhadas em grupos de WhatsApp sem organização | Toda a comunidade |
| Não existe canal oficial para campanhas sociais, doações e utilidade pública local | Comunidade vulnerável |
| Guias existentes são da cidade toda — sem identidade, sem senso de comunidade | Todos |

---

## 3. PROPOSTA DE VALOR POR PÚBLICO

### Para o Morador
- Encontra comércios, serviços e ofertas perto de casa com **referências reais de vizinhos**
- Participa da vida do bairro (comenta, avalia, compartilha, solicita campanhas)
- Acessa utilidade pública, história local e classificados gratuitos em um só lugar
- Consome local com **confiança e contexto comunitário**

### Para o Comerciante / Prestador de Serviço
- Presença digital profissional com custo acessível (a partir de R$19,90/mês)
- Alcance direto para quem mora e consome no bairro
- Ferramentas de gestão digital progressivas conforme o plano contratado
- Canal de comunicação direta com clientes via WhatsApp integrado

### Para a Comunidade (Visão Social)
- Plataforma para campanhas solidárias e doações organizadas
- Espaço para a história e memória do bairro
- Informações de utilidade pública centralizadas

---

## 4. DIFERENCIAIS COMPETITIVOS

| Aspecto | Concorrentes (guias de cidade) | Tem No Bairro |
|---|---|---|
| Foco geográfico | Cidade inteira | **Bairro específico** |
| Senso de comunidade | Inexistente | **Rede social hiperlocal** |
| Ferramentas sociais | Não | **Classificados, doações, campanhas** |
| Referências locais | Não | **Avaliações de vizinhos** |
| Utilidade pública local | Não | **Sim** |
| Memória do bairro | Não | **História editorial** |
| Modelo de gestão para MEI | Não | **Painéis progressivos por plano** |
| Gestão digital assistida | Não | **Plano Gold (gerenciado)** |

---

## 5. PRIMEIRO MERCADO — PARQUE INTERLAGOS

- **Cidade:** São José dos Campos — SP
- **Bairro:** Parque Interlagos
- **Perfil da comunidade:** Classe média-baixa, faixa etária variada, alto uso de celular
- **Perfil dos comerciantes:** MEIs, pequenos e médios negócios, predominantemente familiares
- **Canais de entrada:** Grupos de WhatsApp do bairro, visitas comerciais, parceria com distribuidores locais

---

## 6. VISÃO DE EXPANSÃO

O modelo será replicado para outros bairros de São José dos Campos e demais cidades com:
- Gestão operacional própria por região
- Contratação de funcionários locais (conhecimento da comunidade)
- Mesmo produto, identidade visual adaptada ao bairro
- Estrutura tecnológica centralizada (multi-tenant por bairro)

---

## 7. MODELO DE NEGÓCIO (VISÃO GERAL)

### Fonte de Receita Principal
Assinaturas mensais dos comerciantes — canceláveis a qualquer momento, sem fidelidade.

| Plano | Preço/mês | Público-alvo |
|---|---|---|
| Gratuito | R$0 | Cadastro básico, visibilidade mínima |
| Básico | R$19,90 | MEI iniciante, quer mais destaque |
| Profissional | R$39,90 | Negócio estabelecido, quer gestão |
| Premium | R$79,90 | Negócio que quer máxima visibilidade |
| Gold *(futuro)* | R$299,90 | Gestão digital completa pela equipe |

### Fontes de Receita Futuras (fase 2+)
- Campanhas publicitárias patrocinadas por negócios locais
- Pacotes de destaque para datas especiais (Dia das Mães, Natal, etc.)
- Modelo de franquia/licenciamento por bairro/cidade

---

## 8. MÉTRICAS DE SUCESSO — LANÇAMENTO

| Métrica | Meta para considerar lançamento bem-sucedido |
|---|---|
| Comerciantes cadastrados (plano gratuito+) | 1/3 dos comércios do bairro |
| Usuários moradores ativos | Mínimo a ser definido com base no censo local |
| Conversão gratuito → pago | 20% dos cadastrados em 90 dias |
| Engajamento semanal (posts, avaliações, compartilhamentos) | Crescimento constante mês a mês |

---

## 9. EQUIPE DE LANÇAMENTO

| Papel | Responsabilidade |
|---|---|
| Gestor / Desenvolvedor | Arquitetura técnica, produto, estratégia geral |
| Especialista Digital | Operação da plataforma, suporte a comerciantes, moderação |
| Marketing | Aquisição de usuários, redes sociais, relacionamento com parceiros locais |

> A equipe será expandida após atingir capitalização mínima definida internamente.

---

## 10. PREMISSAS E RESTRIÇÕES

- A plataforma deve funcionar como **PWA** (sem necessidade de App Store/Play Store no lançamento)
- Todo conteúdo deve ser acessível **sem login** (Lazy Login — login apenas para interagir)
- O app deve funcionar **offline** para navegação básica (cache PWA)
- Todos os planos são **mensais e canceláveis** — sem fidelidade ou multa
- Conteúdo do **jornal local** é aberto a moradores (com aceite de termos de responsabilidade); conteúdo oficial apenas pela equipe
- **Campanhas sociais** são solicitadas por moradores e aprovadas pela equipe antes da publicação
- O sistema deve ser **mobile-first** (375px), projetado para uso em celular

---

*Próximo documento: [02-modulos-e-funcionalidades.md](02-modulos-e-funcionalidades.md)*
