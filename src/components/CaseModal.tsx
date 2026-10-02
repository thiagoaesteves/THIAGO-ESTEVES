import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Play,
  Maximize2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Edit3,
  ExternalLink,
  FileText,
  Video,
  Image as ImageIcon,
  Columns,
  Upload,
  Loader2,
} from 'lucide-react';
import { CaseItem, CaseBlock, CaseBlockType, GridSpanType } from '../types';
import { useCms } from '../context/CmsContext';
import { processImageUpload } from '../utils/imageUpload';

interface CaseModalProps {
  item: CaseItem | null;
  onClose: () => void;
  onSelectCase: (caseItem: CaseItem) => void;
  allCases: CaseItem[];
  onOpenLightbox?: (imgUrl: string, title: string) => void;
}

// Helper to extract the src URL if user pastes a full HTML <iframe> embed code
export const extractIframeSrc = (input: string): string => {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.includes('<iframe') && trimmed.includes('src=')) {
    const match = trimmed.match(/src=["']([^"']+)["']/i) || trimmed.match(/src=([^ >]+)/i);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return trimmed;
};

// Helpers for YouTube and Vimeo video processing
const isVimeoVideo = (val: string): boolean => {
  const clean = extractIframeSrc(val);
  return clean.startsWith('vimeo:') || clean.includes('vimeo.com') || clean.includes('player.vimeo.com');
};

const getVimeoVideoId = (val: string): string => {
  const clean = extractIframeSrc(val);
  if (clean.startsWith('vimeo:')) return clean.replace('vimeo:', '').trim();
  const match = clean.match(
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+))/
  );
  if (match && match[1]) return match[1];
  if (/^\d+$/.test(clean.trim())) return clean.trim();
  return clean.trim();
};

const getYouTubeVideoId = (val: string): string => {
  const clean = extractIframeSrc(val);
  if (clean.includes('v=')) {
    return clean.split('v=')[1]?.split('&')[0] || clean;
  }
  if (clean.includes('youtu.be/')) {
    return clean.split('youtu.be/')[1]?.split('?')[0] || clean;
  }
  if (clean.includes('youtube.com/embed/')) {
    return clean.split('embed/')[1]?.split('?')[0]?.split('&')[0] || clean;
  }
  return clean.trim();
};

