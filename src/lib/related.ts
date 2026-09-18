import { getEntry, type CollectionKey } from 'astro:content';

const BASE_PATHS: Record<string, string> = {
  recursos: '/recursos',
  segmentos: '/segmentos',
  integracoes: '/integracoes',
  guias: '/guias',
  glossario: '/glossario',
};

const LABELS: Record<string, string> = {
  recursos: 'Recursos relacionados',
  segmentos: 'Segmentos relacionados',
  integracoes: 'Integrações relacionadas',
  guias: 'Guias relacionados',
  glossario: 'Termos do glossário',
};

async function resolveGroup(collection: CollectionKey, slugs: string[] | undefined) {
  const items = (
    await Promise.all(
      (slugs ?? []).map(async (slug) => {
        const entry = await getEntry(collection, slug);
        if (!entry) return null;
        return { title: entry.data.title as string, href: `${BASE_PATHS[collection]}/${entry.id}` };
      }),
    )
  ).filter((x): x is { title: string; href: string } => x !== null);

  return { title: LABELS[collection], items };
}

type RelatedInput = {
  relatedFeatures?: string[];
  relatedSegments?: string[];
  relatedIntegrations?: string[];
  relatedGuides?: string[];
  relatedGlossary?: string[];
};

export async function buildRelatedGroups(data: RelatedInput) {
  return [
    await resolveGroup('recursos', data.relatedFeatures),
    await resolveGroup('segmentos', data.relatedSegments),
    await resolveGroup('integracoes', data.relatedIntegrations),
    await resolveGroup('guias', data.relatedGuides),
    await resolveGroup('glossario', data.relatedGlossary),
  ];
}
