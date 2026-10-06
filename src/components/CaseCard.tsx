import React, { useState, useRef } from 'react';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Edit3,
  Upload,
  Loader2,
  Trash2,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
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

const FORMAT_CLASS_MAP: Record<string, string> = {
  original: 'aspect-[16/9]',
  square: 'aspect-square',
  quadrado: 'aspect-square',
  vertical: 'aspect-[4/5]',
  horizontal: 'aspect-[21/9]',
};

export const CaseCard: React.FC<CaseCardProps> = ({
  item,
  onSelect,
  dark = false,
  bonus = false,
  featured = true,
  positionIndex,
  columns = 2,
}) => {
  const { isEditMode, reorderCases, moveCaseOrder, updateCaseField, updateCaseGridSpan, deleteCase, addCase } = useCms();
  const isLadoA = item.lado === 'A';
  const currentSpan: GridSpanType = item.gridSpan || (featured ? 'full' : 'half');
  const isFullWidth = currentSpan === 'full';

  const currentFormat = (item.coverFormat || item.cardRatio || item.format || item.aspectRatio || 'original').toLowerCase();
  const coverAspectClass = FORMAT_CLASS_MAP[currentFormat] || 'aspect-[16/9]';

  const currentAlign: 'left' | 'center' | 'right' = item.textAlign || item.cardAlign || 'left';
  const textAlignClass = currentAlign === 'center' ? 'text-center' : currentAlign === 'right' ? 'text-right' : 'text-left';
  const alignContainerClass = currentAlign === 'center' ? 'items-center text-center mx-auto' : currentAlign === 'right' ? 'items-end text-right ml-auto' : 'items-start text-left';

  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [coverInput, setCoverInput] = useState(item.cover);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handleCardClick = () => {
    if (isEditMode) return;
    onSelect(item);
  };

  const bgFrameClass = bonus
    ? 'bg-[#D4FF3A]'
    : isLadoA
    ? 'bg-[#2340FF]'
    : 'bg-[#FF4FA0]';

  // Função para criar um novo projeto rapidamente a partir deste card (modo edição)
  const handleQuickAddProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!addCase) return;
    
    const newSlug = `projeto-${Date.now()}`;
    const newProject: CaseItem = {
      slug: newSlug,
      name: 'Novo Projeto',
      faixa: item.faixa || 'NOVO',
      concept: 'Escreva aqui o conceito criativo do projeto...',
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      deliv: '2026',
      lado: item.lado || 'A',
      gridSpan: 'half',
      coverFormat: 'original',
      text: ['Escreva aqui o conceito do projeto...'],
      imgs: [],
      yt: [],
    };

    addCase(newProject);
  };

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
      className={`group relative text-left transition-all duration-300 w-full mb-3 sm:mb-4 block ${
        isEditMode ? 'cursor-grab active:cursor-grabbing ring-2 ring-dashed ring-white' : 'cursor-pointer'
      } ${isDragging ? 'opacity-30 scale-[0.98]' : isDragOver ? 'ring-4 ring-white scale-[1.01]' : ''}`}
      role="button"
      tabIndex={0}
    >
      {/* Drop Target Highlight */}
      {isEditMode && isDragOver && (
        <div className="pointer-events-none absolute inset-0 z-30 ring-4 ring-white bg-black/40 backdrop-blur-[1px] flex items-center justify-center transition-all animate-pulse">
          <span className="px-4 py-2 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider shadow-2xl">
            Soltar aqui para posicionar
          </span>
        </div>
      )}

      {/* Barra de Controlo CMS (Modo Edição) */}
      {isEditMode && (
        <div 
          className="cms-control flex flex-wrap items-center justify-between gap-2 mb-2 p-2 bg-black/90 text-white select-none z-30 relative rounded-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono font-bold bg-[#2340FF] text-white">
              <GripVertical className="w-3 h-3" />
              <span>ARRASTE</span>
            </div>

            {positionIndex !== undefined && (
              <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 bg-white/10 text-white">
                #{String(positionIndex).padStart(2, '0')}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* Largura Toggle */}
            <div className="flex items-center gap-0.5 bg-white/10 p-0.5 text-[11px] font-mono">
              {(['full', 'half', 'third'] as const).map((span) => (
                <button
                  key={span}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateCaseGridSpan(item.slug, span);
                  }}
                  className={`px-1.5 py-0.5 text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    currentSpan === span ? 'bg-[#D4FF3A] text-black font-black' : 'text-white/70 hover:bg-white/20'
                  }`}
                >
                  {span === 'full' ? '100%' : span === 'half' ? '50%' : '33%'}
                </button>
              ))}
            </div>

            {/* Proporção Toggle */}
            <div className="flex items-center gap-0.5 bg-white/10 p-0.5 text-[11px] font-mono">
              {[
                { id: 'original', label: 'Orig' },
                { id: 'square', label: 'Quad' },
                { id: 'vertical', label: 'Vert' },
                { id: 'horizontal', label: 'Horiz' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateCaseField(item.slug, 'coverFormat', fmt.id);
                  }}
                  className={`px-1.5 py-0.5 text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    currentFormat === fmt.id ? 'bg-[#D4FF3A] text-black font-black' : 'text-white/70 hover:bg-white/20'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            {/* Alinhamento Toggle (Esquerda, Centro, Direita) */}
            <div className="flex items-center gap-0.5 bg-white/10 p-0.5 text-[11px] font-mono">
              {[
                { id: 'left' as const, label: 'Esq', icon: AlignLeft, title: 'Alinhar à Esquerda' },
                { id: 'center' as const, label: 'Centro', icon: AlignCenter, title: 'Alinhar ao Centro' },
                { id: 'right' as const, label: 'Dir', icon: AlignRight, title: 'Alinhar à Direita' },
              ].map((al) => {
                const Icon = al.icon;
                const isActive = currentAlign === al.id;
                return (
                  <button
                    key={al.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateCaseField(item.slug, 'textAlign', al.id);
                    }}
                    className={`px-1.5 py-0.5 text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center gap-0.5 ${
                      isActive ? 'bg-[#D4FF3A] text-black font-black' : 'text-white/70 hover:bg-white/20'
                    }`}
                    title={al.title}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{al.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                moveCaseOrder(item.slug, 'up');
              }}
              className="p-1 bg-white/10 text-white cursor-pointer"
              title="Mover para cima"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                moveCaseOrder(item.slug, 'down');
              }}
              className="p-1 bg-white/10 text-white cursor-pointer"
              title="Mover para baixo"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingCover(!isEditingCover);
              }}
              className="px-2 py-1 bg-white/10 text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#D4FF3A]" />
              <span>Capa</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item);
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#2340FF] text-white text-xs font-mono font-semibold cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Peças
            </button>

            {/* BOTÃO ADICIONAR NOVO PROJETO (Direto na barra do card) */}
            <button
              type="button"
              onClick={handleQuickAddProject}
              className="p-1.5 bg-[#D4FF3A] hover:bg-lime-300 text-black cursor-pointer transition-colors"
              title="Adicionar novo projeto"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* BOTÃO EXCLUIR PROJETO */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Tem a certeza de que deseja eliminar o projeto "${item.name}"?`)) {
                  deleteCase(item.slug);
                }
              }}
              className="p-1.5 bg-red-600/80 hover:bg-red-600 text-white cursor-pointer transition-colors"
              title="Eliminar projeto"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Cover Dropdown */}
      {isEditMode && isEditingCover && (
        <div
          className="cms-control mb-2 p-3 bg-black/95 text-white space-y-2 z-30 relative rounded-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white">
              Alterar Capa do Projeto
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingCover(false);
              }}
              className="text-xs text-gray-400 hover:text-red-400 font-mono"
            >
              Fechar
            </button>
          </div>

          <div className="flex flex-wrap gap-2 items-center" onClick={(e) => e.stopPropagation()}>
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
              onClick={(e) => {
                e.stopPropagation();
                coverFileInputRef.current?.click();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2340FF] text-white text-xs font-mono font-bold cursor-pointer disabled:opacity-50"
            >
              {isUploadingCover ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> A processar...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" /> Fazer Upload
                </>
              )}
            </button>

            <span className="text-xs font-mono text-gray-400">ou</span>

            <input
              type="text"
              value={coverInput}
              onChange={(e) => setCoverInput(e.target.value)}
              placeholder="Cole o URL da capa..."
              className="w-full sm:flex-1 sm:min-w-0 px-2.5 py-1.5 text-xs font-mono bg-black text-white rounded-none"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                updateCaseField(item.slug, 'cover', coverInput);
                setIsEditingCover(false);
              }}
              className="px-3 py-1.5 bg-white/20 text-white text-xs font-mono font-bold cursor-pointer rounded-none"
            >
              Salvar Link
            </button>
          </div>
        </div>
      )}

      {/* Container do Card (Efeito Lzinho) */}
      <div className="relative w-full">
        <div className={`absolute inset-0 translate-x-1.5 sm:translate-x-2 translate-y-1.5 sm:translate-y-2 ${bgFrameClass} pointer-events-none rounded-none`} />

        <div className={`relative z-10 bg-[#1a1e36] overflow-hidden w-full ${coverAspectClass} flex flex-col justify-between p-4 sm:p-6 rounded-none border border-black/30 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-300`}>
          <img
            src={item.cover}
            alt={`Capa do case ${item.name}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] z-0"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />

          <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20" onClick={(e) => e.stopPropagation()}>
            {isEditMode ? (
              <input
                type="text"
                value={item.deliv}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateCaseField(item.slug, 'deliv', e.target.value)}
                className="bg-black/80 text-white px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider focus:outline-none text-right rounded-none shadow border border-white/20"
              />
            ) : (
              <span className="text-white text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] select-none">
                {item.deliv}
              </span>
            )}
          </div>

          <div className="relative z-20 w-full" />

          <div className={`relative z-20 mt-auto flex flex-col ${alignContainerClass} w-full gap-1.5 max-w-[85%]`} onClick={(e) => { if (isEditMode) e.stopPropagation(); }}>
            {isEditMode ? (
              <input
                type="text"
                value={item.faixa}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateCaseField(item.slug, 'faixa', e.target.value)}
                className={`bg-black/60 backdrop-blur-sm text-[#D4FF3A] px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider focus:outline-none w-28 rounded-none shadow ${textAlignClass}`}
              />
            ) : (
              <span className={`bg-black/60 backdrop-blur-sm text-[#D4FF3A] px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider shadow ${textAlignClass}`}>
                {item.faixa}
              </span>
            )}

            {isEditMode ? (
              <input
                type="text"
                value={item.name}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateCaseField(item.slug, 'name', e.target.value)}
                className={`w-full bg-black/30 backdrop-blur-[2px] text-white font-disp font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl px-2 py-1 focus:outline-none rounded-none border border-white/20 ${textAlignClass}`}
              />
            ) : (
              <h3 className={`font-disp font-bold tracking-tight leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] w-full ${
                isFullWidth ? 'text-3xl sm:text-4xl md:text-[40px]' : 'text-2xl sm:text-3xl'
              } ${textAlignClass}`}>
                {item.name}
              </h3>
            )}

            {isEditMode ? (
              <textarea
                value={item.concept}
                rows={2}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateCaseField(item.slug, 'concept', e.target.value)}
                className={`w-full bg-black/30 backdrop-blur-[2px] text-white/95 text-xs sm:text-sm p-1.5 focus:outline-none resize-none rounded-none border border-white/20 ${textAlignClass}`}
              />
            ) : (
              <p className={`text-white/90 text-xs sm:text-sm font-sans drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] line-clamp-2 w-full ${textAlignClass}`}>
                {item.concept}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseCard;