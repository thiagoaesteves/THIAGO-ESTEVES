import React, { useState, useRef } from 'react';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Edit3,
  Upload,
  Loader2,
  Maximize2,
  Columns,
} from 'lucide-react';
import { CaseItem, GridSpanType } from '../types';
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
  const { isEditMode, reorderCases, moveCaseOrder, updateCaseField, updateCaseGridSpan } = useCms();
  const currentSpan: GridSpanType = item.gridSpan || (featured ? 'full' : 'half');
  const currentFormat = item.format || 'landscape'; // 'landscape' | 'square' | 'vertical'

  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [coverInput, setCoverInput] = useState(item.cover);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handleCardClick = (e: React.MouseEvent) => {
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

  // Mapeamento dinâmico de proporção da imagem mantendo o design original
  const formatAspectClass = 
    currentFormat === 'square' ? 'aspect-square' :
    currentFormat === 'vertical' ? 'aspect-[4/5]' : 
    'aspect-[16/10] sm:aspect-[16/9]';

  return (
    <div
      id={`card-${item.slug}`}
      draggable={isEditMode}
      onDragStart={(e) => {
        if (!isEditMode) return;
        const target = e.target as HTMLElement;
        if (target.closest('input') || target.closest('textarea') || target.closest('button')) {
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
      className={`group relative text-left transition-all duration-300 rounded-none overflow-hidden p-0 ${
        isEditMode ? 'cursor-grab active:cursor-grabbing border-2' : 'cursor-pointer'
      } ${
        isDragging
          ? 'opacity-30 scale-[0.98] border-dashed border-[#2340FF]'
          : isDragOver
          ? 'ring-4 ring-[#2340FF] bg-[#2340FF]/15 scale-[1.01] shadow-2xl'
          : bonus
          ? 'bg-[#0F1222] text-white border-2 border-[#0F1222] shadow-[6px_6px_0px_0px_#D4FF3A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#D4FF3A]'
          : dark
          ? 'bg-[#14182E] text-white border-2 border-white/20 shadow-[6px_6px_0px_0px_#FF4FA0] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#FF4FA0]'
          : 'bg-[#0F1222] text-white border-2 border-[#0F1222] shadow-[6px_6px_0px_0px_#2340FF] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#2340FF]'
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
      {/* Drop Target Overlay */}
      {isEditMode && isDragOver && (
        <div className="pointer-events-none absolute inset-0 z-30 ring-4 ring-[#2340FF] bg-[#2340FF]/20 backdrop-blur-[1px] flex items-center justify-center transition-all animate-pulse">
          <span className="px-4 py-2 bg-[#2340FF] text-white font-mono-code font-bold text-xs uppercase tracking-wider shadow-2xl">
            Soltar aqui para posicionar
          </span>
        </div>
      )}

      {/* CMS Bar: Controle Completo de Grid (1, 2 ou 3 projetos por linha) & Formatos */}
      {isEditMode && (
        <div className="cms-control bg-[#181C32] text-white p-3 border-b border-white/25 flex flex-wrap items-center justify-between gap-2 select-none z-30 relative shadow-xl">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code font-bold bg-[#2340FF]/20 text-[#D4FF3A] border border-[#2340FF]/40 rounded-none">
              <GripVertical className="w-3.5 h-3.5" />
              <span>#{positionIndex !== undefined ? String(positionIndex).padStart(2, '0') : '00'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            
            {/* SELETOR DE COLUNAS / LARGURA NO GRID */}
            <div className="flex items-center gap-0.5 p-0.5 border border-white/20 bg-black/50 text-[11px] font-mono-code rounded-none">
              <span className="text-[10px] px-1 font-bold uppercase text-[#AFC0FF] hidden xs:inline">Linha:</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); updateCaseGridSpan(item.slug, 'full'); }}
                className={`px-2 py-0.5 text-[11px] font-bold transition-all cursor-pointer rounded-none ${
                  currentSpan === 'full' ? 'bg-[#D4FF3A] text-[#0F1222] font-black shadow' : 'text-white/80 hover:bg-white/10'
                }`}
                title="1 Projeto na linha (Largura Total 100%)"
              >
                1 por linha
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); updateCaseGridSpan(item.slug, 'half'); }}
                className={`px-2 py-0.5 text-[11px] font-bold transition-all cursor-pointer rounded-none ${
                  currentSpan === 'half' ? 'bg-[#D4FF3A] text-[#0F1222] font-black shadow' : 'text-white/80 hover:bg-white/10'
                }`}
                title="2 Projetos na linha (50% cada)"
              >
                2 por linha
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); updateCaseGridSpan(item.slug, 'third'); }}
                className={`px-2 py-0.5 text-[11px] font-bold transition-all cursor-pointer rounded-none ${
                  currentSpan === 'third' ? 'bg-[#D4FF3A] text-[#0F1222] font-black shadow' : 'text-white/80 hover:bg-white/10'
                }`}
                title="3 Projetos na linha (Grid Artístico)"
              >
                3 por linha
              </button>
            </div>

            {/* SETAS DE ORDEM */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); moveCaseOrder(item.slug, 'up'); }}
                className="p-1 border border-white/20 bg-white/10 hover:bg-white/20 rounded-none cursor-pointer"
                title="Mover para cima"
              >
                <ChevronUp className="w-3.5 h-3.5 text-white" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); moveCaseOrder(item.slug, 'down'); }}
                className="p-1 border border-white/20 bg-white/10 hover:bg-white/20 rounded-none cursor-pointer"
                title="Mover para baixo"
              >
                <ChevronDown className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* BOTÃO DE CAPA */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsEditingCover(!isEditingCover); }}
              className="px-2.5 py-1 text-xs font-mono-code font-bold flex items-center gap-1 border border-white/20 bg-white/10 hover:bg-white/20 rounded-none cursor-pointer text-white"
            >
              <Upload className="w-3.5 h-3.5 text-[#D4FF3A]" /> Capa
            </button>

            {/* BOTÃO EDITAR PEÇAS */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSelect(item); }}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#2340FF] text-white hover:bg-[#1B34D6] text-xs font-mono-code font-semibold rounded-none cursor-pointer border border-white/20"
            >
              <Edit3 className="w-3 h-3" /> Peças
            </button>
          </div>
        </div>
      )}

      {/* Edit Cover Dropdown */}
      {isEditMode && isEditingCover && (
        <div
          className="cms-control p-3 border-2 border-white bg-[#0F1222] text-white space-y-2 rounded-none z-30 relative shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code font-bold text-[#D4FF3A]">Alterar Imagem de Capa</span>
            <button type="button" onClick={() => setIsEditingCover(false)} className="text-xs text-gray-400 hover:text-red-400 cursor-pointer">Fechar</button>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
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
                }
              }}
            />
            <button
              type="button"
              disabled={isUploadingCover}
              onClick={() => coverFileInputRef.current?.click()}
              className="px-3 py-1.5 bg-[#2340FF] text-white text-xs font-mono-code font-bold rounded-none cursor-pointer"
            >
              {isUploadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Fazer Upload'}
            </button>
            <input
              type="text"
              value={coverInput}
              onChange={(e) => setCoverInput(e.target.value)}
              placeholder="Cole a URL..."
              className="flex-1 px-2.5 py-1.5 text-xs font-mono-code border border-white/30 bg-black text-white rounded-none"
            />
            <button
              type="button"
              onClick={() => { updateCaseField(item.slug, 'cover', coverInput); setIsEditingCover(false); }}
              className="px-3 py-1.5 text-xs font-mono-code font-bold bg-white/20 border border-white rounded-none cursor-pointer text-white"
            >
              Salvar Link
            </button>
          </div>
        </div>
      )}

      {/* Container Principal: Imagem Edge-to-Edge com Proporção Dinâmica */}
      <div className={`relative ${formatAspectClass} w-full overflow-hidden bg-black`}>
        <img
          src={item.cover}
          alt={`Capa do case ${item.name}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-[1.08]"
        />

        {/* Textura de Impressão / Ruído Serigráfico */}
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none mix-blend-overlay" />

        {/* Gradiente Escuro na Base */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        {/* Botão de Upload Rápido (Modo Edição) */}
        {isEditMode && (
          <button
            type="button"
            disabled={isUploadingCover}
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById(`cover-file-${item.slug}`)?.click();
            }}
            className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2340FF] text-white text-[11px] font-mono-code font-bold shadow-lg rounded-none cursor-pointer border border-white/20"
          >
            <Upload className="w-3.5 h-3.5 text-[#D4FF3A]" />
            <span>Trocar Imagem de Capa</span>
          </button>
        )}

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
            }
          }}
        />

        {/* Bloco de Metadados e Título */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10 flex flex-col justify-end">
          <div className="flex justify-between items-baseline gap-2 mb-2 font-mono-code text-[11px] sm:text-xs uppercase tracking-widest text-[#D4FF3A] font-bold drop-shadow">
            {isEditMode ? (
              <input
                type="text"
                value={item.faixa}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateCaseField(item.slug, 'faixa', e.target.value)}
                className="bg-black/80 text-[#D4FF3A] border-b border-dashed border-[#D4FF3A] px-1 py-0.5 text-xs w-28 rounded-none focus:outline-none"
              />
            ) : (
              <span className="bg-black/60 px-2 py-0.5 border border-white/20">{item.faixa}</span>
            )}

            {isEditMode ? (
              <input
                type="text"
                value={item.deliv}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateCaseField(item.slug, 'deliv', e.target.value)}
                className="bg-black/80 text-white text-right border-b border-dashed border-white px-2 py-0.5 text-xs flex-1 rounded-none focus:outline-none"
              />
            ) : (
              <span className="truncate max-w-[70%] bg-black/60 px-2 py-0.5 border border-white/10 text-white/90">{item.deliv}</span>
            )}
          </div>

          {isEditMode ? (
            <input
              type="text"
              value={item.name}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateCaseField(item.slug, 'name', e.target.value)}
              className="w-full font-disp font-extrabold tracking-tight text-2xl sm:text-3xl bg-black text-white border-2 border-[#D4FF3A] px-2 py-1 rounded-none focus:outline-none mb-1.5"
            />
          ) : (
            <h3 className="font-disp font-extrabold tracking-tight leading-none text-2xl sm:text-4xl text-white drop-shadow-md">
              {item.name}
            </h3>
          )}

          {isEditMode ? (
            <textarea
              value={item.concept}
              rows={2}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateCaseField(item.slug, 'concept', e.target.value)}
              className="w-full text-xs leading-snug bg-black text-white border border-white/40 p-2 rounded-none focus:outline-none resize-y mt-1"
            />
          ) : (
            <p className="font-mono-code text-xs sm:text-sm text-gray-200 leading-snug line-clamp-2 mt-1 drop-shadow opacity-95">
              {item.concept}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};