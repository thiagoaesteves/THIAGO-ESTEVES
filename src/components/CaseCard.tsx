import React, { useState } from 'react';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Edit3,
  Image as ImageIcon,
} from 'lucide-react';
import { CaseItem } from '../types';
import { useCms } from '../context/CmsContext';

interface CaseCardProps {
  item: CaseItem;
  onSelect: (item: CaseItem) => void;
  dark?: boolean;
  bonus?: boolean;
}

export const CaseCard: React.FC<CaseCardProps> = ({
  item,
  onSelect,
  dark = false,
  bonus = false,
}) => {
  const { isEditMode, reorderCases, moveCaseOrder, updateCaseField } = useCms();
  const isLadoA = item.lado === 'A';

  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [coverInput, setCoverInput] = useState(item.cover);

  const handleCardClick = (e: React.MouseEvent) => {
    // In edit mode, don't open modal if clicking on editable elements or action buttons
    if (isEditMode) {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('input') ||
        target.closest('[contenteditable="true"]') ||
        target.closest('.cms-control')
      ) {
        return;
      }
    }
    onSelect(item);
  };

  return (
    <div
      id={`card-${item.slug}`}
      draggable={isEditMode}
      onDragStart={(e) => {
        if (!isEditMode) return;
        e.dataTransfer.setData('text/plain', item.slug);
        setIsDragging(true);
      }}
      onDragOver={(e) => {
        if (!isEditMode) return;
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        if (!isEditMode) return;
        e.preventDefault();
        setIsDragOver(false);
        setIsDragging(false);
        const draggedSlug = e.dataTransfer.getData('text/plain');
        if (draggedSlug && draggedSlug !== item.slug) {
          reorderCases(draggedSlug, item.slug);
        }
      }}
      onDragEnd={() => setIsDragging(false)}
      onClick={handleCardClick}
      className={`group relative text-left transition-all duration-300 rounded-xl p-3 sm:p-4 ${
        isEditMode ? 'cursor-grab active:cursor-grabbing border-2' : 'cursor-pointer'
      } ${
        isDragging
          ? 'opacity-40 scale-[0.98]'
          : isDragOver
          ? 'ring-4 ring-[#2340FF] bg-[#2340FF]/10'
          : bonus
          ? isEditMode
            ? 'border-black/30 bg-black/[0.04] hover:border-[#0F1222]'
            : 'hover:bg-black/[0.08] focus-within:ring-2 focus-within:ring-[#0F1222]'
          : dark
          ? isEditMode
            ? 'border-white/20 bg-white/[0.03] hover:border-[#FF4FA0]'
            : 'hover:bg-white/[0.04] focus-within:ring-2 focus-within:ring-[#FF4FA0]'
          : isEditMode
          ? 'border-black/20 bg-black/[0.02] hover:border-[#2340FF]'
          : 'hover:bg-black/[0.03] focus-within:ring-2 focus-within:ring-[#2340FF]'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (!isEditMode) {
            e.preventDefault();
            onSelect(item);
          }
        }
      }}
      aria-label={`Ver case ${item.name} - ${item.concept}`}
    >
      {/* CMS Drag & Control Bar on top of card */}
      {isEditMode && (
        <div className="cms-control flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-black/10 dark:border-white/10 select-none">
          <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold text-[#2340FF] dark:text-[#D4FF3A]">
            <GripVertical className="w-4 h-4 cursor-grab" />
            <span>ARRAPSTE PARA REORDENAR</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Move Up Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                moveCaseOrder(item.slug, 'up');
              }}
              className="p-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#343848] dark:text-white"
              title="Mover para cima"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            {/* Move Down Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                moveCaseOrder(item.slug, 'down');
              }}
              className="p-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#343848] dark:text-white"
              title="Mover para baixo"
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Edit Cover URL Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingCover(!isEditingCover);
              }}
              className="p-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#343848] dark:text-white text-xs font-mono-code flex items-center gap-1"
              title="Trocar imagem de capa"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>

            {/* Open Detail & Edit Media */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#2340FF] text-white hover:bg-[#1B34D6] text-xs font-mono-code font-semibold ml-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Editar Peças
            </button>
          </div>
        </div>
      )}

      {/* Edit Cover URL Input Dropdown */}
      {isEditMode && isEditingCover && (
        <div
          className="cms-control mb-3 p-2.5 rounded bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/20 flex gap-2 items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            value={coverInput}
            onChange={(e) => setCoverInput(e.target.value)}
            placeholder="URL da imagem de capa..."
            className="flex-1 px-2.5 py-1 text-xs font-mono-code bg-white dark:bg-[#0F1222] border border-black/20 dark:border-white/20 rounded text-[#0F1222] dark:text-white"
          />
          <button
            type="button"
            onClick={() => {
              updateCaseField(item.slug, 'cover', coverInput);
              setIsEditingCover(false);
            }}
            className="px-2.5 py-1 bg-[#2340FF] text-white text-xs font-mono-code rounded font-bold"
          >
            Salvar Capa
          </button>
        </div>
      )}

      {/* Thumbnail Container */}
      <div className="relative aspect-[16/9] bg-[#E4E6EA] dark:bg-[#1a1e36] overflow-hidden rounded-md border border-black/5 dark:border-white/10 shadow-sm">
        <img
          src={item.cover}
          alt={`Capa do case ${item.name}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />

        {/* Triangle Corner Flap */}
        <div
          className={`absolute top-0 right-0 w-11 h-11 transition-all duration-300 group-hover:w-16 group-hover:h-16 pointer-events-none ${
            bonus
              ? 'bg-[linear-gradient(225deg,#D4FF3A_50%,#0F1222_50%,#0F1222_100%)]'
              : isLadoA
              ? 'bg-[linear-gradient(225deg,#F6F7F2_50%,#1B34D6_50%,#2340FF_100%)]'
              : 'bg-[linear-gradient(225deg,#0F1222_50%,#C83C80_50%,#FF4FA0_100%)]'
          }`}
          aria-hidden="true"
        />
      </div>

      {/* Meta Row */}
      <div
        className={`flex justify-between items-baseline gap-2 mt-3.5 font-mono-code text-xs uppercase tracking-wider ${
          bonus ? 'text-[#0F1222] font-semibold' : dark ? 'text-[#AFC0FF]' : 'text-[#5B6070]'
        }`}
      >
        {isEditMode ? (
          <input
            type="text"
            value={item.faixa}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => updateCaseField(item.slug, 'faixa', e.target.value)}
            className="font-semibold bg-transparent border-b border-dashed border-[#2340FF] px-1 text-xs focus:outline-none focus:bg-black/5 dark:focus:bg-white/10 rounded"
            title="Editar texto da Faixa"
          />
        ) : (
          <span className="font-semibold">{item.faixa}</span>
        )}

        {isEditMode ? (
          <input
            type="text"
            value={item.deliv}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => updateCaseField(item.slug, 'deliv', e.target.value)}
            className="text-right bg-transparent border-b border-dashed border-[#2340FF] px-1 text-xs focus:outline-none focus:bg-black/5 dark:focus:bg-white/10 rounded"
            title="Editar Entregas"
          />
        ) : (
          <span className="truncate max-w-[60%] text-right">{item.deliv.split(/[ ,]/)[0]}</span>
        )}
      </div>

      {/* Title */}
      {isEditMode ? (
        <div className="mt-1.5" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={item.name}
            onChange={(e) => updateCaseField(item.slug, 'name', e.target.value)}
            className={`w-full font-disp font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight bg-transparent border-b-2 border-dashed border-[#2340FF] dark:border-[#FF4FA0] px-1 focus:outline-none focus:bg-black/5 dark:focus:bg-white/10 rounded transition-colors ${
              dark ? 'text-white' : 'text-[#0F1222]'
            }`}
            title="Clique para editar o título do projeto"
          />
        </div>
      ) : (
        <h3
          className={`font-disp font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mt-1.5 transition-colors ${
            bonus
              ? 'text-[#0F1222] group-hover:text-[#2340FF]'
              : dark
              ? 'text-white group-hover:text-[#FF4FA0]'
              : 'text-[#0F1222] group-hover:text-[#2340FF]'
          }`}
        >
          {item.name}
        </h3>
      )}

      {/* Concept */}
      {isEditMode ? (
        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
          <textarea
            value={item.concept}
            rows={2}
            onChange={(e) => updateCaseField(item.slug, 'concept', e.target.value)}
            className={`w-full text-lg sm:text-xl md:text-2xl leading-snug bg-transparent border border-dashed border-[#2340FF] dark:border-[#FF4FA0] p-1.5 focus:outline-none focus:bg-black/5 dark:focus:bg-white/10 rounded resize-y transition-colors ${
              bonus ? 'text-[#1D2611]' : dark ? 'text-[#D5DBF5]' : 'text-[#343848]'
            }`}
            title="Clique para editar o conceito do projeto"
          />
        </div>
      ) : (
        <p
          className={`text-lg sm:text-xl md:text-2xl leading-snug mt-2 ${
            bonus ? 'text-[#1D2611]' : dark ? 'text-[#D5DBF5]' : 'text-[#343848]'
          }`}
        >
          {item.concept}
        </p>
      )}
    </div>
  );
};
