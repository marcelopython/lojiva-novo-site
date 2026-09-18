import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const faqSchema = z.array(z.object({ question: z.string(), answer: z.string() })).default([]);

const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  updatedAt: z.coerce.date(),
  relatedFeatures: z.array(z.string()).default([]),
  relatedSegments: z.array(z.string()).default([]),
  relatedIntegrations: z.array(z.string()).default([]),
  relatedGuides: z.array(z.string()).default([]),
  relatedGlossary: z.array(z.string()).default([]),
  faq: faqSchema,
});

const recursos = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/recursos' }),
  schema: baseSchema.extend({
    planMinimo: z.string().optional(),
    disponivel: z.boolean().default(true),
  }),
});

const segmentos = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/segmentos' }),
  schema: baseSchema,
});

const integracoes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/integracoes' }),
  schema: baseSchema.extend({
    categoria: z.enum(['marketplace', 'logistica', 'pagamento']),
    parceiro: z.string(),
  }),
});

const guias = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/guias' }),
  schema: baseSchema.extend({
    publishedAt: z.coerce.date(),
  }),
});

const comparar = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/comparar' }),
  schema: baseSchema.extend({
    publishedAt: z.coerce.date().optional(),
  }),
});

const perguntas = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/perguntas' }),
  schema: baseSchema.extend({
    shortAnswer: z.string(),
    publishedAt: z.coerce.date().optional(),
  }),
});

const glossario = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/glossario' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    shortAnswer: z.string(),
    updatedAt: z.coerce.date(),
    relatedGlossary: z.array(z.string()).default([]),
    relatedFeatures: z.array(z.string()).default([]),
    relatedGuides: z.array(z.string()).default([]),
  }),
});

export const collections = { recursos, segmentos, integracoes, guias, glossario, comparar, perguntas };