export const CaseModal: React.FC<CaseModalProps> = ({
  item: propItem,
  onClose,
  onSelectCase,
  allCases,
  onOpenLightbox,
}) => {
  // 1. CMS Hook
  const { isEditMode, cases, updateCaseField, updateCaseGridSpan, updateCaseBlocks } = useCms();

  // 2. Component States (All hooks strictly declared at the top before any early return)
  const [playingVideos, setPlayingVideos] = useState<Record<string, boolean>>({});
  const [draggedBlockIdx, setDraggedBlockIdx] = useState<number | null>(null);
  const [dragOverBlockIdx, setDragOverBlockIdx] = useState<number | null>(null);

  const [activeAddForm, setActiveAddForm] = useState<'youtube' | 'vimeo' | 'image' | null>(null);
  const [addInputVal, setAddInputVal] = useState('');
  const [addAspectVal, setAddAspectVal] = useState<'contain' | 'square' | 'story'>('contain');
  const [addColumnsVal, setAddColumnsVal] = useState<number>(1);
  const [addScaleVal, setAddScaleVal] = useState<'original' | 'thumb'>('original');
  const [addVideoColumnsVal, setAddVideoColumnsVal] = useState<number>(1);
  const [uploadingBlockIdx, setUploadingBlockIdx] = useState<number | null>(null);
  const [isUploadingNewImage, setIsUploadingNewImage] = useState(false);

  // 3. Safe Item Memoization
  const safeItem = useMemo(() => {
    if (!propItem) return null;
    const found = Array.isArray(cases) ? cases.find((c) => c.slug === propItem.slug) : null;
    const merged = found ? { ...propItem, ...found } : propItem;
    return {
      slug: merged.slug,
      name: merged.name || '',
      concept: merged.concept || '',
      deliv: merged.deliv || '',
      lado: merged.lado || 'A',
      faixa: merged.faixa || '',
      gridSpan: (merged.gridSpan || 'half') as GridSpanType,
      text: Array.isArray(merged.text) ? merged.text : [],
      yt: Array.isArray(merged.yt) ? merged.yt : [],
      imgs: Array.isArray(merged.imgs) ? merged.imgs : [],
      blocks: Array.isArray(merged.blocks) ? merged.blocks : undefined,
    };
  }, [propItem, cases]);

  // 4. Derive Unified Blocks
  const currentBlocks: CaseBlock[] = useMemo(() => {
    if (!safeItem) return [];
    if (safeItem.blocks && safeItem.blocks.length > 0) {
      return safeItem.blocks;
    }

    // Default vertical hashes for Unicred stories
    const verticalHashes = [
      '858fe74f', '45e9cd37', 'b667e815', '4c6c4241', 'f9aad2e1',
      '8b3edea4', '5c03df96', 'e27e2b85', 'cd607dd5', '90ea4e6c',
      '94ee3869', 'f330bc4e', 'abd1b36d', '88842ec2', 'c0ff1d86',
      'd90a0296', 'def82f52', '0f17c83c', '0ac5a8d0', 'ae165ff1'
    ];

    const list: CaseBlock[] = [];
    if (safeItem.text && safeItem.text.length > 0) {
      list.push({
        id: `text-${safeItem.slug}-unified`,
        type: 'text',
        value: safeItem.text.join('\n\n'),
      });
    }
    safeItem.yt.forEach((y, idx) => {
      list.push({
        id: `yt-${safeItem.slug}-${idx}-${y}`,
        type: 'video',
        value: y,
        aspect: 'video',
        columns: 1,
      });
    });
    safeItem.imgs.forEach((img, idx) => {
      const isLhama = safeItem.slug === 'lhama' || safeItem.slug === 'lhama-films';
      const isLhamaSquare = isLhama && idx >= 2;
      const isUnicredStory = verticalHashes.some((hash) => img.includes(hash));

      list.push({
        id: `img-${safeItem.slug}-${idx}-${img.slice(-15)}`,
        type: 'image',
        value: img,
        aspect: isLhamaSquare ? 'square' : isUnicredStory ? 'story' : 'contain',
        columns: isLhamaSquare ? 3 : isUnicredStory ? 5 : 1,
        scale: 'original',
      });
    });
    return list;
  }, [safeItem]);

  // 5. Universal Mixed Media Dynamic Grid Grouping (Allows images and videos in the same grid)
  type RenderGroup =
    | { type: 'single'; block: CaseBlock; originalIdx: number }
    | {
        type: 'grid';
        columns: number;
        items: { block: CaseBlock; originalIdx: number }[];
      };

  const renderGroups: RenderGroup[] = useMemo(() => {
    const groups: RenderGroup[] = [];
    let currentGrid: {
      columns: number;
      items: { block: CaseBlock; originalIdx: number }[];
    } | null = null;

    const flushGrid = () => {
      if (currentGrid && currentGrid.items.length > 0) {
        groups.push({
          type: 'grid',
          columns: currentGrid.columns,
          items: [...currentGrid.items],
        });
        currentGrid = null;
      }
    };

    currentBlocks.forEach((block, idx) => {
      // 1. Text blocks always render individually and break any active grid
      if (block.type === 'text') {
        flushGrid();
        groups.push({ type: 'single', block, originalIdx: idx });
        return;
      }

      // 2. Both image and video are media blocks
      let cols = 1;
      if (block.type === 'video') {
        cols = block.columns ?? 1;
      } else if (block.type === 'image') {
        const aspect = block.aspect || 'contain';
        const normalizedFormat: 'square' | 'story' | 'contain' =
          aspect === 'square' ? 'square' : aspect === 'story' ? 'story' : 'contain';
        cols = block.columns ?? (normalizedFormat === 'contain' ? 1 : 3);
      }

      // 3. Multi-column media (cols > 1): group consecutive media items (images & videos mixed together) sharing identical columns
      if (cols > 1) {
        if (currentGrid && currentGrid.columns === cols) {
          currentGrid.items.push({ block, originalIdx: idx });
        } else {
          flushGrid();
          currentGrid = {
            columns: cols,
            items: [{ block, originalIdx: idx }],
          };
        }
      } else {
        // cols === 1: Standalone media (video or image) with full editorial highlight
        flushGrid();
        groups.push({ type: 'single', block, originalIdx: idx });
      }
    });

    flushGrid();
    return groups;
  }, [currentBlocks]);

  // 6. Keyboard Navigation Effect
  useEffect(() => {
    setPlayingVideos({});

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'Escape') {
        onClose();
      }
      if (safeItem && Array.isArray(allCases) && allCases.length > 0) {
        const currentIndex = allCases.findIndex((c) => c.slug === safeItem.slug);
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          onSelectCase(allCases[currentIndex - 1]);
        } else if (e.key === 'ArrowRight' && currentIndex < allCases.length - 1) {
          onSelectCase(allCases[currentIndex + 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [safeItem, onClose, onSelectCase, allCases]);

  // 7. Body Scroll Lock Effect
  useEffect(() => {
    if (safeItem) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [safeItem]);

  // Early return ONLY after all Hooks are declared
  if (!safeItem) return null;

  const isLadoB = safeItem.lado === 'B' || safeItem.lado === 'bonus';
  const ladoLabel =
    safeItem.lado === 'A' ? 'Lado A' : safeItem.lado === 'B' ? 'Lado B' : 'Faixa Bônus';

  const currentIndex = allCases.findIndex((c) => c.slug === safeItem.slug);
  const prevCase = currentIndex > 0 ? allCases[currentIndex - 1] : allCases[allCases.length - 1];
  const nextCase = currentIndex < allCases.length - 1 ? allCases[currentIndex + 1] : allCases[0];

  const handlePlayVideo = (key: string) => {
    setPlayingVideos((prev) => ({ ...prev, [key]: true }));
  };

  // Block management actions
  const reorderBlocks = (sourceIdx: number, targetIdx: number) => {
    if (sourceIdx === targetIdx) return;
    const newBlocks = [...currentBlocks];
    const [moved] = newBlocks.splice(sourceIdx, 1);
    newBlocks.splice(targetIdx, 0, moved);
    updateCaseBlocks(safeItem.slug, newBlocks);
  };

  const moveBlock = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentBlocks.length) return;
    reorderBlocks(idx, targetIdx);
  };

  const removeBlock = (idx: number) => {
    const newBlocks = currentBlocks.filter((_, i) => i !== idx);
    updateCaseBlocks(safeItem.slug, newBlocks);
  };

  const updateBlockValue = (idx: number, value: string) => {
    const newBlocks = currentBlocks.map((b, i) => (i === idx ? { ...b, value } : b));
    updateCaseBlocks(safeItem.slug, newBlocks);
  };

  const updateBlockLayout = (idx: number, aspect: CaseBlock['aspect']) => {
    const newBlocks = currentBlocks.map((b, i) => {
      if (i !== idx) return b;
      let finalCols = b.columns;
      if (aspect === 'contain' && (!finalCols || finalCols > 3)) finalCols = 1;
      if (aspect === 'square' && (!finalCols || finalCols === 1)) finalCols = 3;
      if (aspect === 'story' && (!finalCols || finalCols === 1)) finalCols = 5;
      return {
        ...b,
        aspect,
        columns: finalCols,
      };
    });
    updateCaseBlocks(safeItem.slug, newBlocks);
  };

  const updateBlockColumns = (idx: number, columns: number) => {
    const newBlocks = currentBlocks.map((b, i) => (i === idx ? { ...b, columns } : b));
    updateCaseBlocks(safeItem.slug, newBlocks);
  };

  const updateBlockScale = (idx: number, scale: 'original' | 'thumb') => {
    const newBlocks = currentBlocks.map((b, i) => (i === idx ? { ...b, scale } : b));
    updateCaseBlocks(safeItem.slug, newBlocks);
  };

  const unifyAllTextBlocks = () => {
    const textBlocks = currentBlocks.filter((b) => b.type === 'text');
    if (textBlocks.length <= 1) return;
    const combinedText = textBlocks.map((b) => b.value).join('\n\n');
    let firstAdded = false;
    const newBlocks: CaseBlock[] = [];
    currentBlocks.forEach((b) => {
      if (b.type === 'text') {
        if (!firstAdded) {
          firstAdded = true;
          newBlocks.push({ ...b, value: combinedText });
        }
      } else {
        newBlocks.push(b);
      }
    });
    updateCaseBlocks(safeItem.slug, newBlocks);
  };

  const addBlock = (
    type: CaseBlockType,
    value: string = '',
    aspect: CaseBlock['aspect'] = 'contain',
    columns?: number,
    scale?: 'original' | 'thumb'
  ) => {
    const newBlock: CaseBlock = {
      id: `block-${type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      value: value || (type === 'text' ? 'Novo parágrafo de texto...' : ''),
      aspect: type === 'image' ? aspect : type === 'video' ? 'video' : undefined,
      columns:
        type === 'image'
          ? columns ?? (aspect === 'contain' ? 1 : aspect === 'story' ? 5 : 3)
          : type === 'video'
          ? columns ?? 1
          : undefined,
      scale: type === 'image' ? scale ?? 'original' : undefined,
    };
    updateCaseBlocks(safeItem.slug, [...currentBlocks, newBlock]);
  };

  // Helper for responsive grid columns CSS (Supports 1, 2, 3, 4, or 5 columns)
  const getGridColsClass = (cols: number = 3): string => {
    switch (cols) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      case 5:
      default:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
    }
  };

  // Render individual block card
  const renderBlockCard = (
    block: CaseBlock,
    idx: number
  ) => {
    const isImage = block.type === 'image';
    const isVideo = block.type === 'video';

    const currentAspect = block.aspect || (isVideo ? 'video' : 'contain');
    const isSquare = currentAspect === 'square';
    const isStory = currentAspect === 'story';
    const currentCols = block.columns ?? (isVideo ? 1 : currentAspect === 'contain' ? 1 : 3);
    const currentScale = block.scale || 'original';

    const isVimeo = isVideo && isVimeoVideo(block.value);
    const vimeoId = isVimeo ? getVimeoVideoId(block.value) : '';
    const youtubeId = isVideo && !isVimeo ? getYouTubeVideoId(block.value) : '';

    return (
      <div
        key={block.id || `${block.type}-${idx}`}
        draggable={isEditMode}
        onDragStart={() => setDraggedBlockIdx(idx)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOverBlockIdx(idx);
        }}
        onDragLeave={() => setDragOverBlockIdx(null)}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedBlockIdx !== null && draggedBlockIdx !== idx) {
            reorderBlocks(draggedBlockIdx, idx);
          }
          setDraggedBlockIdx(null);
          setDragOverBlockIdx(null);
        }}
        className={`relative transition-all duration-200 ${
          dragOverBlockIdx === idx ? 'ring-4 ring-[#2340FF] scale-[1.01]' : ''
        } ${
          isEditMode
            ? 'p-2.5 sm:p-3.5 rounded-xl border border-dashed border-black/20 dark:border-white/20 bg-black/[0.03] dark:bg-white/[0.03] space-y-2.5'
            : 'w-full'
        }`}
      >
        {/* Edit Mode Toolbar with Format and Column Selection Controls */}
        {isEditMode && (
          <div className="flex flex-wrap items-center justify-between gap-1.5 bg-black/85 text-white px-2.5 py-1.5 rounded-lg text-xs font-mono-code select-none border border-white/10 shadow-sm">
            <div className="flex items-center gap-1.5 cursor-grab truncate">
              <GripVertical className="w-3.5 h-3.5 text-[#D4FF3A] shrink-0" />
              <span className="inline-flex items-center gap-1 font-bold truncate">
                {block.type === 'text' && <FileText className="w-3.5 h-3.5 text-[#D4FF3A]" />}
                {isVideo && (
                  isVimeo ? (
                    <Video className="w-3.5 h-3.5 text-[#00ADEF]" />
                  ) : (
                    <Video className="w-3.5 h-3.5 text-[#FF4FA0]" />
                  )
                )}
                {isImage && <ImageIcon className="w-3.5 h-3.5 text-[#2340FF]" />}
                <span className="truncate">
                  {block.type === 'text'
                    ? 'Texto'
                    : isVideo
                    ? isVimeo
                      ? 'Vídeo (Vimeo)'
                      : 'Vídeo (YouTube)'
                    : 'Imagem'}
                </span>
              </span>
              <span className="text-white/60 text-[11px] shrink-0">
                ({idx + 1}/{currentBlocks.length})
              </span>
            </div>

            {/* Interactive Image Layout & Columns Controls */}
            {isImage && (
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                {/* Formato: Horizontal/Inteira, Quadrada, Vertical */}
                <div className="flex items-center bg-white/10 rounded p-0.5">
                  <button
                    type="button"
                    onClick={() => updateBlockLayout(idx, 'contain')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      currentAspect === 'contain'
                        ? 'bg-[#2340FF] text-white font-bold shadow-sm'
                        : 'hover:bg-white/20 text-white/70'
                    }`}
                    title="Horizontal / Inteira (largura natural)"
                  >
                    Inteira
                  </button>
                  <button
                    type="button"
                    onClick={() => updateBlockLayout(idx, 'square')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      currentAspect === 'square'
                        ? 'bg-[#2340FF] text-white font-bold shadow-sm'
                        : 'hover:bg-white/20 text-white/70'
                    }`}
                    title="Quadrada (1:1 Estilo Instagram)"
                  >
                    Quadrada
                  </button>
                  <button
                    type="button"
                    onClick={() => updateBlockLayout(idx, 'story')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      currentAspect === 'story'
                        ? 'bg-[#2340FF] text-white font-bold shadow-sm'
                        : 'hover:bg-white/20 text-white/70'
                    }`}
                    title="Vertical (Estilo Stories/Unicred)"
                  >
                    Vertical
                  </button>
                </div>

                {/* Seletor de Colunas (Até 5 para Vertical, até 4 para Quadrada, até 3 para Inteira) */}
                <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                  <span className="text-white/50 text-[10px] flex items-center gap-0.5">
                    <Columns className="w-2.5 h-2.5" /> Colunas:
                  </span>
                  {(currentAspect === 'story'
                    ? [1, 2, 3, 4, 5]
                    : currentAspect === 'square'
                    ? [1, 2, 3, 4]
                    : [1, 2, 3]
                  ).map((colNum) => (
                    <button
                      key={colNum}
                      type="button"
                      onClick={() => updateBlockColumns(idx, colNum)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono-code cursor-pointer transition-colors ${
                        currentCols === colNum
                          ? 'bg-[#D4FF3A] text-[#0F1222] font-extrabold shadow-sm'
                          : 'hover:bg-white/20 text-white/80'
                      }`}
                      title={`${colNum} coluna${colNum > 1 ? 's' : ''} por linha`}
                    >
                      {colNum}
                    </button>
                  ))}
                </div>

                {/* Seletor de Tamanho / Escala quando 1 coluna por linha */}
                {currentCols === 1 && (
                  <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                    <span className="text-white/50 text-[10px]">Tamanho:</span>
                    <button
                      type="button"
                      onClick={() => updateBlockScale(idx, 'original')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono-code cursor-pointer transition-colors ${
                        currentScale === 'original'
                          ? 'bg-[#2340FF] text-white font-bold shadow-sm'
                          : 'hover:bg-white/20 text-white/70'
                      }`}
                      title="Tamanho Original / Arte por Inteiro (max-w-4xl)"
                    >
                      Original
                    </button>
                    <button
                      type="button"
                      onClick={() => updateBlockScale(idx, 'thumb')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono-code cursor-pointer transition-colors ${
                        currentScale === 'thumb'
                          ? 'bg-[#2340FF] text-white font-bold shadow-sm'
                          : 'hover:bg-white/20 text-white/70'
                      }`}
                      title="Miniatura Centralizada (max-w-md)"
                    >
                      Miniatura
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Video Columns Controls */}
            {isVideo && (
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                  <span className="text-white/50 text-[10px] flex items-center gap-0.5">
                    <Columns className="w-2.5 h-2.5" /> Colunas:
                  </span>
                  {[1, 2, 3].map((colNum) => (
                    <button
                      key={colNum}
                      type="button"
                      onClick={() => updateBlockColumns(idx, colNum)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono-code cursor-pointer transition-colors ${
                        currentCols === colNum
                          ? 'bg-[#D4FF3A] text-[#0F1222] font-extrabold shadow-sm'
                          : 'hover:bg-white/20 text-white/80'
                      }`}
                      title={`${colNum} coluna${colNum > 1 ? 's' : ''} por linha`}
                    >
                      {colNum}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reorder and Delete Actions */}
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => moveBlock(idx, 'up')}
                className="p-1 hover:bg-white/20 rounded disabled:opacity-30 cursor-pointer"
                title="Mover para cima"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={idx === currentBlocks.length - 1}
                onClick={() => moveBlock(idx, 'down')}
                className="p-1 hover:bg-white/20 rounded disabled:opacity-30 cursor-pointer"
                title="Mover para baixo"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => removeBlock(idx)}
                className="p-1 hover:bg-red-500 rounded text-red-400 hover:text-white transition-colors cursor-pointer"
                title="Excluir este bloco"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 1. TEXT BLOCK */}
        {block.type === 'text' && (
          <div className="w-full">
            {isEditMode ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-code text-[#2340FF] dark:text-[#D4FF3A] font-bold">
                    Editor de Texto Unificado (Multilinha):
                  </span>
                  {currentBlocks.filter((b) => b.type === 'text').length > 1 && (
                    <button
                      type="button"
                      onClick={unifyAllTextBlocks}
                      className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-[#D4FF3A] text-[#0F1222] font-bold hover:bg-[#c2ed2c] transition-colors cursor-pointer"
                      title="Unificar todos os blocos de texto deste case em uma única caixa fluida"
                    >
                      Unificar Textos em 1 Caixa
                    </button>
                  )}
                </div>
                <textarea
                  value={block.value}
                  rows={Math.max(5, block.value.split('\n').length + 1)}
                  onChange={(e) => updateBlockValue(idx, e.target.value)}
                  className="w-full text-lg sm:text-xl md:text-2xl leading-relaxed bg-black/5 dark:bg-white/5 border border-dashed border-[#2340FF] dark:border-[#FF4FA0] p-4 sm:p-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2340FF] dark:focus:ring-[#FF4FA0] text-[#0F1222] dark:text-[#F6F7F2] font-normal resize-y min-h-[160px] whitespace-pre-wrap font-sans"
                  placeholder="Escreva seu texto corrido aqui. Pressione Enter para criar novos parágrafos..."
                />
                <span className="text-[11px] font-mono-code text-black/50 dark:text-white/50 block">
                  Pressione Enter para criar novos parágrafos livremente. A diagramação preserva quebras e espaçamento responsivo automaticamente.
                </span>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6 max-w-4xl">
                {block.value
                  .split(/\n\s*\n/)
                  .filter((p) => p.trim())
                  .map((para, pIdx) => (
                    <p
                      key={pIdx}
                      className={`text-base sm:text-xl md:text-2xl lg:text-[1.65rem] leading-relaxed font-normal whitespace-pre-line break-words ${
                        isLadoB ? 'text-[#D5DBF5]' : 'text-[#343848]'
                      }`}
                    >
                      {para}
                    </p>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* 2. VIDEO BLOCK (YouTube and Vimeo support) */}
        {isVideo && (
          <div className="w-full">
            {isEditMode && (
              <div className="mb-2 flex items-center gap-2">
                <input
                  type="text"
                  value={block.value}
                  onChange={(e) => {
                    const rawVal = e.target.value.trim();
                    const clean = extractIframeSrc(rawVal);
                    if (isVimeoVideo(clean)) {
                      const vid = getVimeoVideoId(clean);
                      updateBlockValue(idx, `vimeo:${vid}`);
                    } else if (clean.includes('youtube.com') || clean.includes('youtu.be')) {
                      const yid = getYouTubeVideoId(clean);
                      updateBlockValue(idx, yid);
                    } else {
                      updateBlockValue(idx, clean);
                    }
                  }}
                  placeholder="ID, link ou <iframe> do YouTube ou Vimeo..."
                  className="flex-1 px-3 py-1.5 text-xs font-mono-code rounded bg-white dark:bg-[#0F1222] border border-black/20 dark:border-white/20 text-[#0F1222] dark:text-white"
                />
                <a
                  href={
                    isVimeo
                      ? `https://vimeo.com/${vimeoId}`
                      : `https://www.youtube.com/watch?v=${youtubeId}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs font-mono-code flex items-center gap-1"
                  title={isVimeo ? 'Abrir no Vimeo' : 'Abrir no YouTube'}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-xl border border-black/10">
              {playingVideos[block.value] ? (
                isVimeo ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
                    title="Vídeo Vimeo do case"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                    title="Vídeo YouTube do case"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )
              ) : isVimeo ? (
                /* Vimeo Poster / Play Trigger */
                <div
                  onClick={() => handlePlayVideo(block.value)}
                  className="relative w-full h-full cursor-pointer group/vid bg-[#001726] flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={`https://vumbnail.com/${vimeoId}.jpg`}
                    alt="Miniatura do vídeo Vimeo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover/vid:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#00ADEF] group-hover/vid:scale-110 transition-transform flex items-center justify-center text-white shadow-2xl">
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                    </div>
                  </div>
                  <span
                    className={`faixa-clip absolute left-6 bottom-6 text-base sm:text-lg font-bold shadow-md flex items-center gap-2 transform group-hover/vid:scale-105 transition-transform ${
                      isLadoB ? 'bg-[#FF4FA0] text-white' : 'bg-[#00ADEF] text-white'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Dá o play (Vimeo)
                  </span>
                  <a
                    href={`https://vimeo.com/${vimeoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 bg-black/70 hover:bg-black text-white text-[11px] font-mono-code rounded backdrop-blur-sm border border-white/20 transition-all flex items-center gap-1.5 opacity-0 group-hover/vid:opacity-100 shadow-md"
                  >
                    <span>Abrir no Vimeo</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#00ADEF]" />
                  </a>
                </div>
              ) : (
                /* YouTube Poster / Play Trigger */
                <div
                  onClick={() => handlePlayVideo(block.value)}
                  className="relative w-full h-full cursor-pointer group/vid"
                >
                  <img
                    src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                    alt="Miniatura do vídeo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover/vid:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2340FF] group-hover/vid:scale-110 transition-transform flex items-center justify-center text-white shadow-2xl">
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                    </div>
                  </div>
                  <span
                    className={`faixa-clip absolute left-6 bottom-6 text-base sm:text-lg font-bold shadow-md flex items-center gap-2 transform group-hover/vid:scale-105 transition-transform ${
                      isLadoB ? 'bg-[#FF4FA0] text-white' : 'bg-[#D4FF3A] text-[#0F1222]'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Dá o play
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 bg-black/70 hover:bg-black text-white text-[11px] font-mono-code rounded backdrop-blur-sm border border-white/20 transition-all flex items-center gap-1.5 opacity-0 group-hover/vid:opacity-100 shadow-md"
                  >
                    <span>Abrir no YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D4FF3A]" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. IMAGE BLOCK */}
        {isImage && (
          <div
            className={
              currentCols === 1
                ? currentScale === 'thumb'
                  ? 'w-full max-w-md sm:max-w-lg mx-auto'
                  : 'w-full max-w-4xl mx-auto'
                : 'w-full'
            }
          >
            {isEditMode && (
              <div className="mb-2 flex flex-wrap items-center gap-2 bg-black/5 dark:bg-white/5 p-2 rounded-lg border border-dashed border-black/15 dark:border-white/15">
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2340FF] hover:bg-[#1B34D6] text-white text-[11px] font-mono-code font-bold cursor-pointer transition-colors shadow-sm">
                  {uploadingBlockIdx === idx ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4FF3A]" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-[#D4FF3A]" />
                  )}
                  <span>{uploadingBlockIdx === idx ? 'Convertendo...' : 'Substituir do Computador'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingBlockIdx === idx}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingBlockIdx(idx);
                      try {
                        const base64 = await processImageUpload(file, 2048, 2048, 0.88);
                        updateBlockValue(idx, base64);
                      } catch (err) {
                        console.error('Erro ao converter imagem:', err);
                        alert('Erro ao processar imagem do computador. Tente outro arquivo.');
                      } finally {
                        setUploadingBlockIdx(null);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
                <span className="text-[11px] font-mono-code text-gray-500">ou URL:</span>
                <input
                  type="text"
                  value={block.value.startsWith('data:') ? '[Imagem Base64 salva localmente]' : block.value}
                  onChange={(e) => updateBlockValue(idx, e.target.value.trim())}
                  placeholder="URL direta da imagem..."
                  className="flex-1 min-w-[200px] px-2.5 py-1 text-xs font-mono-code rounded bg-white dark:bg-[#0F1222] border border-black/20 dark:border-white/20 text-[#0F1222] dark:text-white"
                />
              </div>
            )}

            <div
              className={`relative rounded-lg overflow-hidden border border-black/10 dark:border-white/10 shadow-lg group/img bg-[#E4E6EA]/50 dark:bg-[#151928]/50 ${
                currentCols === 1 && currentScale === 'thumb' ? 'mx-auto' : ''
              }`}
            >
              <img
                src={block.value}
                alt={`Peça ${idx + 1} de ${safeItem.name}`}
                loading="lazy"
                referrerPolicy="no-referrer"
                className={`w-full cursor-pointer ${
                  currentCols === 1
                    ? currentScale === 'thumb'
                      ? 'w-full h-auto object-contain max-w-md sm:max-w-lg mx-auto block'
                      : 'w-full h-auto object-contain max-w-4xl mx-auto block'
                    : isSquare
                    ? 'aspect-square object-cover block'
                    : isStory
                    ? 'aspect-[9/16] object-cover block'
                    : 'w-full h-auto object-contain block mx-auto'
                }`}
                onClick={() =>
                  !isEditMode &&
                  onOpenLightbox &&
                  onOpenLightbox(block.value, `${safeItem.name} - Peça ${idx + 1}`)
                }
              />

              {!isEditMode && onOpenLightbox && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenLightbox(block.value, `${safeItem.name} - Peça ${idx + 1}`)
                  }
                  className="absolute top-3 right-3 p-2.5 rounded bg-[#0F1222]/80 hover:bg-[#0F1222] text-white hover:text-[#D4FF3A] opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer shadow-md"
                  title="Ampliar imagem em tela cheia"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      id="case-modal-fullscreen"
      className={`fixed inset-0 z-50 w-full h-full overflow-y-auto ${
        isLadoB ? 'bg-[#0F1222] text-[#F6F7F2]' : 'bg-[#F6F7F2] text-[#0F1222]'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-modal-title"
    >
      <div
        className={`w-full min-h-full flex flex-col ${
          isLadoB ? 'bg-[#0F1222] text-[#F6F7F2]' : 'bg-[#F6F7F2] text-[#0F1222]'
        }`}
      >
        {/* Top Sticky Header */}
        <header
          className={`sticky top-0 z-30 w-full border-b backdrop-blur-md transition-colors ${
            isLadoB
              ? 'bg-[#0F1222]/95 border-white/10 text-[#F6F7F2]'
              : 'bg-[#F6F7F2]/95 border-black/10 text-[#0F1222]'
          }`}
        >
          <div className="max-w-[1240px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`font-mono-code text-xs sm:text-sm uppercase tracking-widest font-semibold ${
                  isLadoB ? 'text-[#AFC0FF]' : 'text-[#5B6070]'
                }`}
              >
                {ladoLabel} · {safeItem.faixa}
              </span>

              {isEditMode && (
                <span className="px-2 py-0.5 rounded bg-[#2340FF] text-white text-[11px] font-mono-code font-bold uppercase tracking-wider">
                  Edição Ativa
                </span>
              )}
            </div>

            <button
              id="btn-close-case-modal"
              type="button"
              onClick={onClose}
              className={`font-mono-code text-xs sm:text-sm uppercase tracking-widest font-bold pb-0.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer min-h-[44px] ${
                isLadoB
                  ? 'border-[#FF4FA0] text-white hover:text-[#FF4FA0]'
                  : 'border-[#2340FF] text-[#0F1222] hover:text-[#2340FF]'
              }`}
            >
              <span>Fechar</span>
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </header>

        {/* Modal Main Content */}
        <main className="flex-1 w-full max-w-[1240px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 md:py-14">
          {/* Header Section */}
          <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10 max-w-4xl">
            <div>
              {isEditMode ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={safeItem.name}
                    onChange={(e) => updateCaseField(safeItem.slug, 'name', e.target.value)}
                    className={`faixa-clip text-sm sm:text-base font-bold border-2 border-white/40 px-2 py-1 focus:outline-none ${
                      isLadoB ? 'bg-[#FF4FA0] text-white' : 'bg-[#2340FF] text-[#F6F7F2]'
                    }`}
                  />
                  <span className="text-xs font-mono-code text-[#AFC0FF] flex items-center gap-1">
                    <Edit3 className="w-3 h-3" /> Clique para editar
                  </span>
                </div>
              ) : (
                <span
                  className={`faixa-clip text-sm sm:text-base font-bold inline-block ${
                    isLadoB ? 'bg-[#FF4FA0] text-white' : 'bg-[#2340FF] text-[#F6F7F2]'
                  }`}
                >
                  {safeItem.name}
                </span>
              )}
            </div>

            {isEditMode ? (
              <textarea
                value={safeItem.concept}
                rows={2}
                onChange={(e) => updateCaseField(safeItem.slug, 'concept', e.target.value)}
                className="w-full font-disp font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[0.98] bg-transparent border-2 border-dashed border-[#2340FF] dark:border-[#FF4FA0] p-2 rounded focus:outline-none focus:bg-black/5 dark:focus:bg-white/5 break-words"
              />
            ) : (
              <h2
                id="case-modal-title"
                className="font-disp font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[1.02] text-balance break-words"
              >
                {safeItem.concept}
              </h2>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {isEditMode ? (
                <input
                  type="text"
                  value={safeItem.deliv}
                  onChange={(e) => updateCaseField(safeItem.slug, 'deliv', e.target.value)}
                  className={`font-mono-code text-xs sm:text-sm uppercase tracking-wider py-1.5 px-3 rounded border border-dashed border-[#2340FF] dark:border-[#FF4FA0] ${
                    isLadoB ? 'bg-white/10 text-[#AFC0FF]' : 'bg-black/5 text-[#5B6070]'
                  }`}
                />
              ) : (
                <span
                  className={`font-mono-code text-xs sm:text-sm uppercase tracking-wider py-1.5 px-3 rounded inline-block ${
                    isLadoB ? 'bg-white/10 text-[#AFC0FF]' : 'bg-black/5 text-[#5B6070]'
                  }`}
                >
                  {safeItem.deliv}
                </span>
              )}

              {isEditMode && (
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border border-dashed border-[#2340FF] dark:border-[#D4FF3A] bg-black/5 dark:bg-white/5 font-mono-code text-xs">
                  <span className="text-[10px] text-gray-500 dark:text-[#AFC0FF] px-1 font-bold uppercase">
                    Formato no Grid:
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCaseGridSpan(safeItem.slug, 'full')}
                    className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                      (safeItem.gridSpan || 'half') === 'full'
                        ? 'bg-[#D4FF3A] text-[#0F1222] shadow font-black'
                        : 'text-gray-700 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                    title="Destaque: O projeto ocupa 100% da largura da linha (Full)"
                  >
                    Full (100%)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateCaseGridSpan(safeItem.slug, 'half')}
                    className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                      (safeItem.gridSpan || 'half') === 'half'
                        ? 'bg-[#D4FF3A] text-[#0F1222] shadow font-black'
                        : 'text-gray-700 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                    title="Médio: O projeto ocupa 50% da largura da linha (Metade)"
                  >
                    Médio (50%)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateCaseGridSpan(safeItem.slug, 'third')}
                    className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                      (safeItem.gridSpan || 'half') === 'third'
                        ? 'bg-[#D4FF3A] text-[#0F1222] shadow font-black'
                        : 'text-gray-700 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                    title="Compacto: O projeto ocupa 33% da largura da linha (Terço)"
                  >
                    Compacto (33%)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Universal Content Flow with Interactive Grid Groups */}
          <div className="space-y-8 sm:space-y-12 mb-16 max-w-5xl">
            {renderGroups.map((group, gIdx) => {
               if (group.type === 'single') {
                 return (
                   <div key={`group-single-${gIdx}`} className="w-full">
                     {renderBlockCard(group.block, group.originalIdx)}
                   </div>
                 );
               }

               if (group.type === 'grid') {
                 const colsClass = getGridColsClass(group.columns);
                 return (
                   <div
                     key={`group-grid-${gIdx}`}
                     className={`grid ${colsClass} gap-3 sm:gap-4 items-start w-full`}
                   >
                     {group.items.map(({ block, originalIdx }) =>
                       renderBlockCard(block, originalIdx)
                     )}
                   </div>
                 );
               }

               return null;
             })}
          </div>

          {/* Add Block Toolbar in Edit Mode */}
          {isEditMode && (
            <div className="p-4 sm:p-5 rounded-xl border border-dashed border-[#2340FF] dark:border-[#D4FF3A] bg-[#2340FF]/5 dark:bg-[#D4FF3A]/5 max-w-4xl space-y-4 mb-16">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#2340FF] dark:text-[#D4FF3A] flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Adicionar Bloco de Conteúdo
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addBlock('text', 'Novo parágrafo de texto...')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2340FF] hover:bg-[#1B34D6] text-white text-xs font-mono-code font-bold cursor-pointer transition-colors shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" /> + Texto
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAddForm(activeAddForm === 'youtube' ? null : 'youtube');
                      setAddInputVal('');
                      setAddVideoColumnsVal(1);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold cursor-pointer transition-colors shadow-sm ${
                      activeAddForm === 'youtube'
                        ? 'bg-[#FF4FA0] text-white'
                        : 'bg-black/10 dark:bg-white/10 hover:bg-black/20 text-[#0F1222] dark:text-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" /> + Vídeo YouTube
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAddForm(activeAddForm === 'vimeo' ? null : 'vimeo');
                      setAddInputVal('');
                      setAddVideoColumnsVal(1);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold cursor-pointer transition-colors shadow-sm ${
                      activeAddForm === 'vimeo'
                        ? 'bg-[#00ADEF] text-white'
                        : 'bg-black/10 dark:bg-white/10 hover:bg-black/20 text-[#0F1222] dark:text-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" /> + Vídeo Vimeo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAddForm(activeAddForm === 'image' ? null : 'image');
                      setAddInputVal('');
                      setAddScaleVal('original');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold cursor-pointer transition-colors shadow-sm ${
                      activeAddForm === 'image'
                        ? 'bg-[#2340FF] text-white'
                        : 'bg-black/10 dark:bg-white/10 hover:bg-black/20 text-[#0F1222] dark:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> + Imagem
                  </button>
                </div>
              </div>

              {/* Form: Inserir Vídeo YouTube */}
              {activeAddForm === 'youtube' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (addInputVal.trim()) {
                      const clean = extractIframeSrc(addInputVal.trim());
                      if (isVimeoVideo(clean)) {
                        const vid = getVimeoVideoId(clean);
                        addBlock('video', `vimeo:${vid}`, undefined, addVideoColumnsVal);
                      } else {
                        const yid = getYouTubeVideoId(clean);
                        addBlock('video', yid, undefined, addVideoColumnsVal);
                      }
                      setAddInputVal('');
                      setActiveAddForm(null);
                    }
                  }}
                  className="space-y-2.5 pt-2 border-t border-black/10 dark:border-white/10"
                >
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={addInputVal}
                      onChange={(e) => setAddInputVal(e.target.value)}
                      placeholder="Cole o link, ID ou código <iframe> do YouTube..."
                      className="w-full sm:flex-1 min-w-0 px-3 py-1.5 text-xs font-mono-code rounded bg-white dark:bg-[#0F1222] border border-black/20 dark:border-white/20 text-[#0F1222] dark:text-white"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#FF4FA0] hover:bg-[#e03f8a] text-white text-xs font-mono-code font-bold rounded cursor-pointer transition-colors"
                    >
                      Inserir YouTube
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveAddForm(null)}
                      className="px-3 py-1.5 bg-gray-500/20 text-xs font-mono-code rounded cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono-code">
                    <span className="text-gray-500">Colunas:</span>
                    {[1, 2, 3].map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => setAddVideoColumnsVal(cols)}
                        className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                          addVideoColumnsVal === cols
                            ? 'bg-[#FF4FA0] text-white font-bold'
                            : 'bg-black/10 dark:bg-white/10 hover:bg-black/20'
                        }`}
                      >
                        {cols}
                      </button>
                    ))}
                  </div>
                </form>
              )}

              {/* Form: Inserir Vídeo Vimeo */}
              {activeAddForm === 'vimeo' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (addInputVal.trim()) {
                      const clean = extractIframeSrc(addInputVal.trim());
                      if (clean.includes('youtube.com') || clean.includes('youtu.be')) {
                        const yid = getYouTubeVideoId(clean);
                        addBlock('video', yid, undefined, addVideoColumnsVal);
                      } else {
                        const vid = getVimeoVideoId(clean);
                        addBlock('video', `vimeo:${vid}`, undefined, addVideoColumnsVal);
                      }
                      setAddInputVal('');
                      setActiveAddForm(null);
                    }
                  }}
                  className="space-y-2.5 pt-2 border-t border-black/10 dark:border-white/10"
                >
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={addInputVal}
                      onChange={(e) => setAddInputVal(e.target.value)}
                      placeholder="Cole o link, ID ou código <iframe> do Vimeo..."
                      className="w-full sm:flex-1 min-w-0 px-3 py-1.5 text-xs font-mono-code rounded bg-white dark:bg-[#0F1222] border border-black/20 dark:border-white/20 text-[#0F1222] dark:text-white"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#00ADEF] hover:bg-[#0092ca] text-white text-xs font-mono-code font-bold rounded cursor-pointer transition-colors"
                    >
                      Inserir Vimeo
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveAddForm(null)}
                      className="px-3 py-1.5 bg-gray-500/20 text-xs font-mono-code rounded cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono-code">
                    <span className="text-gray-500">Colunas:</span>
                    {[1, 2, 3].map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => setAddVideoColumnsVal(cols)}
                        className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                          addVideoColumnsVal === cols
                            ? 'bg-[#00ADEF] text-white font-bold'
                            : 'bg-black/10 dark:bg-white/10 hover:bg-black/20'
                        }`}
                      >
                        {cols}
                      </button>
                    ))}
                  </div>
                </form>
              )}

              {/* Form: Inserir Imagem */}
              {activeAddForm === 'image' && (
                <div className="space-y-3 pt-2 border-t border-black/10 dark:border-white/10">
                  {/* File input for direct computer upload */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-dashed border-[#2340FF]/40 dark:border-white/20">
                    <label className="flex items-center gap-2 px-4 py-2 bg-[#2340FF] hover:bg-[#1B34D6] text-white text-xs font-mono-code font-bold rounded cursor-pointer transition-colors shadow-sm">
                      {isUploadingNewImage ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#D4FF3A]" />
                      ) : (
                        <Upload className="w-4 h-4 text-[#D4FF3A]" />
                      )}
                      <span>
                        {isUploadingNewImage ? 'Convertendo Imagem...' : 'Escolher Imagem do Computador'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploadingNewImage}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploadingNewImage(true);
                          try {
                            const base64 = await processImageUpload(file, 2048, 2048, 0.88);
                            addBlock('image', base64, addAspectVal, addColumnsVal, addScaleVal);
                            setActiveAddForm(null);
                          } catch (err) {
                            console.error('Erro ao converter imagem:', err);
                            alert('Erro ao carregar a imagem do computador. Tente novamente.');
                          } finally {
                            setIsUploadingNewImage(false);
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                    <span className="text-[11px] font-mono-code text-gray-500 dark:text-gray-400">
                      Converte em Base64 e insere no projeto instantaneamente.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono-code text-gray-400">
                    <span className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
                    <span>ou cole a URL</span>
                    <span className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (addInputVal.trim()) {
                        addBlock('image', addInputVal.trim(), addAspectVal, addColumnsVal, addScaleVal);
                        setAddInputVal('');
                        setActiveAddForm(null);
                      }
                    }}
                    className="flex flex-wrap gap-2"
                  >
                    <input
                      type="text"
                      value={addInputVal}
                      onChange={(e) => setAddInputVal(e.target.value)}
                      placeholder="Cole a URL direta da imagem (ex: https://...)"
                      className="w-full sm:flex-1 min-w-0 px-3 py-1.5 text-xs font-mono-code rounded bg-white dark:bg-[#0F1222] border border-black/20 dark:border-white/20 text-[#0F1222] dark:text-white"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#2340FF] text-white text-xs font-mono-code font-bold rounded cursor-pointer"
                    >
                      Inserir via URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveAddForm(null)}
                      className="px-3 py-1.5 bg-gray-500/20 text-xs font-mono-code rounded cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </form>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code">
                    <span className="text-gray-500">Formato:</span>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="addAspect"
                        checked={addAspectVal === 'contain'}
                        onChange={() => {
                          setAddAspectVal('contain');
                          setAddColumnsVal(1);
                        }}
                      />
                      Inteira
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="addAspect"
                        checked={addAspectVal === 'square'}
                        onChange={() => {
                          setAddAspectVal('square');
                          setAddColumnsVal(3);
                        }}
                      />
                      Quadrada
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="addAspect"
                        checked={addAspectVal === 'story'}
                        onChange={() => {
                          setAddAspectVal('story');
                          setAddColumnsVal(5);
                        }}
                      />
                      Vertical
                    </label>

                    <div className="flex items-center gap-1.5 ml-2">
                      <span className="text-gray-500">Colunas:</span>
                      {(addAspectVal === 'story'
                        ? [1, 2, 3, 4, 5]
                        : addAspectVal === 'square'
                        ? [1, 2, 3, 4]
                        : [1, 2, 3]
                      ).map((cols) => (
                        <button
                          key={cols}
                          type="button"
                          onClick={() => setAddColumnsVal(cols)}
                          className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                            addColumnsVal === cols
                              ? 'bg-[#2340FF] text-white font-bold'
                              : 'bg-black/10 dark:bg-white/10 hover:bg-black/20'
                          }`}
                        >
                          {cols}
                        </button>
                      ))}
                    </div>

                    {addColumnsVal === 1 && (
                      <div className="flex items-center gap-1.5 ml-2">
                        <span className="text-gray-500">Tamanho:</span>
                        <button
                          type="button"
                          onClick={() => setAddScaleVal('original')}
                          className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                            addScaleVal === 'original'
                              ? 'bg-[#2340FF] text-white font-bold'
                              : 'bg-black/10 dark:bg-white/10 hover:bg-black/20'
                          }`}
                        >
                          Original
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddScaleVal('thumb')}
                          className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                            addScaleVal === 'thumb'
                              ? 'bg-[#2340FF] text-white font-bold'
                              : 'bg-black/10 dark:bg-white/10 hover:bg-black/20'
                          }`}
                        >
                          Miniatura
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Navigation: Anterior / Próximo */}
          <div className="pt-8 sm:pt-12 mt-8 sm:mt-12 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6">
            <button
              id="btn-prev-case"
              type="button"
              onClick={() => onSelectCase(prevCase)}
              className="group flex items-center gap-3 text-left cursor-pointer p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-h-[44px]"
            >
              <div
                className={`p-2.5 sm:p-3 rounded-full transition-transform group-hover:-translate-x-1 shrink-0 ${
                  isLadoB ? 'bg-white/10 text-white' : 'bg-black/5 text-[#0F1222]'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span
                  className={`font-mono-code text-[11px] uppercase tracking-widest block ${
                    isLadoB ? 'text-[#AFC0FF]' : 'text-[#5B6070]'
                  }`}
                >
                  Anterior
                </span>
                <span className="font-disp font-bold text-base sm:text-lg group-hover:underline truncate block">
                  {prevCase.name}
                </span>
              </div>
            </button>

            <button
              id="btn-next-case"
              type="button"
              onClick={() => onSelectCase(nextCase)}
              className="group flex items-center justify-end gap-3 text-right cursor-pointer p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-h-[44px]"
            >
              <div className="min-w-0">
                <span
                  className={`font-mono-code text-[11px] uppercase tracking-widest block ${
                    isLadoB ? 'text-[#AFC0FF]' : 'text-[#5B6070]'
                  }`}
                >
                  Próximo
                </span>
                <span className="font-disp font-bold text-base sm:text-lg group-hover:underline truncate block">
                  {nextCase.name}
                </span>
              </div>
              <div
                className={`p-2.5 sm:p-3 rounded-full transition-transform group-hover:translate-x-1 shrink-0 ${
                  isLadoB ? 'bg-white/10 text-white' : 'bg-black/5 text-[#0F1222]'
                }`}
              >
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
