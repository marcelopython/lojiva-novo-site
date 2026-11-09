#!/usr/bin/env node
// Validação de HTML estático e de respostas HTTP, sem dependências externas.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist/client');
const args = process.argv.slice(2);
const live = args.includes('--live');
const preview = args.includes('--preview');
const baseArg = args.find((arg) => /^https?:\/\//.test(arg));
if (live && !baseArg) throw new Error('Uso: npm run seo:check:live -- https://host --preview');
const base = live ? new URL(baseArg) : null;
const config = await readFile(join(root, 'astro.config.mjs'), 'utf8');
const canonicalOrigin = config.match(/site:\s*['"](https?:\/\/[^'"]+)['"]/)?.[1];
if (!canonicalOrigin) throw new Error('site ausente em astro.config.mjs');
const collections = ['recursos', 'segmentos', 'integracoes', 'guias', 'comparar', 'perguntas', 'glossario'];
const noindexPaths = new Set(['/cadastro', '/termos', '/privacidade', '/404']);
const errors = [];
const warnings = [];
const counts = { html: 0, sitemap: 0, content: 0, links: 0, jsonLd: 0, headingJumps: 0, httpPages: 0 };
const output = (list, path, issue) => list.push(`${path}: ${issue}`);
const decode = (value = '') => value.replace(/&(?:amp|quot|apos|lt|gt|nbsp|#(\d+)|#x([\da-f]+));/gi, (entity, decimal, hex) => {
  if (decimal) return String.fromCodePoint(Number(decimal));
  if (hex) return String.fromCodePoint(parseInt(hex, 16));
  return ({ '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ' })[entity.toLowerCase()] ?? entity;
});
const strip = (value = '') => decode(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
const attr = (tag, name) => {
  const match = tag.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return decode(match?.[1] ?? match?.[2] ?? match?.[3] ?? '');
};
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(([tag]) => tag);
const meta = (html, key, value) => tags(html, 'meta').filter((tag) => attr(tag, key) === value).map((tag) => attr(tag, 'content'));
const linkRel = (html, rel) => tags(html, 'link').filter((tag) => attr(tag, 'rel') === rel).map((tag) => attr(tag, 'href'));
const pathOf = (value) => new URL(value, canonicalOrigin).pathname.replace(/\/$/, '') || '/';
const pageFile = (path) => path === '/' ? 'index.html' : path === '/404' ? '404.html' : `${path.slice(1)}/index.html`;
const toCanonical = (path) => canonicalOrigin + (path === '/' ? '/' : path);
const route = (path) => new URL(path, base ?? canonicalOrigin).href;
const xmlLocs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
const isHtml = (body) => /<!doctype\s+html|<html\b|<title>error/i.test(body.slice(0, 500));

async function files(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await files(full));
    else found.push(full);
  }
  return found;
}

async function fetchText(path, expectedStatus = 200) {
  const response = await fetch(route(path), { redirect: 'manual', headers: { 'user-agent': 'LojivaSEOCheck/1.0' }, signal: AbortSignal.timeout(15000) });
  counts.httpPages++;
  const body = await response.text();
  if (response.status !== expectedStatus) output(errors, path, `HTTP ${response.status}, esperado ${expectedStatus}`);
  return { status: response.status, type: response.headers.get('content-type') ?? '', headers: response.headers, body };
}

async function getText(path) {
  if (live) return fetchText(path);
  try { return { status: 200, type: '', body: await readFile(join(dist, path.slice(1)), 'utf8') }; }
  catch { output(errors, path, 'arquivo ausente no dist'); return { status: 404, type: '', body: '' }; }
}

function checkStaticResource(path, response, typePattern) {
  if (response.status !== 200) return;
  if (isHtml(response.body)) output(errors, path, 'fallback HTML em recurso que deveria ser texto/XML');
  if (live && !typePattern.test(response.type)) output(errors, path, `Content-Type incorreto: ${response.type}`);
}

// Recursos especiais e redirecionamento legado do sitemap.
for (const [path, type] of [['/robots.txt', /text\/plain/i], ['/llms.txt', /text\/plain/i], ['/sitemap-index.xml', /(?:application|text)\/xml/i]]) {
  checkStaticResource(path, await getText(path), type);
}
const redirectConfig = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));
const sitemapRedirect = redirectConfig.redirects?.find((entry) => entry.source === '/sitemap.xml');
if (sitemapRedirect?.statusCode !== 301 || sitemapRedirect.destination !== '/sitemap-index.xml') output(errors, '/sitemap.xml', 'redirect 301 ausente/incorreto em vercel.json');
if (live) {
  const response = await fetchText('/sitemap.xml', 301);
  if (response.status === 301 && pathOf(response.headers.get('location') ?? '/') !== '/sitemap-index.xml') output(errors, '/sitemap.xml', `Location incorreto: ${response.headers.get('location')}`);
  if (response.status !== 301 && isHtml(response.body)) output(errors, '/sitemap.xml', 'fallback HTML em vez de redirect 301');
}

