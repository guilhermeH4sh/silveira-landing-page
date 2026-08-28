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

- Catálogo por departamento (hortifruti, açougue, padaria, mercearia, bebidas)
- Carrinho com quantidade e persistência
- Favoritos com sincronização entre páginas
- Busca em tempo real com query string
- Menu mobile responsivo
- Banner LGPD de cookies
- Toasts de feedback
- SEO (meta tags, sitemap, robots.txt)
- Acessibilidade (skip link, foco visível, reduced-motion)

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
