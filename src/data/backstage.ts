export interface EspecialidadeItem {
  num: string;
  categoria: string;
  amp: string;
  resto: string;
  itens: string[];
}

export interface ManifestoData {
  line1: string;
  line2: string;
  subText: string;
  badge: string;
}

export interface BackstageFooterData {
  badge: string;
  line1: string;
  line2: string;
}

export type ServicosFooterData = BackstageFooterData;

export interface BackstageData {
  especialidades: EspecialidadeItem[];
  manifesto: ManifestoData;
  footer: BackstageFooterData;
}

export type ServicosData = BackstageData;

export const DEFAULT_ESPECIALIDADES: EspecialidadeItem[] = [
  {
    num: '01',
    categoria: 'Conceito',
    amp: '&',
    resto: 'Estratégia',
    itens: [
      'Desenvolvimento de conceitos',
      'branding, naming, identidade verbal e manifestos',
      'KVs, insights e títulos',
    ],
  },
  {
    num: '02',
    categoria: 'Campanhas',
    amp: '&',
    resto: 'Conteúdo',
    itens: [
      'Campanhas 360° (on e off)',
      'roteiros audiovisuais, jingles e brand content',
      'social media e transmídia',
    ],
  },
  {
    num: '03',
    categoria: 'Experiência',
    amp: '&',
    resto: 'Ativação',
    itens: [
      'Brand experience e ações de live marketing',
      'big ideas, ativações de PDV e comunicação interna',
    ],
  },
  {
    num: '04',
    categoria: 'Apresentação',
    amp: '&',
    resto: 'Conexão',
    itens: [
      'Storytelling de projetos e defesa de ideias com argumentos afiados para aprovar campanhas e tirar o papel',
    ],
  },
];

export const DEFAULT_MANIFESTO: ManifestoData = {
  line1: 'A vida me fez vendedor.',
  line2: 'Eu me fiz publicitário.',
  subText: 'E aprendi a gerar resultados criativos em qualquer formato.',
  badge: 'Inclusive... todos.',
};

export const DEFAULT_FOOTER: BackstageFooterData = {
  badge: '05 // E O QUE MAIS FOR PRECISO',
  line1: 'Especialista cascudo, ponta firme, sangue nos olhos',
  line2: 'sem nunca abrir mão da criatividade.',
};

export const DEFAULT_BACKSTAGE_DATA: BackstageData = {
  especialidades: DEFAULT_ESPECIALIDADES,
  manifesto: DEFAULT_MANIFESTO,
  footer: DEFAULT_FOOTER,
};

export const ORIGINAL_BACKSTAGE_DATA: BackstageData = DEFAULT_BACKSTAGE_DATA;
export const DEFAULT_SERVICOS_DATA: BackstageData = DEFAULT_BACKSTAGE_DATA;

/**
 * Valida e garante fallbacks explícitos para strings vazias "", nulas ou indefinidas,
 * impedindo que textos sumam caso o Firestore ou cache retornem valores vazios.
 */
export function getSafeText(val: any, fallback: string): string {
  if (typeof val !== 'string' || !val.trim()) {
    return fallback;
  }
  return val;
}

export function sanitizeBackstageData(data: any): BackstageData {
  if (!data || typeof data !== 'object') {
    return { ...DEFAULT_BACKSTAGE_DATA };
  }

  const manifesto: ManifestoData = {
    line1: getSafeText(data.manifesto?.line1, DEFAULT_MANIFESTO.line1),
    line2: getSafeText(data.manifesto?.line2, DEFAULT_MANIFESTO.line2),
    subText: getSafeText(data.manifesto?.subText, DEFAULT_MANIFESTO.subText),
    badge: getSafeText(data.manifesto?.badge, DEFAULT_MANIFESTO.badge),
  };

  const footer: BackstageFooterData = {
    badge: getSafeText(data.footer?.badge, DEFAULT_FOOTER.badge),
    line1: getSafeText(data.footer?.line1, DEFAULT_FOOTER.line1),
    line2: getSafeText(data.footer?.line2, DEFAULT_FOOTER.line2),
  };

  const especialidades: EspecialidadeItem[] =
    Array.isArray(data.especialidades) && data.especialidades.length > 0
      ? data.especialidades.map((esp: any, idx: number) => {
          const def = DEFAULT_ESPECIALIDADES[idx] || {
            num: `0${idx + 1}`,
            categoria: '',
            amp: '&',
            resto: '',
            itens: [],
          };
          return {
            num: getSafeText(esp?.num, def.num),
            categoria: getSafeText(esp?.categoria, def.categoria),
            amp: esp?.amp !== undefined && esp?.amp !== null && esp?.amp !== '' ? esp.amp : def.amp,
            resto: getSafeText(esp?.resto, def.resto),
            itens: Array.isArray(esp?.itens) && esp.itens.length > 0 ? esp.itens : def.itens,
          };
        })
      : DEFAULT_ESPECIALIDADES;

  return {
    especialidades,
    manifesto,
    footer,
  };
}

export const sanitizeServicosData = sanitizeBackstageData;
