import React from 'react';
import { CaseItem, CardRatioType } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface CaseCardProps {
  item: CaseItem;
  onSelect: (item: CaseItem) => void;
  dark?: boolean;
  bonus?: boolean;
  featured?: boolean;
  positionIndex?: number;
}

const getRatioClass = (ratio?: CardRatioType) => {
  switch (ratio) {
    case 'square':
      return 'aspect-square object-cover w-full';
    case 'vertical':
      return 'aspect-[4/5] object-cover w-full';
    case 'horizontal':
      return 'aspect-[16/9] object-cover w-full';
    case 'original':
    default:
      return 'h-auto w-full object-cover';
  }
};

export const CaseCard: React.FC<CaseCardProps> = ({
  item,
  onSelect,
  dark = false,
  bonus = false,
  featured = false,
  positionIndex,
}) => {
  const ratioClass = getRatioClass(item.cardRatio);

  return (
    <div 
      onClick={() => onSelect(item)}
      className="group cursor-pointer flex flex-col transition-all duration-300 select-none"
    >
      {/* Imagem / Capa com Proporção Dinâmica */}
      <div className="relative overflow-hidden rounded-2xl bg-[#181C32]/5 border border-black/5 mb-3">
        {item.coverImage ? (
          <img
            src={item.coverImage}
            alt={item.name}
            className={`${ratioClass} transition-transform duration-700 group-hover:scale-105`}
          />
        ) : (
          <div className={`${ratioClass} bg-[#0F1222]/10 flex items-center justify-center font-mono-code text-xs text-[#5B6070]`}>
            Sem imagem
          </div>
        )}

        {/* Tag do Cliente / Categoria flutuante */}
        {item.client && (
          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full font-mono-code text-[11px] uppercase tracking-wider">
            {item.client}
          </div>
        )}

        {/* Ícone de Ação ao Hover */}
        <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 text-[#0F1222] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      {/* Título e Subtítulo do Card */}
      <div className="flex items-start justify-between gap-4 px-1">
        <div>
          <h3 className={`font-disp font-bold text-xl sm:text-2xl tracking-tight transition-colors ${dark ? 'text-white group-hover:text-[#FF4FA0]' : bonus ? 'text-[#0F1222] group-hover:text-[#2340FF]' : 'text-[#0F1222] group-hover:text-[#2340FF]'}`}>
            {item.name}
          </h3>
          {item.summary && (
            <p className={`font-mono-code text-xs sm:text-sm mt-1 line-clamp-2 ${dark ? 'text-white/60' : 'text-[#5B6070]'}`}>
              {item.summary}
            </p>
          )}
        </div>
        {positionIndex && (
          <span className={`font-mono-code text-xs font-bold pt-1 ${dark ? 'text-white/40' : 'text-[#0F1222]/40'}`}>
            {String(positionIndex).padStart(2, '0')}
          </span>
        )}
      </div>
    </div>
  );
};