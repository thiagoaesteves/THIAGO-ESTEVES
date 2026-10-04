export type GridSpanType = 'full' | 'half' | 'third';
export type CardRatioType = 'original' | 'square' | 'vertical' | 'horizontal';
export type CardAlignType = 'left' | 'center' | 'right';

export interface CaseItem {
  slug: string;
  name: string;
  concept: string;
  faixa: string;
  deliv: string;
  cover: string;
  lado?: 'A' | 'B';
  gridSpan?: GridSpanType;
  cardRatio?: CardRatioType;
  cardAlign?: CardAlignType;
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
}