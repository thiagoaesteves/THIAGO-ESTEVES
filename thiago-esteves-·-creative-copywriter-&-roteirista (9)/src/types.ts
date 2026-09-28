export type LadoType = 'A' | 'B' | 'bonus';

export type CaseBlockType = 'text' | 'video' | 'image';

export interface CaseBlock {
  id: string;
  type: CaseBlockType;
  value: string;
  aspect?: 'auto' | 'contain' | 'square' | 'story' | 'video';
  columns?: number;
  scale?: 'original' | 'thumb';
}

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
  blocks?: CaseBlock[];
}
