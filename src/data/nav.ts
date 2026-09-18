export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  href: string;
  links: NavLink[];
};

export const PRODUTO_MENU: NavGroup = {
  label: 'Produto',
  href: '/recursos',
  links: [
    { label: 'PDV', href: '/recursos/pdv', description: 'Vendas, caixa e pagamentos' },
    { label: 'TEF e maquininha', href: '/recursos/tef-e-maquininha', description: 'Cartão e PIX na maquininha (Smart TEF)' },
    { label: 'Link de pagamento', href: '/recursos/link-de-pagamento', description: 'Cobre por Pix, boleto ou cartão a distância' },
    { label: 'Controle de estoque', href: '/recursos/controle-de-estoque', description: 'Saldo, alertas e transferências' },
    { label: 'Grade de cor e tamanho', href: '/recursos/grade-cor-e-tamanho', description: 'Variações para moda e calçados' },
    { label: 'Multi-loja e multi-estoque', href: '/recursos/multi-loja', description: 'Várias lojas e depósitos' },
    { label: 'Compras e importação de XML', href: '/recursos/compras-e-xml', description: 'Entrada de estoque pela nota do fornecedor' },
    { label: 'Financeiro', href: '/recursos/financeiro', description: 'Contas a pagar, receber e fluxo de caixa' },
    { label: 'Relatórios, DRE e Visão Executiva', href: '/recursos/relatorios-e-dre', description: 'Números para decidir com segurança' },
    { label: 'Fiscal (NF-e / NFC-e)', href: '/recursos/fiscal-nfe-nfce', description: 'Emissão de notas fiscais' },
    { label: 'Trocas e devoluções', href: '/recursos/trocas-e-devolucoes', description: 'Fluxo completo de pós-venda' },
    { label: 'Representantes e comissões', href: '/recursos/representantes-e-comissoes', description: 'Vendas por representação comercial' },
    { label: 'Metas de vendedores', href: '/recursos/metas-de-vendedores', description: 'Objetivos e acompanhamento da equipe' },
    { label: 'Catálogo online', href: '/recursos/catalogo-online', description: 'Vitrine digital integrada ao estoque' },
    { label: 'Agenda', href: '/recursos/agenda', description: 'Compromissos e atendimentos' },
    { label: 'Lojiva Produção (facção)', href: '/recursos/producao', description: 'Ordens de produção e terceirizados' },
    { label: 'Ver todos os recursos', href: '/recursos' },
  ],
};

export const SOLUCOES_MENU: NavGroup = {
  label: 'Soluções',
  href: '/segmentos',
  links: [
    { label: 'Loja de roupas e moda', href: '/segmentos/loja-de-roupas-e-moda' },
    { label: 'Atacado e representantes', href: '/segmentos/atacado-e-representantes' },
    { label: 'Varejo multicanal', href: '/segmentos/varejo-multicanal' },
    { label: 'Ver todos os segmentos', href: '/segmentos' },
  ],
};

export const INTEGRACOES_MENU: NavGroup = {
  label: 'Integrações',
  href: '/integracoes',
  links: [
    { label: 'Smart TEF (maquininha)', href: '/integracoes/smart-tef' },
    { label: 'Shopee', href: '/integracoes/shopee' },
    { label: 'Nuvemshop', href: '/integracoes/nuvemshop' },
    { label: 'Mercado Pago', href: '/integracoes/mercado-pago' },
    { label: 'Correios', href: '/integracoes/correios' },
    { label: 'Melhor Envio', href: '/integracoes/melhor-envio' },
    { label: 'SuperFrete', href: '/integracoes/superfrete' },
    { label: 'Ver todas as integrações', href: '/integracoes' },
  ],
};

export const CONTEUDO_MENU: NavGroup = {
  label: 'Conteúdo',
  href: '/guias',
  links: [
    { label: 'Guias', href: '/guias', description: 'Conteúdo prático para lojistas' },
    { label: 'Comparações', href: '/comparar', description: 'Sistema vs planilha, especializado vs genérico' },
    { label: 'Perguntas frequentes', href: '/perguntas', description: 'É confiável? Vale a pena? Limitações?' },
    { label: 'Glossário', href: '/glossario', description: 'Termos de gestão, fiscal e varejo' },
  ],
};

export const MAIN_NAV = [PRODUTO_MENU, SOLUCOES_MENU, INTEGRACOES_MENU, CONTEUDO_MENU];

const FOOTER_PRODUTO = [
  '/recursos/pdv',
  '/recursos/tef-e-maquininha',
  '/recursos/link-de-pagamento',
  '/recursos/controle-de-estoque',
  '/recursos/grade-cor-e-tamanho',
  '/recursos/financeiro',
  '/recursos/relatorios-e-dre',
  '/recursos/fiscal-nfe-nfce',
];

export const FOOTER_COLUMNS = [
  {
    title: 'Produto',
    links: PRODUTO_MENU.links.filter((l) => FOOTER_PRODUTO.includes(l.href)),
  },
  {
    title: 'Segmentos',
    links: SOLUCOES_MENU.links.filter((l) => l.href !== '/segmentos'),
  },
  {
    title: 'Integrações',
    links: INTEGRACOES_MENU.links.filter((l) => l.href !== '/integracoes'),
  },
  {
    title: 'Conteúdo',
    links: [
      { label: 'Guias', href: '/guias' },
      { label: 'Comparações', href: '/comparar' },
      { label: 'Perguntas frequentes', href: '/perguntas' },
      { label: 'Glossário', href: '/glossario' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre a Lojiva', href: '/sobre' },
      { label: 'Preços', href: '/precos' },
      { label: 'Falar com especialista', href: '#whatsapp' },
    ],
  },
];

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/evolveresoftware/',
  linkedin: 'https://www.linkedin.com/company/evolveresoftware/',
  youtube: 'https://www.youtube.com/@EvolvereSoftware',
};
