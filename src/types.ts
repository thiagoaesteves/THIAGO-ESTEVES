export type LadoType = 'A' | 'B' | 'bonus';

export interface CaseItem {
  slug: string;
  lado: LadoType;
  faixa: string;
  name: string;
  concept: string;
  deliv: string;
  text: string[];
  cover: string;
  imgs: string[];
  yt: string[];
}
