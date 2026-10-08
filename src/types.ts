export type LadoType = 'A' | 'B' | 'bonus';

export type CaseBlockType = 'text' | 'video' | 'image';
export type CaseBlockAlignment = 'left' | 'center' | 'right';
export type CaseBlockScale = 'compact' | 'medium' | 'large';

export interface CaseBlock {
  id: string;
  type: CaseBlockType;
  content?: string;
  value?: any;
  caption?: string;
  columns?: any;
  aspect?: any;
  scale?: CaseBlockScale | string;
  alignment?: CaseBlockAlignment;
}

export type GridSpanType =
  | 'full'
  | 'half'
  | 'half-center'
  | 'half-right'
  | 'third'
  | 'third-center'
  | 'third-right';

export type CardRatioType = 'original' | 'square' | 'vertical' | 'horizontal';
export type CardAlignType = 'left' | 'center' | 'right';

export interface CaseMetric {
  label: string;
  value: string;
}

export interface CaseItem {
  slug: string;
  name: string;
  concept: string;
  faixa: string;
  deliv: string;
  cover: string;
  coverFormat?: CardRatioType | string;
  format?: CardRatioType | string;
  aspectRatio?: string;
  lado?: LadoType;
  gridSpan?: GridSpanType;
  cardRatio?: CardRatioType;
  cardAlign?: CardAlignType;
  textAlign?: 'left' | 'center' | 'right';
  summary?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  metrics?: CaseMetric[];
  gallery?: string[];
  tags?: string[];
  clientLogo?: string;
  externalLink?: string;
  externalLinkText?: string;
  clientUrl?: string;
  roles?: string;
  year?: string;
  text: string[];
  yt: string[];
  imgs: string[];
  blocks?: CaseBlock[];
  pieces?: Array<{
    id: string;
    type: string;
    url: string;
    title?: string;
  }>;
}

export interface CmsContextType {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  cases: CaseItem[];
  reorderCases: (draggedSlug: string, targetSlug: string) => void;
  moveCaseOrder: (slug: string, direction: 'up' | 'down') => void;
  updateCaseField: (slug: string, field: keyof CaseItem, value: any) => void;
  updateCaseGridSpan: (slug: string, span: GridSpanType) => void;
  servicos?: any;
  updateServicosField?: (field: string, value: any) => void;
  [key: string]: any;
}