const index = (await getText('/sitemap-index.xml')).body;
if (!/<sitemapindex\b/.test(index)) output(errors, '/sitemap-index.xml', 'não é um índice XML de sitemap');
const childSitemaps = xmlLocs(index);
if (!childSitemaps.length) output(errors, '/sitemap-index.xml', 'nenhum sitemap filho');
const sitemapPaths = new Set();
for (const loc of childSitemaps) {
  if (!loc.startsWith(canonicalOrigin + '/')) output(errors, '/sitemap-index.xml', `host não canônico: ${loc}`);
  const path = pathOf(loc);
  const response = await getText(path);
  checkStaticResource(path, response, /(?:application|text)\/xml/i);
  if (!/<urlset\b/.test(response.body)) output(errors, path, 'não é urlset XML');
  for (const url of xmlLocs(response.body)) {
    if (!url.startsWith(canonicalOrigin + '/')) output(errors, path, `URL não canônica: ${url}`);
    const page = pathOf(url);
    if (url !== toCanonical(page)) output(errors, path, `barra/URL não canônica: ${url}`);
    if (sitemapPaths.has(page)) output(errors, path, `URL duplicada: ${page}`);
    sitemapPaths.add(page);
  }
}
counts.sitemap = sitemapPaths.size;

const expectedContent = new Set();
for (const collection of collections) {
  for (const file of await readdir(join(root, 'src/content', collection))) {
    if (file.endsWith('.mdx')) expectedContent.add(`/${collection}/${file.slice(0, -4)}`);
  }
}
counts.content = expectedContent.size;
for (const path of expectedContent) if (!sitemapPaths.has(path)) output(errors, path, 'conteúdo ausente do sitemap');
for (const path of noindexPaths) if (sitemapPaths.has(path)) output(errors, path, 'noindex presente no sitemap');

