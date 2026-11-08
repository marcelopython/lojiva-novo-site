export type NavLink = {
  label: string;
  href: string;
  description?: string;
  section?: 'Vendas' | 'Estoque' | 'Financeiro' | 'Fiscal' | 'Gestão';
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
    { label: 'PDV', href: '/recursos/pdv', description: 'Vendas, caixa e pagamentos', section: 'Vendas' },
    { label: 'Controle de caixa', href: '/recursos/controle-de-caixa', description: 'Abertura, sangria e fechamento', section: 'Vendas' },
    { label: 'TEF e maquininha', href: '/recursos/tef-e-maquininha', description: 'Cartão e PIX na maquininha (Smart TEF)', section: 'Vendas' },
    { label: 'Link de pagamento', href: '/recursos/link-de-pagamento', description: 'Cobre por Pix, boleto ou cartão a distância', section: 'Vendas' },
    { label: 'Fiado e crediário', href: '/recursos/fiado-e-crediario', description: 'Limite de crédito e saldo em aberto', section: 'Vendas' },
    { label: 'Controle de estoque', href: '/recursos/controle-de-estoque', description: 'Saldo, alertas e transferências', section: 'Estoque' },
    { label: 'Produto kit', href: '/recursos/produto-kit', description: 'Venda combos com baixa dos componentes', section: 'Estoque' },
    { label: 'Grade de cor e tamanho', href: '/recursos/grade-cor-e-tamanho', description: 'Variações para moda e calçados', section: 'Estoque' },
    { label: 'Etiquetas de código de barras', href: '/recursos/etiquetas-codigo-de-barras', description: 'Arquivos PDF e ZPL para produtos e variações', section: 'Estoque' },
    { label: 'Preço por quantidade', href: '/recursos/preco-por-quantidade', description: 'Faixas de preço para atacado', section: 'Vendas' },
    { label: 'Multi-loja e multi-estoque', href: '/recursos/multi-loja', description: 'Várias lojas e depósitos', section: 'Estoque' },
    { label: 'Compras e importação de XML', href: '/recursos/compras-e-xml', description: 'Entrada de estoque pela nota do fornecedor', section: 'Estoque' },
    { label: 'Fornecedores', href: '/recursos/fornecedores', description: 'Cadastro, busca e relatórios', section: 'Estoque' },
    { label: 'Logística de pedidos', href: '/recursos/logistica-de-pedidos', description: 'Embalar, coletar e enviar', section: 'Estoque' },
    { label: 'Clientes', href: '/recursos/clientes', description: 'Cadastro, crédito e carteira', section: 'Gestão' },
    { label: 'Financeiro', href: '/recursos/financeiro', description: 'Contas a pagar, receber e fluxo de caixa', section: 'Financeiro' },
    { label: 'Extrato e saques', href: '/recursos/extrato-e-saques', description: 'Saldo do recebedor e solicitações', section: 'Financeiro' },
    { label: 'Relatórios e DRE', href: '/recursos/relatorios-e-dre', description: 'Relatórios por área e resultado', section: 'Financeiro' },
    { label: 'Dashboard e Visão Executiva', href: '/recursos/dashboard-e-visao-executiva', description: 'Indicadores de vendas, finanças e estoque', section: 'Gestão' },
    { label: 'Usuários e permissões', href: '/recursos/usuarios-e-permissoes', description: 'Acessos da equipe', section: 'Gestão' },
    { label: 'Fiscal (NF-e / NFC-e)', href: '/recursos/fiscal-nfe-nfce', description: 'Emissão de notas fiscais', section: 'Fiscal' },
    { label: 'NFS-e Nacional', href: '/recursos/nfs-e', description: 'Nota de serviços no padrão nacional', section: 'Fiscal' },
    { label: 'Trocas e devoluções', href: '/recursos/trocas-e-devolucoes', description: 'Fluxo completo de pós-venda', section: 'Vendas' },
    { label: 'Consignado', href: '/recursos/consignado', description: 'Envios e acertos de representantes', section: 'Vendas' },
    { label: 'Representantes e comissões', href: '/recursos/representantes-e-comissoes', description: 'Vendas por representação comercial', section: 'Vendas' },
    { label: 'Calculadora de precificação', href: '/recursos/calculadora-de-precificacao', description: 'Simule preço e margem antes da venda', section: 'Vendas' },
    { label: 'Metas de vendedores', href: '/recursos/metas-de-vendedores', description: 'Objetivos e acompanhamento da equipe', section: 'Gestão' },
    { label: 'Catálogo online', href: '/recursos/catalogo-online', description: 'Vitrine digital integrada ao estoque', section: 'Vendas' },
    { label: 'Anúncios Shopee e Nuvemshop', href: '/recursos/anuncios-shopee-nuvemshop', description: 'Importação e vínculos de anúncios', section: 'Vendas' },
    { label: 'Lojiva Connect', href: '/recursos/lojiva-connect', description: 'Catálogo compartilhado entre lojas', section: 'Gestão' },
    { label: 'Agenda', href: '/recursos/agenda', description: 'Compromissos e atendimentos', section: 'Gestão' },
    { label: 'Guia do Sistema', href: '/recursos/guia-do-sistema', description: 'Trilhas para aprender o ERP', section: 'Gestão' },
    { label: 'Lojiva Produção (facção)', href: '/recursos/producao', description: 'Ordens de produção e terceirizados', section: 'Gestão' },
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
    { label: 'Correios', href: '/integracoes/correios' },
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
  '/recursos/controle-de-caixa',
  '/recursos/tef-e-maquininha',
  '/recursos/link-de-pagamento',
  '/recursos/fiado-e-crediario',
  '/recursos/controle-de-estoque',
  '/recursos/produto-kit',
  '/recursos/preco-por-quantidade',
  '/recursos/grade-cor-e-tamanho',
  '/recursos/etiquetas-codigo-de-barras',
  '/recursos/fornecedores',
  '/recursos/clientes',
  '/recursos/logistica-de-pedidos',
  '/recursos/dashboard-e-visao-executiva',
  '/recursos/extrato-e-saques',
  '/recursos/anuncios-shopee-nuvemshop',
  '/recursos/lojiva-connect',
  '/recursos/financeiro',
  '/recursos/relatorios-e-dre',
  '/recursos/fiscal-nfe-nfce',
  '/recursos/nfs-e',
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
