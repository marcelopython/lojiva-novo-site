const SITE_URL = 'https://www.lojiva.com.br';
const ORG_NAME = 'Lojiva';
const LEGAL_ENTITY = 'Evolvere Software';

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORG_NAME,
    legalName: LEGAL_ENTITY,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-lojiva.svg`,
    sameAs: [
      'https://www.instagram.com/evolveresoftware/',
      'https://www.linkedin.com/company/evolveresoftware/',
      'https://www.youtube.com/@EvolvereSoftware',
    ],
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORG_NAME,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'pt-BR',
  };
}

export function softwareApplicationSchema() {
  return {
    '@type': 'SoftwareApplication',
    name: ORG_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '97.00',
      priceCurrency: 'BRL',
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function faqSchema(faq: { question: string; answer: string }[]) {
  if (!faq.length) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: `${SITE_URL}${opts.url}`,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'pt-BR',
  };
}

export function webPageSchema(opts: { name: string; description: string; url: string }) {
  return {
    '@type': 'WebPage',
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.url}`,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    inLanguage: 'pt-BR',
  };
}

export function itemListSchema(items: { name: string; url: string }[]) {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${SITE_URL}${item.url}`,
    })),
  };
}

export function jsonLdGraph(...nodes: (object | null)[]) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  });
}
