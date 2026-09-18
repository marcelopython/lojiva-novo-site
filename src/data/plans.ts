// Fonte de verdade: lojiva-new-site/src/components/site/Plans.tsx
// plan_id reais do backend (apiadm.lojiva.com.br). Não alterar sem confirmar com o time.

export type Plan = {
  key: string;
  nome: string;
  planId: string;
  precoCentavos: number;
  destaque?: boolean;
  funcionalidades: string[];
  limites: {
    usuarios: number;
    locaisDeEstoque: number;
    integracoes: number;
  };
};

export const PLANS: Plan[] = [
  {
    key: 'init',
    nome: 'Essencial',
    planId: 'pla_6a4c6232327da2Ujh',
    precoCentavos: 9700,
    funcionalidades: [
      'PDV (criar vendas)',
      'Financeiro',
      'Gestão de clientes',
      'Agenda',
      'Consolidado diário',
      'Gestão de produtos (ilimitado)',
      'Gestão de estoque',
      'Pedidos e histórico de vendas',
      'Catálogo online configurável',
      'Dashboard de vendas',
    ],
    limites: { usuarios: 1, locaisDeEstoque: 1, integracoes: 0 },
  },
  {
    key: 'start',
    nome: 'Crescimento',
    planId: 'pla_69b03250aba9b8vI4',
    precoCentavos: 19700,
    funcionalidades: [
      'PDV (criar vendas e orçamentos)',
      'Etiqueta de código de barras',
      'Gestão de clientes',
      'Cadastro de produtos',
      'Pedidos e histórico de vendas',
      'Catálogo online configurável',
      'Dashboard de vendas',
      'Cadastro de transportadoras',
      'Compartilhamento de pedido em PDF',
      'Relatórios',
    ],
    limites: { usuarios: 2, locaisDeEstoque: 1, integracoes: 1 },
  },
  {
    key: 'growth',
    nome: 'Profissional',
    planId: 'pla_69b0430885e11jqBe',
    precoCentavos: 29900,
    destaque: true,
    funcionalidades: [
      'Tudo do Crescimento',
      'Gestão de usuários e permissões',
      'Financeiro completo (contas a pagar e receber)',
      'Devoluções',
      'Crédito para cliente (fiado)',
      'Fluxo de caixa',
      'Relatórios de vendas e estoque',
      'CRM de vendas (pipeline)',
      'Clientes inativos (reconquista)',
      'Exportação de pedidos',
      'Impressão de etiquetas de produtos',
    ],
    limites: { usuarios: 5, locaisDeEstoque: 2, integracoes: 2 },
  },
  {
    key: 'pro',
    nome: 'Escala',
    planId: 'pla_69b045504aabak8qq',
    precoCentavos: 54900,
    funcionalidades: [
      'Tudo do Profissional',
      'Gestão de grupos de permissão',
      'Gestão de compras',
      'Importação de XML de fornecedores',
      'Inventário de estoque',
      'Transferência entre estoques',
      'Integração com Shopee',
      'Gestão de anúncios Shopee',
      'API Keys para integrações externas',
      'Múltiplos locais de estoque',
    ],
    limites: { usuarios: 10, locaisDeEstoque: 5, integracoes: 2 },
  },
  {
    key: 'enterprise',
    nome: 'Elite',
    planId: 'pla_69b046899e9d8isLR',
    precoCentavos: 89900,
    funcionalidades: [
      'Tudo do Escala',
      'Emissão de nota fiscal (NF-e / NFC-e)',
      'Gestão avançada de usuários e permissões',
      'Controle de comissões de vendedores e representantes',
      'Integrações avançadas',
      'Limites ampliados de usuários e estoques',
      'Suporte prioritário',
      'Configuração avançada da empresa',
    ],
    limites: { usuarios: 15, locaisDeEstoque: 5, integracoes: 10 },
  },
];

export type FiscalPlan = {
  key: string;
  nome: string;
  precoCentavos: number;
  badge?: string;
  notasIncluidas: number;
  precoNotaAdicionalCentavos: number;
};

export const FISCAL_PLANS: FiscalPlan[] = [
  { key: 'nf_20', nome: 'NF 20', precoCentavos: 3990, notasIncluidas: 50, precoNotaAdicionalCentavos: 80 },
  { key: 'nf_80', nome: 'NF 80', precoCentavos: 9990, badge: 'Equilíbrio', notasIncluidas: 100, precoNotaAdicionalCentavos: 70 },
  { key: 'nf_160', nome: 'NF 160', precoCentavos: 16990, notasIncluidas: 160, precoNotaAdicionalCentavos: 60 },
  { key: 'nf_320', nome: 'NF 320', precoCentavos: 29990, badge: 'Mais vantajoso', notasIncluidas: 320, precoNotaAdicionalCentavos: 50 },
];

export function formatBRL(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

export const CADASTRO_URL_BASE = '/cadastro';
export const SIGNUP_API_BASE = 'https://apiadm.lojiva.com.br/api';
export const LOGIN_URL = 'https://adm.lojiva.com.br';
export const WHATSAPP_NUMBER = '5562994530152';
export const WHATSAPP_DEFAULT_MESSAGE = 'Olá! Gostaria de saber mais sobre a Lojiva.';

export function whatsappUrl(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
