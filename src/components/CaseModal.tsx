import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { CaseItem } from '../types';
import { useCms } from '../context/CmsContext';

interface CaseModalProps {
  item: CaseItem | null;
  onClose: () => void;
  onSelectCase: (caseItem: CaseItem) => void;
  allCases: CaseItem[];
  onOpenLightbox?: (imgUrl: string, title: string) => void;
}

export const CaseModal: React.FC<CaseModalProps> = ({
  item: propItem,
  onClose,
  onSelectCase,
  allCases,
  onOpenLightbox,
}) => {
  const {
    isEditMode,
    cases,
    updateCaseField,
    updateCaseParagraph,
    addCaseParagraph,
    removeCaseParagraph,
    reorderCaseImages,
    addCaseImage,
    removeCaseImage,
    reorderCaseVideos,
    addCaseVideo,
    removeCaseVideo,
  } = useCms();

  // Find the live case in CMS state so any inline edits reflect immediately
  const item = propItem
    ? cases.find((c) => c.slug === propItem.slug) || propItem
    : null;

  const [playingVideos, setPlayingVideos] = useState<Record<string, boolean>>({});
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [newVideoInput, setNewVideoInput] = useState('');
  const [isAddingVideo, setIsAddingVideo] = useState(false);

  // Drag states for images
  const [draggedImgIdx, setDraggedImgIdx] = useState<number | null>(null);
  const [dragOverImgIdx, setDragOverImgIdx] = useState<number | null>(null);

  // Drag states for videos
  const [draggedYtIdx, setDraggedYtIdx] = useState<number | null>(null);
  const [dragOverYtIdx, setDragOverYtIdx] = useState<number | null>(null);

  useEffect(() => {
    setPlayingVideos({});

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept escape or arrows if typing in input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'Escape') {
        onClose();
      }
      if (item) {
        const currentIndex = allCases.findIndex((c) => c.slug === item.slug);
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          onSelectCase(allCases[currentIndex - 1]);
        } else if (e.key === 'ArrowRight' && currentIndex < allCases.length - 1) {
          onSelectCase(allCases[currentIndex + 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose, onSelectCase, allCases]);

  useEffect(() => {
    if (item) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [item]);

  if (!item) return null;

  const currentIndex = allCases.findIndex((c) => c.slug === item.slug);
  const prevCase = currentIndex > 0 ? allCases[currentIndex - 1] : allCases[allCases.length - 1];
  const nextCase = currentIndex < allCases.length - 1 ? allCases[currentIndex + 1] : allCases[0];

  const isLadoB = item.lado === 'B' || item.lado === 'bonus';
  const ladoLabel =
    item.lado === 'A' ? 'Lado A' : item.lado === 'B' ? 'Lado B' : 'Faixa Bônus';

  const handlePlayVideo = (ytId: string) => {
    setPlayingVideos((prev) => ({ ...prev, [ytId]: true }));
  };

  const handleAddImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      addCaseImage(item.slug, newImageUrl.trim());
      setNewImageUrl('');
      setIsAddingImage(false);
    }
  };

  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVideoInput.trim()) {
      addCaseVideo(item.slug, newVideoInput.trim());
      setNewVideoInput('');
      setIsAddingVideo(false);
    }
  };

  return (
    <div
      id="case-modal-fullscreen"
      className={`fixed inset-0 z-50 w-full h-full h-[100dvh] overflow-y-auto animate-fade-in transition-colors duration-200 ${
        isLadoB ? 'bg-[#0F1222] text-[#F6F7F2]' : 'bg-[#F6F7F2] text-[#0F1222]'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-modal-title"
    >
      <div className="w-full min-h-full flex flex-col">
        {/* Top Sticky Bar */}
        <header
          className={`sticky top-0 z-30 w-full border-b backdrop-blur-md transition-colors ${
            isLadoB
              ? 'bg-[#0F1222]/95 border-white/10'
              : 'bg-[#F6F7F2]/95 border-black/10'
          }`}
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12 py-4 flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`font-mono-code text-xs sm:text-sm uppercase tracking-widest font-semibold ${
                  isLadoB ? 'text-[#AFC0FF]' : 'text-[#5B6070]'
                }`}
              >
                {ladoLabel} · {item.faixa}
              </span>

              {isEditMode && (
                <span className="px-2 py-0.5 rounded bg-[#2340FF] text-white text-[11px] font-mono-code font-bold uppercase tracking-wider">
                  Edição Ativa
                </span>
              )}
            </div>

            {/* Close Button Top Corner */}
            <button
              id="btn-close-case-modal"
              type="button"
              onClick={onClose}
              className={`font-mono-code text-xs sm:text-sm uppercase tracking-widest font-bold pb-0.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
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
        <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
          {/* Header Section */}
          <div className="space-y-5 mb-10 max-w-4xl">
            {/* Project Client Name */}
            <div>
              {isEditMode ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateCaseField(item.slug, 'name', e.target.value)}
                    className={`faixa-clip text-sm sm:text-base font-bold border-2 border-white/40 px-2 py-1 focus:outline-none ${
                      isLadoB ? 'bg-[#FF4FA0] text-white' : 'bg-[#2340FF] text-[#F6F7F2]'
                    }`}
                    title="Editar nome do cliente/projeto"
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
                  {item.name}
                </span>
              )}
            </div>

            {/* Concept / Big Headline */}
            {isEditMode ? (
              <textarea
                value={item.concept}
                rows={2}
                onChange={(e) => updateCaseField(item.slug, 'concept', e.target.value)}
                className="w-full font-disp font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[0.98] bg-transparent border-2 border-dashed border-[#2340FF] dark:border-[#FF4FA0] p-2 rounded focus:outline-none focus:bg-black/5 dark:focus:bg-white/5"
                title="Editar conceito principal"
              />
            ) : (
              <h2
                id="case-modal-title"
                className="font-disp font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.98] text-balance"
              >
                {item.concept}
              </h2>
            )}

            {/* Deliverables Tag */}
            <div>
              {isEditMode ? (
                <input
                  type="text"
                  value={item.deliv}
                  onChange={(e) => updateCaseField(item.slug, 'deliv', e.target.value)}
                  className={`font-mono-code text-xs sm:text-sm uppercase tracking-wider py-1.5 px-3 rounded border border-dashed border-[#2340FF] dark:border-[#FF4FA0] ${
                    isLadoB ? 'bg-white/10 text-[#AFC0FF]' : 'bg-black/5 text-[#5B6070]'
                  }`}
                  title="Editar entregas técnicas"
                />
              ) : (
                <span
                  className={`font-mono-code text-xs sm:text-sm uppercase tracking-wider py-1.5 px-3 rounded inline-block ${
                    isLadoB ? 'bg-white/10 text-[#AFC0FF]' : 'bg-black/5 text-[#5B6070]'
                  }`}
                >
                  {item.deliv}
                </span>
              )}
            </div>
          </div>

          {/* Text Paragraphs */}
          <div
            className={`space-y-6 text-xl sm:text-2xl md:text-3xl leading-relaxed max-w-4xl mb-14 font-normal ${
              isLadoB ? 'text-[#D5DBF5]' : 'text-[#343848]'
            }`}
          >
            {item.text.map((paragraph, index) => (
              <div key={index} className="relative group/p">
                {isEditMode ? (
                  <div className="flex items-start gap-2">
                    <textarea
                      value={paragraph}
                      rows={3}
                      onChange={(e) => updateCaseParagraph(item.slug, index, e.target.value)}
                      className="w-full text-lg sm:text-xl md:text-2xl leading-relaxed bg-black/5 dark:bg-white/5 border border-dashed border-[#2340FF] dark:border-[#FF4FA0] p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#2340FF] dark:focus:ring-[#FF4FA0] text-[#0F1222] dark:text-[#F6F7F2]"
                      title="Editar parágrafo de texto"
                    />
                    <button
                      type="button"
                      onClick={() => removeCaseParagraph(item.slug, index)}
                      className="p-2 rounded bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-colors cursor-pointer mt-1"
                      title="Excluir este parágrafo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p>{paragraph}</p>
                )}
              </div>
            ))}

            {isEditMode && (
              <button
                type="button"
                onClick={() => addCaseParagraph(item.slug)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#2340FF] text-[#2340FF] dark:text-[#D4FF3A] hover:bg-[#2340FF]/10 text-xs font-mono-code font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Adicionar Parágrafo de Texto
              </button>
            )}
          </div>

          {/* Media Section: YouTube Videos */}
          {(item.yt.length > 0 || isEditMode) && (
            <div className="space-y-8 mb-16">
              {isEditMode && (
                <div className="flex justify-end items-center">
                  <button
                    type="button"
                    onClick={() => setIsAddingVideo(!isAddingVideo)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#2340FF] text-white hover:bg-[#1B34D6] text-xs font-mono-code font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Vídeo
                  </button>
                </div>
              )}

              {/* Add Video Form */}
              {isEditMode && isAddingVideo && (
                <form
                  onSubmit={handleAddVideoSubmit}
                  className="p-4 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-wrap gap-2 max-w-2xl"
                >
                  <input
                    type="text"
                    value={newVideoInput}
                    onChange={(e) => setNewVideoInput(e.target.value)}
                    placeholder="Cole o link do YouTube (ex: https://youtube.com/watch?v=...) ou ID"
                    className="flex-1 min-w-[280px] px-3 py-1.5 text-xs font-mono-code rounded bg-white dark:bg-[#0F1222] border border-black/20 dark:border-white/20 text-[#0F1222] dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#2340FF] text-white text-xs font-mono-code font-bold rounded cursor-pointer"
                  >
                    Inserir
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingVideo(false)}
                    className="px-3 py-1.5 bg-gray-500/20 text-xs font-mono-code rounded cursor-pointer"
                  >
                    Cancelar
                  </button>
                </form>
              )}

              <div className="space-y-8">
                {item.yt.map((ytId, idx) => (
                  <div
                    key={ytId + idx}
                    draggable={isEditMode}
                    onDragStart={() => setDraggedYtIdx(idx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverYtIdx(idx);
                    }}
                    onDragLeave={() => setDragOverYtIdx(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedYtIdx !== null && draggedYtIdx !== idx) {
                        reorderCaseVideos(item.slug, draggedYtIdx, idx);
                      }
                      setDraggedYtIdx(null);
                      setDragOverYtIdx(null);
                    }}
                    className={`relative max-w-5xl transition-all ${
                      dragOverYtIdx === idx ? 'ring-4 ring-[#2340FF]' : ''
                    }`}
                  >
                    {/* Reorder & Delete Bar for Video in Edit Mode */}
                    {isEditMode && (
                      <div className="flex items-center justify-between bg-black/80 text-white px-3 py-1.5 rounded-t-lg text-xs font-mono-code select-none border border-white/10">
                        <div className="flex items-center gap-2 cursor-grab">
                          <GripVertical className="w-4 h-4 text-[#D4FF3A]" />
                          <span>Arraste para reordenar vídeo ({idx + 1})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => reorderCaseVideos(item.slug, idx, idx - 1)}
                            className="p-1 hover:bg-white/20 rounded disabled:opacity-30"
                            title="Mover para cima"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === item.yt.length - 1}
                            onClick={() => reorderCaseVideos(item.slug, idx, idx + 1)}
                            className="p-1 hover:bg-white/20 rounded disabled:opacity-30"
                            title="Mover para baixo"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCaseVideo(item.slug, idx)}
                            className="p-1 hover:bg-red-500 rounded text-red-400 hover:text-white transition-colors"
                            title="Remover vídeo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="relative aspect-video bg-black rounded-b-lg overflow-hidden shadow-2xl border border-black/10">
                      {playingVideos[ytId] ? (
                        <div className="relative w-full h-full">
                          <iframe
                            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                            title="Vídeo do case"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                          <a
                            href={`https://www.youtube.com/watch?v=${ytId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 bg-black/80 hover:bg-black text-white text-[11px] font-mono-code rounded backdrop-blur-sm border border-white/20 transition-all flex items-center gap-1.5 opacity-80 hover:opacity-100 shadow-md"
                            title="Abrir no YouTube"
                          >
                            <span>Assistir no YouTube</span>
                            <ExternalLink className="w-3 h-3 text-[#D4FF3A]" />
                          </a>
                        </div>
                      ) : (
                        <div
                          onClick={() => handlePlayVideo(ytId)}
                          className="group relative w-full h-full cursor-pointer flex items-center justify-center bg-black"
                        >
                          <img
                            src={`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`}
                            alt="Thumbnail do vídeo"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <span
                            className={`faixa-clip absolute left-6 bottom-6 text-base sm:text-lg font-bold shadow-md flex items-center gap-2 transform group-hover:scale-105 transition-transform ${
                              isLadoB ? 'bg-[#FF4FA0] text-white' : 'bg-[#D4FF3A] text-[#0F1222]'
                            }`}
                          >
                            <Play className="w-4 h-4 fill-current" />
                            Dá o play
                          </span>
                          <a
                            href={`https://www.youtube.com/watch?v=${ytId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 bg-black/70 hover:bg-black text-white text-[11px] font-mono-code rounded backdrop-blur-sm border border-white/20 transition-all flex items-center gap-1.5 opacity-0 group-hover:opacity-100 shadow-md"
                            title="Abrir diretamente no YouTube"
                          >
                            <span>Assistir no YouTube</span>
                            <ExternalLink className="w-3 h-3 text-[#D4FF3A]" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media Section: High-Res Campaign Images */}
          {(item.imgs.length > 0 || isEditMode) && (
            <div className="space-y-8 mb-16">
              {isEditMode && (
                <div className="flex justify-end items-center">
                  <button
                    type="button"
                    onClick={() => setIsAddingImage(!isAddingImage)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#2340FF] text-white hover:bg-[#1B34D6] text-xs font-mono-code font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Peça / Imagem
                  </button>
                </div>
              )}

              {/* Add Image Form */}
              {isEditMode && isAddingImage && (
                <form
                  onSubmit={handleAddImageSubmit}
                  className="p-4 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-wrap gap-2 max-w-2xl"
                >
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="URL direta da imagem (ex: https://...)"
                    className="flex-1 min-w-[280px] px-3 py-1.5 text-xs font-mono-code rounded bg-white dark:bg-[#0F1222] border border-black/20 dark:border-white/20 text-[#0F1222] dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#2340FF] text-white text-xs font-mono-code font-bold rounded cursor-pointer"
                  >
                    Adicionar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingImage(false)}
                    className="px-3 py-1.5 bg-gray-500/20 text-xs font-mono-code rounded cursor-pointer"
                  >
                    Cancelar
                  </button>
                </form>
              )}

              <div className="space-y-10 max-w-5xl">
                {item.imgs.map((imgUrl, idx) => (
                  <div
                    key={imgUrl + idx}
                    draggable={isEditMode}
                    onDragStart={() => setDraggedImgIdx(idx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverImgIdx(idx);
                    }}
                    onDragLeave={() => setDragOverImgIdx(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedImgIdx !== null && draggedImgIdx !== idx) {
                        reorderCaseImages(item.slug, draggedImgIdx, idx);
                      }
                      setDraggedImgIdx(null);
                      setDragOverImgIdx(null);
                    }}
                    className={`group relative bg-[#E4E6EA] dark:bg-[#151928] rounded-lg overflow-hidden border border-black/10 dark:border-white/10 shadow-lg transition-all ${
                      dragOverImgIdx === idx ? 'ring-4 ring-[#2340FF]' : ''
                    }`}
                  >
                    {/* Reorder & Action Bar in Edit Mode */}
                    {isEditMode && (
                      <div className="flex items-center justify-between bg-black/85 text-white px-3 py-2 text-xs font-mono-code select-none border-b border-white/10">
                        <div className="flex items-center gap-2 cursor-grab">
                          <GripVertical className="w-4 h-4 text-[#D4FF3A]" />
                          <span>Arraste para reordenar peça ({idx + 1} de {item.imgs.length})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => reorderCaseImages(item.slug, idx, idx - 1)}
                            className="p-1 hover:bg-white/20 rounded disabled:opacity-30"
                            title="Mover para cima"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === item.imgs.length - 1}
                            onClick={() => reorderCaseImages(item.slug, idx, idx + 1)}
                            className="p-1 hover:bg-white/20 rounded disabled:opacity-30"
                            title="Mover para baixo"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCaseImage(item.slug, idx)}
                            className="p-1 hover:bg-red-500 rounded text-red-400 hover:text-white transition-colors"
                            title="Excluir imagem"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    <img
                      src={imgUrl}
                      alt={`Peça ${idx + 1} de ${item.name}`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover cursor-pointer"
                      onClick={() => !isEditMode && onOpenLightbox && onOpenLightbox(imgUrl, `${item.name} - Peça ${idx + 1}`)}
                    />

                    {!isEditMode && onOpenLightbox && (
                      <button
                        type="button"
                        onClick={() => onOpenLightbox(imgUrl, `${item.name} - Peça ${idx + 1}`)}
                        className="absolute top-4 right-4 p-2.5 rounded bg-[#0F1222]/80 hover:bg-[#0F1222] text-white hover:text-[#D4FF3A] opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer"
                        title="Ampliar peça"
                        aria-label="Ampliar peça"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Bar at Bottom: Next / Previous */}
          <div className="pt-12 mt-12 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-6">
            <button
              id="btn-prev-case"
              type="button"
              onClick={() => onSelectCase(prevCase)}
              className="group flex items-center gap-3 text-left cursor-pointer"
            >
              <div
                className={`p-2.5 sm:p-3 rounded-full transition-transform group-hover:-translate-x-1 ${
                  isLadoB ? 'bg-white/10 text-white' : 'bg-black/5 text-[#0F1222]'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </div>
              <div>
                <span
                  className={`font-mono-code text-[11px] uppercase tracking-widest block ${
                    isLadoB ? 'text-[#AFC0FF]' : 'text-[#5B6070]'
                  }`}
                >
                  Anterior
                </span>
                <span className="font-disp font-bold text-base sm:text-lg group-hover:underline">
                  {prevCase.name}
                </span>
              </div>
            </button>

            <button
              id="btn-next-case"
              type="button"
              onClick={() => onSelectCase(nextCase)}
              className="group flex items-center gap-3 text-right cursor-pointer"
            >
              <div>
                <span
                  className={`font-mono-code text-[11px] uppercase tracking-widest block ${
                    isLadoB ? 'text-[#AFC0FF]' : 'text-[#5B6070]'
                  }`}
                >
                  Próximo
                </span>
                <span className="font-disp font-bold text-base sm:text-lg group-hover:underline">
                  {nextCase.name}
                </span>
              </div>
              <div
                className={`p-2.5 sm:p-3 rounded-full transition-transform group-hover:translate-x-1 ${
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
