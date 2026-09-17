#!/usr/bin/env node
/**
 * Smoke check estático do projeto:
 *  - valida sintaxe dos JSON em data/
 *  - garante que todo SKU referenciado por reviews/recipes existe no catálogo
 *  - verifica se links internos em arquivos .html apontam para arquivos existentes
 *  - confere que todo módulo importado por js/*.js existe no disco
 *
 * Uso: node scripts/validate.mjs
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const info = [];

function readJson(relative) {
    const path = join(root, relative);
    try {
        return JSON.parse(readFileSync(path, 'utf8'));
    } catch (err) {
        errors.push(`JSON inválido em ${relative}: ${err.message}`);
        return null;
    }
}

// 1. JSON de dados
const products = readJson('data/products.json');
const reviews = readJson('data/reviews.json');
const recipes = readJson('data/recipes.json');
readJson('data/stores.json');
readJson('manifest.json');
readJson('package.json');

const productIds = new Set((products?.products || []).map((p) => p.id));
info.push(`${productIds.size} produtos no catálogo`);

(products?.products || []).forEach((p) => {
    ['id', 'name', 'price', 'unit', 'department', 'image'].forEach((field) => {
        if (p[field] === undefined) errors.push(`Produto ${p.id || '?'} sem campo obrigatório "${field}"`);
    });
    if (typeof p.price !== 'number' || p.price <= 0) {
        errors.push(`Produto ${p.id} com preço inválido: ${p.price}`);
    }
});

// 2. Integridade referencial
Object.keys(reviews || {}).forEach((id) => {
    if (!productIds.has(id)) errors.push(`reviews.json referencia SKU inexistente: ${id}`);
});

(recipes?.recipes || []).forEach((r) => {
    r.ingredients.forEach((id) => {
        if (!productIds.has(id)) errors.push(`Receita ${r.id} referencia SKU inexistente: ${id}`);
    });
});

// 3. Links internos nos HTML
const htmlFiles = readdirSync(root).filter((f) => f.endsWith('.html'));
let checkedLinks = 0;

htmlFiles.forEach((file) => {
    const html = readFileSync(join(root, file), 'utf8');
    for (const match of html.matchAll(/href="([^"#?]+\.html)(?:[?#][^"]*)?"/g)) {
        checkedLinks += 1;
        const target = match[1];
        if (target.startsWith('http')) continue;
        if (!existsSync(join(root, target))) {
            errors.push(`${file}: link quebrado para ${target}`);
        }
    }
});
info.push(`${checkedLinks} links internos verificados em ${htmlFiles.length} páginas`);

// 4. Imports dos módulos ES
const jsFiles = readdirSync(join(root, 'js')).filter((f) => f.endsWith('.js'));
let checkedImports = 0;

jsFiles.forEach((file) => {
    const src = readFileSync(join(root, 'js', file), 'utf8');
    for (const match of src.matchAll(/from\s+'(\.\/[^']+)'/g)) {
        checkedImports += 1;
        if (!existsSync(join(root, 'js', match[1]))) {
            errors.push(`js/${file}: import inexistente ${match[1]}`);
        }
    }
});
info.push(`${checkedImports} imports verificados em ${jsFiles.length} módulos`);

// Relatório
info.forEach((line) => console.log(`  ok  ${line}`));

if (errors.length) {
    console.error(`\n${errors.length} problema(s) encontrado(s):`);
    errors.forEach((e) => console.error(`  x  ${e}`));
    process.exit(1);
}

console.log('\nTodos os checks passaram.');
