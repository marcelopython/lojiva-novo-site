# Lojiva — site institucional

Site institucional e de conteúdo/SEO da Lojiva. Astro (SSG) + React (islands) + Tailwind 4, com conteúdo em content collections (MDX).

## Stack

- **Astro** (output estático, com uma única rota dinâmica em `/api/lead` para captura de lead sem expor token no client)
- **React** apenas nos componentes interativos (`src/components/islands/`), como o formulário de cadastro
- **Tailwind CSS 4**, tokens de design em `src/styles/global.css`
- **Content Collections (MDX)** para recursos, segmentos, integrações, guias, glossário e comparativos

## Comandos

Requer **Node 22.12+**.

| Comando | Ação |
| --- | --- |
| `npm install` | Instala dependências |
| `npm run dev` | Sobe o servidor local em `localhost:4321` |
| `npm run build` | Gera o build de produção em `./dist/` |
| `npm run preview` | Testa o build de produção localmente |
| `npx astro check` | Checagem de tipos de todo o projeto |

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

- `CRM_API_TOKEN`: token do CRM (`apicrm.evolveresales.com.br`) usado pelo endpoint `/api/lead`. Nunca deve ser exposto no client — por isso existe o endpoint de proxy em `src/pages/api/lead.ts`.

## Como adicionar conteúdo novo (sem escrever código)

Cada seção de conteúdo é uma pasta em `src/content/`. Basta criar um novo arquivo `.mdx` seguindo o front-matter de um arquivo existente na mesma pasta — a página é gerada automaticamente (rota, breadcrumb, JSON-LD, FAQ e "conteúdo relacionado" incluídos):

- `src/content/recursos/` — páginas de funcionalidade (`/recursos/slug`)
- `src/content/segmentos/` — páginas de segmento (`/segmentos/slug`)
- `src/content/integracoes/` — páginas de integração (`/integracoes/slug`)
- `src/content/guias/` — artigos educacionais (`/guias/slug`)
- `src/content/glossario/` — termos (`/glossario/slug`)
- `src/content/comparar/` — guias de decisão/comparação (`/comparar/slug`)

O schema de cada coleção está em `src/content.config.ts`. Os campos `relatedFeatures`, `relatedSegments`, `relatedIntegrations`, `relatedGuides` e `relatedGlossary` recebem o **slug** (nome do arquivo, sem `.mdx`) de outras páginas para gerar os links internos automaticamente — é assim que os clusters de SEO se conectam.

### Regra de conteúdo (importante)

Não publique como funcionalidade disponível nada que não esteja confirmado no produto. Hoje isso inclui, por exemplo: CT-e e NFS-e (existem no código mas estão desativados na interface), checkout do catálogo online, campanhas de WhatsApp em massa. Ao escrever sobre fiscal/tributário, sempre inclua o aviso de que o conteúdo não substitui orientação contábil (ver `CalloutBox` nos arquivos de `src/content/recursos/fiscal-nfe-nfce.mdx` e `src/content/guias/nfe-ou-nfce-quando-usar-cada-uma.mdx` como exemplo).

## Dados centrais

- `src/data/plans.ts` — planos e preços reais (fonte: `lojiva-new-site/src/components/site/Plans.tsx`), URLs de cadastro/login, número de WhatsApp oficial
- `src/data/nav.ts` — estrutura do menu principal e do footer
- `src/data/testimonials.ts` — depoimentos reais (não adicionar depoimento sem nome de empresa e fonte confirmada)
- `src/lib/schema.ts` — helpers de JSON-LD (Organization, WebSite, Article, FAQPage, BreadcrumbList, ItemList)
- `src/lib/related.ts` — resolve os slugs de `relatedX` do front-matter em links reais

## SEO técnico

Sitemap (`@astrojs/sitemap`) e `robots.txt` são gerados automaticamente no build. Páginas não-indexáveis (`/cadastro`, `/termos`, `/privacidade`) são excluídas do sitemap e marcadas `noindex` em `astro.config.mjs` e no componente `BaseHead`.
