import { PLANS } from '../data/plans';

const SITE_URL = 'https://www.lojiva.com.br';
const ORG_NAME = 'Lojiva';
const LEGAL_ENTITY = 'Lojiva Software LTDA';
const CNPJ = '42.220.633/0001-55';
const FOUNDING_DATE = '2021-06-07';

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORG_NAME,
    legalName: LEGAL_ENTITY,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo-lojiva.svg`,
    },
    description:
      'A Lojiva é um sistema de gestão (ERP) para lojas físicas e online, atacado e varejo multicanal, com especialização em moda e vestuário. Reúne PDV, estoque por grade de cor e tamanho, financeiro, emissão fiscal (NF-e/NFC-e), TEF e representantes.',
    slogan: 'Sistema de gestão para lojas de roupas, atacado e varejo',
    foundingDate: FOUNDING_DATE,
    taxID: CNPJ,
    vatID: CNPJ,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'CNPJ',
      value: CNPJ,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Avenida Coronel Tubertino Rios, 425, Quadra 10',
      addressLocality: 'Jaraguá',
      addressRegion: 'GO',
      postalCode: '76320-017',
      addressCountry: 'BR',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Brasil',
    },
    knowsAbout: [
      'ERP para varejo',
      'Sistema para loja de roupas',
      'PDV (frente de caixa)',
      'Controle de estoque por grade de cor e tamanho',
      'Emissão de NF-e e NFC-e',
      'TEF e maquininha integrada',
      'Gestão financeira para varejo',
      'Representantes comerciais e comissões',
      'Atacado e varejo multicanal',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: '+5562994530152',
      availableLanguage: ['Portuguese'],
      url: `${SITE_URL}/precos`,
    },
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
    '@id': `${SITE_URL}/#software`,
    name: ORG_NAME,
    description:
      'Sistema de gestão (ERP) para lojas físicas e online, atacado e varejo multicanal, com PDV, controle de estoque por grade de cor e tamanho, financeiro, emissão fiscal (NF-e/NFC-e), TEF e vendas por representantes.',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Retail Management Software',
    operatingSystem: 'Web',
    url: SITE_URL,
    image: `${SITE_URL}/og-default.png`,
    inLanguage: 'pt-BR',
    softwareHelp: `${SITE_URL}/guias`,
    featureList: [
      'PDV (frente de caixa)',
      'Controle de estoque por grade de cor e tamanho',
      'Multi-loja e multi-estoque',
      'Financeiro: contas a pagar e a receber, fluxo de caixa e DRE',
      'Emissão fiscal NF-e, NFC-e e NFS-e Nacional',
      'TEF e maquininha integrada',
      'Link de pagamento (Pix, boleto e cartão)',
      'Representantes, vendedores e comissões',
      'Trocas e devoluções',
      'Compras e importação de XML',
      'Catálogo online',
      'Consignado para representantes',
      'Fiado e limite de crédito por cliente',
      'Etiquetas de código de barras por variação',
      'Controle de caixa com abertura, sangria e fechamento',
      'Metas de vendedores e relatórios',
      'Preço por quantidade e produto kit no PDV',
    ],
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: (Math.min(...PLANS.map((plan) => plan.precoCentavos)) / 100).toFixed(2),
      highPrice: (Math.max(...PLANS.map((plan) => plan.precoCentavos)) / 100).toFixed(2),
      offerCount: PLANS.length,
      priceCurrency: 'BRL',
      url: `${SITE_URL}/precos`,
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
