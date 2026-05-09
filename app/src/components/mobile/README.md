# Componentes mobile compartilhados

Esta pasta contém os componentes de interface mobile-first usados para padronizar as abas públicas do app.

## Componentes

- `PageHero`: banner/header padronizado por seção.
- `SearchBar`: busca mobile com ícone e botão de limpar.
- `CategoryChips`: filtros horizontais com estado ativo.
- `SectionHeader`: título de seção com subtítulo e ação opcional.
- `MobileCard`: card base com superfície, borda, sombra e estado pressable.
- `SmartImage`: imagem com crop/fallback por categoria.
- `BottomSheet`: sheet inferior para ações/contextos mobile.

## Escopo desta fase

Esta fase cria componentes sem migrar as telas públicas ainda. A aplicação nas telas deve ocorrer em PRs seguintes, começando por uma aba de cada vez para facilitar revisão visual.

## Próxima fase sugerida

`ui/mobile-public-heroes`: aplicar `PageHero`, `SearchBar` e `CategoryChips` em Jornal, Vitrine, Comércios, Classificados e Campanhas.