const localFiles = (await files(dist)).filter((file) => file.endsWith('.html'));
const localPaths = new Set(localFiles.map((file) => {
  const rel = relative(dist, file).replaceAll('\\', '/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404';
  return '/' + rel.replace(/\/index\.html$/, '');
}));
for (const path of sitemapPaths) if (!localPaths.has(path)) output(errors, path, 'sitemap sem HTML no build local');
const pathsToCheck = live ? [...new Set([...sitemapPaths, ...noindexPaths].filter((path) => path !== '/404'))] : [...localPaths];
const pages = new Map();
const pageTitles = new Map();
const pageDescriptions = new Map();

async function checkPage(path) {
  const response = live ? await fetchText(path) : await getText('/' + pageFile(path));
  if (response.status !== 200) return;
  const html = response.body;
  pages.set(path, html);
  counts.html++;
  if (live && !/text\/html/i.test(response.type)) output(errors, path, `Content-Type HTML incorreto: ${response.type}`);
  if (!/<html\b/i.test(html) || isHtml(html) === false) output(errors, path, 'resposta não é HTML');
  const htmlTag = tags(html, 'html')[0] ?? '';
  if (attr(htmlTag, 'lang') !== 'pt-BR') output(errors, path, `lang incorreto: ${attr(htmlTag, 'lang')}`);
  const titleMatches = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  if (titleMatches.length !== 1 || !strip(titleMatches[0]?.[1])) output(errors, path, `title ausente/duplicado (${titleMatches.length})`);
  const descriptions = meta(html, 'name', 'description');
  if (descriptions.length !== 1 || !descriptions[0]) output(errors, path, `description ausente/duplicada (${descriptions.length})`);
  if (sitemapPaths.has(path)) {
    const title = strip(titleMatches[0]?.[1]);
    if (title && pageTitles.has(title)) output(errors, path, `title igual ao de ${pageTitles.get(title)}`);
    if (title) pageTitles.set(title, path);
    const description = descriptions[0];
    if (description && pageDescriptions.has(description)) output(errors, path, `description igual à de ${pageDescriptions.get(description)}`);
    if (description) pageDescriptions.set(description, path);
  }
  const canonicals = linkRel(html, 'canonical');
  if (canonicals.length !== 1 || canonicals[0] !== toCanonical(path)) output(errors, path, `canonical: ${canonicals.join(', ') || 'ausente'}, esperado ${toCanonical(path)}`);
  const robots = meta(html, 'name', 'robots');
  if (robots.length !== 1) output(errors, path, `robots ausente/duplicado (${robots.length})`);
  else if (noindexPaths.has(path)) {
    if (!/noindex/i.test(robots[0])) output(errors, path, `robots sem noindex: ${robots[0]}`);
  } else if (!preview && (!/index/i.test(robots[0]) || /noindex/i.test(robots[0]))) output(errors, path, `robots não indexável: ${robots[0]}`);
  if (live && preview && !/noindex/i.test(response.headers.get('x-robots-tag') ?? '')) output(errors, path, 'X-Robots-Tag noindex ausente no preview');
  for (const key of ['og:title', 'og:description', 'og:image', 'og:url']) {
    const values = meta(html, 'property', key);
    if (values.length !== 1 || !values[0]) output(errors, path, `${key} ausente/duplicado`);
    if (key === 'og:url' && values[0] !== toCanonical(path)) output(errors, path, `og:url divergente: ${values[0]}`);
  }
  for (const key of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:url']) {
    const values = meta(html, 'name', key);
    if (values.length !== 1 || !values[0]) output(errors, path, `${key} ausente/duplicado`);
    if (key === 'twitter:url' && values[0] !== toCanonical(path)) output(errors, path, `twitter:url divergente: ${values[0]}`);
  }
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((match) => ({ level: Number(match[1]), text: strip(match[2]) }));
  if (headings.filter((heading) => heading.level === 1).length !== 1) output(errors, path, `H1: ${headings.filter((heading) => heading.level === 1).length}`);
  let previous = 0;
  for (const heading of headings) {
    if (previous && heading.level > previous + 1) { counts.headingJumps++; output(warnings, path, `salto H${previous}→H${heading.level}: ${heading.text}`); }
    previous = heading.level;
  }
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter((match) => attr(match[1], 'type') === 'application/ld+json');
  if (!scripts.length && !noindexPaths.has(path)) output(errors, path, 'JSON-LD ausente');
  const nodes = [];
  for (const script of scripts) {
    try {
      const data = JSON.parse(script[2]);
      if (data['@context'] !== 'https://schema.org' || !Array.isArray(data['@graph'])) output(errors, path, 'JSON-LD sem @context/@graph esperado');
      for (const node of data['@graph'] ?? []) {
        counts.jsonLd++;
        if (!node['@type']) output(errors, path, 'nó JSON-LD sem @type');
        if (node['@id'] && !node['@id'].startsWith(canonicalOrigin + '/')) output(errors, path, `@id fora do domínio: ${node['@id']}`);
        if (node.url && typeof node.url === 'string' && node.url.startsWith('http') && node.url !== canonicalOrigin && !node.url.startsWith(canonicalOrigin + '/')) output(errors, path, `url JSON-LD fora do domínio: ${node.url}`);
        nodes.push(node);
      }
    } catch (error) { output(errors, path, `JSON-LD inválido: ${error.message}`); }
  }
  const types = new Set(nodes.map((node) => node['@type']));
  const expected = path === '/' ? ['Organization', 'WebSite', 'SoftwareApplication', 'FAQPage'] : path === '/precos' ? ['WebPage', 'BreadcrumbList', 'FAQPage'] : expectedContent.has(path) ? ['WebPage', 'BreadcrumbList'] : [];
  for (const type of expected) if (!types.has(type)) output(errors, path, `JSON-LD sem ${type}`);
  for (const node of nodes) {
    if (node['@type'] === 'WebPage' || node['@type'] === 'Article' || node['@type'] === 'AboutPage') {
      if (node.url && node.url !== toCanonical(path)) output(errors, path, `${node['@type']}.url divergente: ${node.url}`);
    }
    if (node['@type'] === 'BreadcrumbList') {
      for (const item of node.itemListElement ?? []) {
        if (!item.item?.startsWith(canonicalOrigin + '/')) output(errors, path, `Breadcrumb item inválido: ${item.item}`);
      }
    }
    if (node['@type'] === 'FAQPage') {
      for (const item of node.mainEntity ?? []) {
        if (!strip(html).includes(item.name)) output(warnings, path, `pergunta do JSON-LD não visível: ${item.name}`);
      }
    }
  }
  const org = nodes.find((node) => node['@type'] === 'Organization');
  if (org && org['@id'] !== `${canonicalOrigin}/#organization`) output(errors, path, 'Organization @id inconsistente');
  const web = nodes.find((node) => node['@type'] === 'WebSite');
  if (web && (web['@id'] !== `${canonicalOrigin}/#website` || web.publisher?.['@id'] !== `${canonicalOrigin}/#organization`)) output(errors, path, 'WebSite @id/publisher inconsistente');
  if (path === '/') {
    const app = nodes.find((node) => node['@type'] === 'SoftwareApplication');
    if (app && (app['@id'] !== `${canonicalOrigin}/#software` || app.publisher?.['@id'] !== `${canonicalOrigin}/#organization`)) output(errors, path, 'SoftwareApplication @id/publisher inconsistente');
    if (app && ('aggregateRating' in app || 'review' in app)) output(errors, path, 'rating/review sem fonte');
  }
}

// Concorrência limitada evita sobrecarregar o preview durante a auditoria.
for (let i = 0; i < pathsToCheck.length; i += 6) await Promise.all(pathsToCheck.slice(i, i + 6).map(checkPage));

const availablePaths = live ? new Set([...sitemapPaths, ...noindexPaths]) : localPaths;
for (const [path, html] of pages) {
  for (const tag of tags(html, 'a')) {
    const href = attr(tag, 'href');
    if (!href || href.startsWith('#')) continue;
    let url;
    try { url = new URL(href, toCanonical(path)); } catch { output(errors, path, `href inválido: ${href}`); continue; }
    if (url.origin !== canonicalOrigin) continue;
    const target = pathOf(url.href);
    counts.links++;
    if (!availablePaths.has(target)) output(errors, path, `link interno quebrado: ${href}`);
  }
}

const visible = (html) => strip(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' '));
const contentCases = {
  '/': ['PDV', 'estoque', 'financeiro', 'emissão fiscal'],
  '/precos': ['Essencial', 'Elite', 'Limites de cada plano'],
  '/recursos/pdv': ['PDV', 'split de pagamento', 'caixa'],
  '/recursos/grade-cor-e-tamanho': ['SKU', 'código de barras', 'estoque'],
  '/recursos/fiscal-nfe-nfce': ['NF-e', 'NFC-e', 'NFS-e Nacional'],
  '/segmentos/loja-de-roupas-e-moda': ['cor e tamanho', 'PDV', 'jeans'],
};
for (const [path, terms] of Object.entries(contentCases)) {
  const text = visible(pages.get(path) ?? '');
  for (const term of terms) if (!text.toLowerCase().includes(term.toLowerCase())) output(errors, path, `conteúdo ausente no HTML inicial: ${term}`);
}
const homeNodes = [...(pages.get('/') ?? '').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter((match) => attr(match[1], 'type') === 'application/ld+json')
  .flatMap((match) => { try { return JSON.parse(match[2])['@graph'] ?? []; } catch { return []; } });
const offer = homeNodes.find((node) => node['@type'] === 'SoftwareApplication')?.offers;
const priceText = visible(pages.get('/precos') ?? '');
if (offer) {
  if (offer['@type'] !== 'AggregateOffer' || Number(offer.offerCount) !== 5 || offer.priceCurrency !== 'BRL') output(errors, '/', `AggregateOffer inválido: ${JSON.stringify(offer)}`);
  for (const [price, label] of [[offer.lowPrice, 'mínimo'], [offer.highPrice, 'máximo']]) {
    const shown = `R$ ${Number(price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (!priceText.includes(shown)) output(errors, '/', `AggregateOffer ${label} ${price} não visível em /precos`);
  }
} else output(errors, '/', 'AggregateOffer ausente');

console.log(`SEO ${live ? `HTTP ${base.origin}` : 'dist/client'}${preview ? ' (preview)' : ''}`);
console.log(`Contagens: ${JSON.stringify(counts)}`);
console.log(`Erros: ${errors.length}; avisos: ${warnings.length}`);
for (const error of errors) console.log(`ERRO ${error}`);
for (const warning of warnings) console.log(`AVISO ${warning}`);
if (live) console.log('Content-Type medido por HTTP; canonical comparado ao domínio oficial.');
else console.log('Content-Type local inferido pelo arquivo; resposta HTTP deve ser testada com seo:check:live.');
if (errors.length) process.exitCode = 1;
