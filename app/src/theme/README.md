# Mobile visual system

Esta pasta concentra a base visual mobile-first do Tem No Bairro.

## Diretriz

As abas públicas são desenhadas prioritariamente para smartphones. Tablet/desktop nas áreas públicas devem apenas conter a largura e preservar a experiência mobile. Responsividade mais ampla fica para Admin e painéis de gestão.

## Arquivos

- `mobileDesignTokens.js`: tokens JS para componentes React compartilhados.
- `index.css`: classes utilitárias globais como `.mobile-page`, `.mobile-card`, `.mobile-shell`.
- `tailwind.config.js`: escala visual global de cores, radius, sombras e fontes.

## Componentes planejados

A próxima fase deve criar os componentes compartilhados:

- `PageHero`
- `SearchBar`
- `CategoryChips`
- `SectionHeader`
- `SmartImage`
- `MobileCard`

## Regras de uso

1. Preferir tokens e componentes compartilhados em novas telas.
2. Evitar estilos únicos repetidos por aba pública.
3. Manter botões e filtros confortáveis para toque.
4. Manter cards legíveis entre 360px e 430px.
5. Usar `SmartImage` quando estiver disponível para evitar imagens cortadas ou fallbacks ruins.

## Cores de seção

- Jornal: `news`
- Vitrine: `vitrine`
- Comércios: `merchants`
- Classificados: `ads`
- Campanhas: `campaigns`
