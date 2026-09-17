# Silveira Supermercados — Landing Page

E-commerce estático de supermercado com catálogo, carrinho persistente, favoritos e busca dinâmica.

## Stack

- HTML5 semântico
- Tailwind CSS (CDN)
- JavaScript ES modules (vanilla)
- localStorage para estado do cliente

## Estrutura

```
css/styles.css          # Estilos compartilhados e acessibilidade
js/tailwind-config.js   # Design tokens Tailwind
js/config.js            # Configuração do site
js/cart.js              # Carrinho com localStorage
js/favorites.js         # Favoritos sincronizados
js/products.js          # Carregamento do catálogo
js/render.js            # Renderização de componentes
js/app.js               # Bootstrap da aplicação
data/products.json      # Catálogo centralizado
data/reviews.json       # Avaliações por SKU
data/recipes.json       # Receitas com ingredientes do catálogo
data/stores.json        # Unidades físicas
scripts/validate.mjs    # Smoke check de JSON, links e imports
```

## Funcionalidades

- Catálogo por departamento com ordenação, filtros, faixa de preço e paginação
- Visualização em grade ou lista, sincronizada com a query string
- Carrinho com quantidade, cupons, mini-carrinho, CSV, WhatsApp e impressão
- Listas de compras salvas e reaproveitáveis
- Favoritos, comparador de produtos e histórico de vistos recentemente
- Busca em tempo real com autocomplete, histórico e tolerância a erros de digitação
- Checkout multi-etapas com consulta de CEP (ViaCEP) e horário de entrega
- Acompanhamento de pedido com timeline e programa de fidelidade
- Tema claro/escuro respeitando `prefers-color-scheme`
- Aviso "avise-me quando repor" para itens com estoque baixo
- Preço por unidade normalizado (R$/kg, R$/L)
- Banner LGPD de cookies, toolbar de acessibilidade e atalhos de teclado
- PWA: service worker, manifest, banner de instalação e página offline
- Dados estruturados JSON-LD (GroceryStore, ItemList, BreadcrumbList, FAQPage, SearchAction)
- SEO (meta tags, sitemap, robots.txt, canonical, og:image)

## Desenvolvimento local

```bash
npx serve .
# ou
python -m http.server 8080
```

Acesse `http://localhost:8080`

## Qualidade

```bash
npm run validate
```

Valida sintaxe dos JSON, integridade referencial dos SKUs, links internos
quebrados e imports de módulos ES. O mesmo check roda no GitHub Actions
(`.github/workflows/ci.yml`) em cada push e pull request para `main`.

## Deploy

Compatível com GitHub Pages, Netlify ou Vercel (site estático).

## Autor

Guilherme Ferreira — guilhermefabricio564@gmail.com
