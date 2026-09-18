// Depoimentos reais, reaproveitados do site institucional em produção
// (Lojiva-site/src/components/Testimonials.tsx). Apenas depoimentos com
// nome de empresa e avatar reais foram mantidos.

export type Testimonial = {
  content: string;
  author: string;
  role: string;
  avatar: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    content:
      'O sistema facilitou muito o processo, controle de vendas, rotas, comissões, desempenho e controle financeiro, etiquetas e dados apurados para aplicarmos em estratégias de marketing, além de conseguir trabalhar às claras com os resultados obtidos.',
    author: 'Cia do Jeans Jaraguá',
    role: 'Loja de roupas',
    avatar: '/assets/logo-cia-do-jeans.png',
  },
  {
    content:
      'A organização da produção e do financeiro aumentou o desempenho e a lucratividade do meu negócio. Sistema nota 10!',
    author: 'Selaria MS',
    role: 'Selaria',
    avatar: '/assets/logo-selaria-ms.jpeg',
  },
  {
    content:
      'Esse sistema é bom demais, ajudou a automatizar todo o processo de contato com cliente, vendas, pedidos, coletas, envios e também o controle financeiro das movimentações.',
    author: 'Jeanstyle',
    role: 'Loja de roupas',
    avatar: '/assets/logo-jeanstyle.png',
  },
  {
    content:
      'Sistema muito rico, me ajuda muito no dia a dia. Depois de testar vários, esse foi o melhor que encontrei no mercado por um ótimo preço.',
    author: 'KEKS Company',
    role: 'Loja de roupas',
    avatar: '/assets/logo-keks.jpeg',
  },
];
