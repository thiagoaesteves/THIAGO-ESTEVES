export interface SobreData {
  photoUrl: string;
  badge: string;
  name: string;
  role: string;
  tagline: string;
  title: string;
  bio: string[];
  clientsTitle: string;
  clientsText: string;
  stats: {
    stat1Number: string;
    stat1Label: string;
    stat1Sub: string;
    stat2Number: string;
    stat2Label: string;
    stat2Sub: string;
    stat3Number: string;
    stat3Label: string;
    stat3Sub: string;
  };
  segmentsTitle: string;
  segments: string[];
}

export const ORIGINAL_SOBRE_DATA: SobreData = {
  photoUrl: 'https://cdn.myportfolio.com/1d3f31e9-221e-41c7-bd84-2a081f93562b/bc5e16c3-d424-4341-854b-78011e6a2516_rw_1920.jpeg?h=7f552ace409a0aa0e4d9fdfe434da652',
  badge: 'Based in Brazil · Available Worldwide',
  name: 'Thiago Esteves',
  role: 'Creative Copywriter & Storyteller',
  tagline: 'Sobre',
  title: 'Quem é do Méier não bobéia.',
  bio: [
    'Quem é do Méier não bobéia.',
    'E, como uma boa cria da Zona Norte carioca, eu tive que usar a criatividade para me virar e sobreviver desde cedo.',
    'A vida me fez vendedor por muitos anos, até eu deixar de ser ao me tornar publicitário (e continuar vendendo).',
    'Essa sagacidade me ensinou alguns soft skills off label que uso para vender ideias e conceitos nas minhas criações.',
    'Já bati o ponto em agências do Rio de Janeiro, do Sul e de São Paulo, e algumas das minhas ideias já saíram do país.',
    'Amo boas histórias, novas culturas e a minha profissão. Sou apaixonado por música e poesia, mas se você está procurando um músico ou poeta, eu passo a bola, porque o que eu faço bem é criar propaganda.',
  ],
  clientsTitle: 'Para quem já criei (e vendi)?',
  clientsText: 'Vivo / Samsung / Unicred / GSK / GlaxoSmithKline / Grupo Boticário / Senai / BEAUTYCOLOR / Frimesa / Chilli Beans / Jasmine Alimentos / Dunlop Pneus / BR Malls / Unimed RJ / Detran-RJ / Nipponflex Brasil & USA / WEG Motores / Volvo Trucks Corporation / John Deere Brasil & Espanha / Electrolux / Tintas Verginia / Coritiba Football Club / Paraná Banco / Hortifruti e Natural da Terra / CBF / entre outras',
  stats: {
    stat1Number: '15+',
    stat1Label: 'anos de estrada',
    stat1Sub: 'e muita história pra contar',
    stat2Number: '50+',
    stat2Label: 'marcas atendidas',
    stat2Sub: 'nacionais e multinacionais',
    stat3Number: '3 + 3',
    stat3Label: 'praças & países',
    stat3Sub: 'RJ, Sul, SP · Brasil, EUA & Espanha',
  },
  segmentsTitle: 'Segmentos Atendidos',
  segments: [
    'Beleza & Cosméticos',
    'Finanças & Bancos',
    'Tech & Telecom',
    'Automotivo & Linha Pesada',
    'Saúde & Farma',
    'Alimentos & Bebidas',
    'Varejo & Moda',
    'Bens de Consumo & Indústria',
    'Educação & Idiomas',
    'Esportes & Futebol',
    'Imobiliário & Hotelaria',
    'Governo & Cidadania',
  ],
};
