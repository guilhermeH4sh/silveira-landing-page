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
```

## Funcionalidades

- Catálogo por departamento com ordenação e filtros (preço, ofertas, novos)
- Carrinho com quantidade, persistência e barra de frete grátis
- Favoritos com sincronização entre páginas
- Busca em tempo real com autocomplete e histórico
- Menu mobile responsivo e header compacto ao rolar
- Breadcrumbs semânticos nas páginas internas
- Banner LGPD de cookies e toolbar de acessibilidade
- Service worker para cache offline básico
- Dados estruturados JSON-LD (Schema.org)
- Página 404 personalizada
- SEO (meta tags, sitemap, robots.txt, canonical, og:image)

## Desenvolvimento local

```bash
npx serve .
# ou
python -m http.server 8080
```

Acesse `http://localhost:8080`

## Deploy

Compatível com GitHub Pages, Netlify ou Vercel (site estático).

## Autor

Guilherme Ferreira — guilhermefabricio564@gmail.com
