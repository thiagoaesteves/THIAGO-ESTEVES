import React, { useState, useRef } from 'react';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Edit3,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react';
import { CaseItem } from '../types';
import { useCms } from '../context/CmsContext';
import { processImageUpload } from '../utils/imageUpload';

interface CaseCardProps {
  item: CaseItem;
  onSelect: (item: CaseItem) => void;
  dark?: boolean;
  bonus?: boolean;
  featured?: boolean;
  positionIndex?: number;
  columns?: 1 | 2 | 3;
}

export const CaseCard: React.FC<CaseCardProps> = ({
  item,
  onSelect,
  dark = false,
  bonus = false,
  featured = true,
  positionIndex,
  columns = 2,
}) => {
  const { isEditMode, reorderCases, moveCaseOrder, updateCaseField } = useCms();
  const isLadoA = item.lado === 'A';

  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [coverInput, setCoverInput] = useState(item.cover);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handleCardClick = (e: React.MouseEvent) => {
    // In edit mode, don't open modal if clicking on editable elements or action buttons
    if (isEditMode) {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
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
        const target = e.target as HTMLElement;
        if (
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('button')
        ) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData('text/plain', item.slug);
        e.dataTransfer.effectAllowed = 'move';
        setIsDragging(true);
      }}
      onDragOver={(e) => {
        if (!isEditMode) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!isDragOver) setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        if (!isEditMode) return;
        const currentTarget = e.currentTarget;
        const relatedTarget = e.relatedTarget as Node | null;
        if (!currentTarget.contains(relatedTarget)) {
          setIsDragOver(false);
        }
      }}
      onDrop={(e) => {
        if (!isEditMode) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        setIsDragging(false);
        const draggedSlug = e.dataTransfer.getData('text/plain');
        if (draggedSlug && draggedSlug !== item.slug) {
          reorderCases(draggedSlug, item.slug);
        }
      }}
      onDragEnd={() => {
        setIsDragging(false);
        setIsDragOver(false);
      }}
      onClick={handleCardClick}
      className={`group relative text-left transition-all duration-300 rounded-xl p-3 sm:p-4 ${
        isEditMode ? 'cursor-grab active:cursor-grabbing border-2' : 'cursor-pointer'
      } ${
        isDragging
          ? 'opacity-30 scale-[0.98] border-dashed border-[#2340FF]'
          : isDragOver
          ? 'ring-4 ring-[#2340FF] bg-[#2340FF]/15 scale-[1.01] shadow-2xl'
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
      {/* Drop Target Interactive Highlight Overlay */}
      {isEditMode && isDragOver && (
        <div className="pointer-events-none absolute inset-0 z-30 rounded-xl ring-4 ring-[#2340FF] dark:ring-[#D4FF3A] bg-[#2340FF]/20 dark:bg-[#D4FF3A]/20 backdrop-blur-[1px] flex items-center justify-center transition-all animate-pulse">
          <span className="px-4 py-2 rounded-lg bg-[#2340FF] text-white dark:bg-[#D4FF3A] dark:text-[#0F1222] font-mono-code font-bold text-xs uppercase tracking-wider shadow-2xl">
            Soltar aqui para posicionar
          </span>
        </div>
      )}

      {/* CMS Drag & Control Bar on top of card */}
      {isEditMode && (
        <div className="cms-control flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-black/10 dark:border-white/10 select-none">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono-code font-bold border transition-colors select-none ${
                bonus
                  ? 'bg-black/10 text-[#0F1222] border-black/20'
                  : dark
                  ? 'bg-white/10 text-[#D4FF3A] border-white/20'
                  : 'bg-[#2340FF]/10 text-[#2340FF] border-[#2340FF]/25'
              }`}
            >
              <GripVertical className="w-3.5 h-3.5" />
              <span>ARRASTE PARA REORDENAR</span>
            </div>

            {positionIndex !== undefined && (
              <span
                className={`text-[11px] font-mono-code font-bold px-2 py-0.5 rounded border ${
                  bonus
                    ? 'bg-black/5 text-[#0F1222]/80 border-black/15'
                    : dark
                    ? 'bg-white/5 text-white/70 border-white/15'
                    : 'bg-black/5 text-[#343848] border-black/10'
                }`}
              >
                #{String(positionIndex).padStart(2, '0')}
              </span>
            )}
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

            {/* Edit Cover Toggle Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingCover(!isEditingCover);
              }}
              className="px-2 py-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#343848] dark:text-white text-xs font-mono-code font-bold flex items-center gap-1 cursor-pointer"
              title="Trocar imagem de capa do projeto"
            >
              <Upload className="w-3.5 h-3.5 text-[#2340FF] dark:text-[#D4FF3A]" />
              <span className="hidden sm:inline">Trocar Capa</span>
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

      {/* Edit Cover URL / Upload Dropdown */}
      {isEditMode && isEditingCover && (
        <div
          className="cms-control mb-3 p-3 rounded-lg bg-black/10 dark:bg-white/10 border border-black/15 dark:border-white/20 space-y-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code font-bold text-[#0F1222] dark:text-white">
              Alterar Capa do Projeto
            </span>
            <button
              type="button"
              onClick={() => setIsEditingCover(false)}
              className="text-xs text-gray-500 hover:text-red-500 font-mono-code"
            >
              Fechar
            </button>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Upload File Button */}
            <input
              ref={coverFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setIsUploadingCover(true);
                try {
                  const dataUrl = await processImageUpload(file, 1600, 1000, 0.85);
                  updateCaseField(item.slug, 'cover', dataUrl);
                  setCoverInput(dataUrl);
                  setIsEditingCover(false);
                } catch (err) {
                  console.error(err);
                } finally {
                  setIsUploadingCover(false);
                  if (coverFileInputRef.current) coverFileInputRef.current.value = '';
                }
              }}
            />

            <button
              type="button"
              disabled={isUploadingCover}
              onClick={() => coverFileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2340FF] hover:bg-[#1B34D6] text-white text-xs font-mono-code font-bold rounded cursor-pointer transition-colors shadow-sm disabled:opacity-50"
            >
              {isUploadingCover ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processando...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" /> Fazer Upload da Capa
                </>
              )}
            </button>

            <span className="text-xs font-mono-code text-gray-400">ou</span>

            {/* URL input */}
            <input
              type="text"
              value={coverInput}
              onChange={(e) => setCoverInput(e.target.value)}
              placeholder="Cole a URL da capa..."
              className="w-full sm:flex-1 sm:min-w-0 px-2.5 py-1.5 text-xs font-mono-code bg-white dark:bg-[#0F1222] border border-black/20 dark:border-white/20 rounded text-[#0F1222] dark:text-white"
            />
            <button
              type="button"
              onClick={() => {
                updateCaseField(item.slug, 'cover', coverInput);
                setIsEditingCover(false);
              }}
              className="px-3 py-1.5 bg-black/20 dark:bg-white/20 hover:bg-black/30 dark:hover:bg-white/30 text-[#0F1222] dark:text-white text-xs font-mono-code rounded font-bold cursor-pointer"
            >
              Salvar Link
            </button>
          </div>
        </div>
      )}

      {/* Thumbnail Container */}
      <div className="relative aspect-[16/9] bg-[#E4E6EA] dark:bg-[#1a1e36] overflow-hidden rounded-md border border-black/5 dark:border-white/10 shadow-sm group/thumb">
        <img
          src={item.cover}
          alt={`Capa do case ${item.name}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />

        {/* Edit Mode: Always Visible Quick Upload Button */}
        {isEditMode && (
          <button
            type="button"
            disabled={isUploadingCover}
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById(`cover-file-${item.slug}`)?.click();
            }}
            className="absolute top-2 left-2 z-30 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#2340FF] hover:bg-[#1B34D6] text-white text-[11px] font-mono-code font-bold shadow-lg transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
            title="Upload de imagem do computador para a capa"
          >
            {isUploadingCover ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4FF3A]" />
                <span>Carregando...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-[#D4FF3A]" />
                <span>Trocar Capa</span>
              </>
            )}
          </button>
        )}

        {/* Edit Mode: Direct Upload Cover Button Overlay */}
        {isEditMode && (
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="file"
              id={`cover-file-${item.slug}`}
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setIsUploadingCover(true);
                try {
                  const dataUrl = await processImageUpload(file, 1600, 1000, 0.85);
                  updateCaseField(item.slug, 'cover', dataUrl);
                  setCoverInput(dataUrl);
                } catch (err) {
                  console.error(err);
                } finally {
                  setIsUploadingCover(false);
                  e.target.value = '';
                }
              }}
            />

            <button
              type="button"
              disabled={isUploadingCover}
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById(`cover-file-${item.slug}`)?.click();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2340FF] hover:bg-[#1B34D6] text-white text-xs font-mono-code font-bold shadow-lg transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              {isUploadingCover ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Carregando Capa...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-[#D4FF3A]" />
                  <span>Fazer Upload da Capa</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingCover(true);
              }}
              className="text-[11px] font-mono-code text-white/80 hover:text-white underline cursor-pointer"
            >
              ou colar link / URL
            </button>
          </div>
        )}

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
        className={`flex justify-between items-baseline gap-3 mt-3.5 font-mono-code text-xs uppercase tracking-wider ${
          bonus ? 'text-[#0F1222] font-semibold' : dark ? 'text-[#AFC0FF]' : 'text-[#343848]'
        }`}
      >
        {isEditMode ? (
          <input
            type="text"
            value={item.faixa}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => updateCaseField(item.slug, 'faixa', e.target.value)}
            className={`font-semibold border-b-2 border-dashed px-1.5 py-0.5 text-xs shrink-0 w-28 focus:outline-none rounded transition-colors ${
              dark
                ? 'text-[#D4FF3A] bg-white/10 border-[#FF4FA0] focus:bg-white/20'
                : 'text-[#0F1222] bg-white/90 border-[#2340FF] shadow-sm focus:bg-white'
            }`}
            title="Editar texto da Faixa"
          />
        ) : (
          <span className="font-semibold shrink-0">{item.faixa}</span>
        )}

        {isEditMode ? (
          <input
            type="text"
            value={item.deliv}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => updateCaseField(item.slug, 'deliv', e.target.value)}
            className={`text-right flex-1 min-w-0 border-b-2 border-dashed px-2 py-0.5 text-xs focus:outline-none rounded transition-colors ${
              dark
                ? 'text-[#AFC0FF] bg-white/10 border-[#FF4FA0] focus:bg-white/20'
                : 'text-[#0F1222] bg-white/90 border-[#2340FF] shadow-sm focus:bg-white'
            }`}
            title="Editar Entregas / Tag da Capa"
          />
        ) : (
          <span className="text-right truncate max-w-[80%]" title={item.deliv}>
            {item.deliv}
          </span>
        )}
      </div>

      {/* Title */}
      {isEditMode ? (
        <div className="mt-1.5" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={item.name}
            onChange={(e) => updateCaseField(item.slug, 'name', e.target.value)}
            className={`w-full font-disp font-bold tracking-tight leading-tight border-b-2 border-dashed px-2 py-1 focus:outline-none rounded transition-colors break-words ${
              featured
                ? 'text-2xl sm:text-4xl md:text-5xl'
                : columns === 1
                ? 'text-2xl sm:text-3xl md:text-4xl'
                : columns === 3
                ? 'text-lg sm:text-xl md:text-[24px]'
                : 'text-xl sm:text-2xl md:text-3xl'
            } ${
              dark
                ? 'text-white bg-white/10 border-[#FF4FA0] focus:bg-white/20'
                : 'text-[#0F1222] bg-white/95 border-[#2340FF] shadow-sm focus:bg-white'
            }`}
            title="Clique para editar o título do projeto"
          />
        </div>
      ) : (
        <h3
          className={`font-disp font-bold tracking-tight leading-tight mt-1.5 transition-colors break-words ${
            featured
              ? 'text-2xl sm:text-4xl md:text-5xl'
              : columns === 1
              ? 'text-2xl sm:text-3xl md:text-4xl'
              : columns === 3
              ? 'text-lg sm:text-xl md:text-[24px]'
              : 'text-xl sm:text-2xl md:text-3xl'
          } ${
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
            className={`w-full leading-snug border-2 border-dashed p-2 focus:outline-none rounded resize-y transition-colors break-words ${
              featured
                ? 'text-base sm:text-lg md:text-xl'
                : columns === 1
                ? 'text-base sm:text-lg md:text-xl'
                : columns === 3
                ? 'text-xs sm:text-sm md:text-base'
                : 'text-sm sm:text-base md:text-lg'
            } ${
              bonus
                ? 'text-[#0F1222] bg-white/90 border-[#0F1222] focus:bg-white'
                : dark
                ? 'text-white bg-white/10 border-[#FF4FA0] focus:bg-white/20'
                : 'text-[#0F1222] bg-white/95 border-[#2340FF] shadow-sm focus:bg-white'
            }`}
            title="Clique para editar o conceito do projeto"
          />
        </div>
      ) : (
        <p
          className={`leading-snug mt-2 break-words ${
            featured
              ? 'text-base sm:text-lg md:text-xl'
              : columns === 1
              ? 'text-base sm:text-lg md:text-xl'
              : columns === 3
              ? 'text-xs sm:text-sm md:text-base'
              : 'text-sm sm:text-base md:text-lg'
          } ${
            bonus ? 'text-[#1D2611]' : dark ? 'text-[#D5DBF5]' : 'text-[#343848]'
          }`}
        >
          {item.concept}
        </p>
      )}
    </div>
  );
};
