export type GridSpanType = 
  | 'full' 
  | 'half' 
  | 'half-center' 
  | 'half-right' 
  | 'third' 
  | 'third-center' 
  | 'third-right';

export type CardRatioType = 'original' | 'square' | 'vertical' | 'horizontal';

export interface CaseMetric {
  value: string;
  label: string;
}

export interface CaseItem {
  slug: string;
  name: string;
  client?: string;
  lado: 'A' | 'B' | 'bonus';
  gridSpan?: GridSpanType;
  cardRatio?: CardRatioType; // <--- Novo controlo de proporção (original, quadrado, vertical, horizontal)
  year?: string;
  role?: string;
  coverImage?: string;
  heroImage?: string;
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
}