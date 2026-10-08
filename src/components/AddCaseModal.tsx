import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Upload,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  Layers,
  FileText,
  Tag,
  Video,
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { CaseItem, LadoType, GridSpanType } from '../types';
import { processImageUpload } from '../utils/imageUpload';
import { isYouTubeVideo, getYouTubeVideoId, getYouTubeThumbnail } from '../utils/videoUtils';

interface AddCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated?: (newCase: CaseItem) => void;
}

export const AddCaseModal: React.FC<AddCaseModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated,
}) => {
  const { addCase } = useCms();

  const [name, setName] = useState('');
  const [faixa, setFaixa] = useState('');
  const [concept, setConcept] = useState('');
  const [lado, setLado] = useState<LadoType>('A');
  const [gridSpan, setGridSpan] = useState<GridSpanType>('half');
  const [deliv, setDeliv] = useState('');
  const [cover, setCover] = useState('');
  const [text, setText] = useState('');
  const [extraImgs, setExtraImgs] = useState('');
  const [ytVideos, setYtVideos] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setErrorMsg(null);
    try {
      const dataUrl = await processImageUpload(file, 1600, 1000, 0.85);
      setCover(dataUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Erro ao processar imagem de capa. Tente um arquivo menor ou uma URL direta.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor, informe o título do projeto.');
      return;
    }
    if (!concept.trim()) {
      setErrorMsg('Por favor, informe o subtítulo ou conceito do projeto.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const paragraphs = text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);

      const parsedImgs = extraImgs
        .split(/[\n,]/)
        .map((u) => u.trim())
        .filter(Boolean);

      const parsedYt = ytVideos
        .split(/[\n,]/)
        .map((y) => y.trim())
        .filter(Boolean);

      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `projeto-${Date.now()}`;

      const created: CaseItem = {
        slug,
        name: name.trim(),
        concept: concept.trim(),
        faixa: faixa.trim() || (lado === 'A' ? 'Lado A' : lado === 'B' ? 'Lado B' : 'Faixa Bônus'),
        lado,
        gridSpan,
        deliv: deliv.trim() || 'PROJETO & CONCEITO',
        cover: (() => {
          const trimmedCover = cover.trim();
          if (trimmedCover) {
            if (isYouTubeVideo(trimmedCover)) {
              return getYouTubeThumbnail(trimmedCover, 'maxres');
            }
            return trimmedCover;
          }
          if (parsedYt.length > 0 && parsedYt[0]) {
            return getYouTubeThumbnail(parsedYt[0], 'maxres');
          }
          return 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80';
        })(),
        coverFormat: 'original',
        text: paragraphs.length > 0 ? paragraphs : [concept.trim()],
        imgs: parsedImgs,
        yt: parsedYt,
      };

      await addCase(created);

      // Reset form
      setName('');
      setFaixa('');
      setConcept('');
      setDeliv('');
      setCover('');
      setText('');
      setExtraImgs('');
      setYtVideos('');

      onClose();

      if (onCaseCreated) {
        onCaseCreated(created);
      }
    } catch (err: any) {
      console.error('Erro ao criar projeto:', err);
      setErrorMsg(err?.message || 'Falha ao salvar o novo projeto na nuvem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-add-title"
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#0F1222] text-[#F6F7F2] border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-7 space-y-6 my-auto max-h-[92vh] overflow-y-auto font-sans relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#D4FF3A] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4FF3A]" />
              Painel de Edição CMS
            </span>
            <h2 id="modal-add-title" className="font-disp font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Adicionar Novo Projeto
            </h2>
            <p className="text-xs font-mono-code text-[#AFC0FF]">
              Preencha os detalhes abaixo para publicar o case diretamente na nuvem (Firestore).
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs font-mono-code">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Seção / Categoria (Lado A, Lado B, Bônus) */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-code text-[#AFC0FF] font-bold uppercase tracking-wider block">
              1. Seção do Portfólio:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLado('A')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-mono-code font-bold transition-all cursor-pointer ${
                  lado === 'A'
                    ? 'bg-[#2340FF] border-[#D4FF3A] text-white shadow-lg ring-2 ring-[#D4FF3A]/50'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="text-sm">Lado A</span>
                <span className="text-[10px] opacity-80 font-normal">Advertising</span>
              </button>

              <button
                type="button"
                onClick={() => setLado('B')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-mono-code font-bold transition-all cursor-pointer ${
                  lado === 'B'
                    ? 'bg-[#FF4FA0] border-white text-white shadow-lg ring-2 ring-white/50'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="text-sm">Lado B</span>
                <span className="text-[10px] opacity-80 font-normal">Branding</span>
              </button>

              <button
                type="button"
                onClick={() => setLado('bonus')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-mono-code font-bold transition-all cursor-pointer ${
                  lado === 'bonus'
                    ? 'bg-[#D4FF3A] border-black text-[#0F1222] shadow-lg ring-2 ring-[#2340FF]/50'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="text-sm">Faixa Bônus</span>
                <span className="text-[10px] opacity-80 font-normal">Especiais</span>
              </button>
            </div>
          </div>

          {/* Formato de Exibição no Grid (Mosaico Editorial) */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-code text-[#AFC0FF] font-bold uppercase tracking-wider block">
              2. Formato de Exibição no Grid (Mosaico):
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setGridSpan('full')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-mono-code font-bold transition-all cursor-pointer ${
                  gridSpan === 'full'
                    ? 'bg-[#D4FF3A] border-black text-[#0F1222] shadow-lg ring-2 ring-[#2340FF]/50'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="text-xs sm:text-sm font-black">Destaque (Full)</span>
                <span className="text-[10px] opacity-80 font-normal">100% da linha</span>
              </button>

              <button
                type="button"
                onClick={() => setGridSpan('half')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-mono-code font-bold transition-all cursor-pointer ${
                  gridSpan === 'half'
                    ? 'bg-[#D4FF3A] border-black text-[#0F1222] shadow-lg ring-2 ring-[#2340FF]/50'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="text-xs sm:text-sm font-black">Médio (Metade)</span>
                <span className="text-[10px] opacity-80 font-normal">50% (2 por linha)</span>
              </button>

              <button
                type="button"
                onClick={() => setGridSpan('third')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-mono-code font-bold transition-all cursor-pointer ${
                  gridSpan === 'third'
                    ? 'bg-[#D4FF3A] border-black text-[#0F1222] shadow-lg ring-2 ring-[#2340FF]/50'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="text-xs sm:text-sm font-black">Compacto (Terço)</span>
                <span className="text-[10px] opacity-80 font-normal">33% (3 por linha)</span>
              </button>
            </div>
          </div>

          {/* Título do Projeto */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-code text-[#AFC0FF] font-bold uppercase tracking-wider block">
              3. Título do Projeto:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: SAMSUNG · GALAXY AI ou VIVO · O TEMPO É VOCÊ"
              className="w-full bg-black/40 border border-white/20 focus:border-[#D4FF3A] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors font-disp font-bold"
            />
          </div>

          {/* Categoria / Faixa */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-code text-[#AFC0FF] font-bold uppercase tracking-wider block">
              4. Categoria / Faixa:
            </label>
            <input
              type="text"
              value={faixa}
              onChange={(e) => setFaixa(e.target.value)}
              placeholder="Ex: FILME // DIGITAL, BRANDING, CONCEITO..."
              className="w-full bg-black/40 border border-white/20 focus:border-[#D4FF3A] rounded-xl px-3.5 py-2 text-xs font-mono-code text-white focus:outline-none transition-colors"
            />
          </div>

          {/* Subtítulo / Cliente / Conceito */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-code text-[#AFC0FF] font-bold uppercase tracking-wider block">
              3. Subtítulo / Conceito Resumido:
            </label>
            <textarea
              required
              rows={2}
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Ex: Campanha de posicionamento 360° para apresentar a nova era da IA generativa."
              className="w-full bg-black/40 border border-white/20 focus:border-[#D4FF3A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none transition-colors leading-relaxed"
            />
          </div>

          {/* Entregas / Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-code text-[#AFC0FF] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#D4FF3A]" />
              4. Entregas / Tags da Capa:
            </label>
            <input
              type="text"
              value={deliv}
              onChange={(e) => setDeliv(e.target.value)}
              placeholder="Ex: FILME + TITULAÇÃO + MÍDIA DE IMPACTO"
              className="w-full bg-black/40 border border-white/20 focus:border-[#D4FF3A] rounded-xl px-3.5 py-2 text-xs font-mono-code text-white focus:outline-none transition-colors"
            />
          </div>

          {/* Imagem de Capa (Thumbnail) */}
          <div className="space-y-2">
            <label className="text-xs font-mono-code text-[#AFC0FF] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#D4FF3A]" />
              5. Capa do Projeto (Thumbnail 16:9):
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                placeholder="Cole a URL da imagem de capa..."
                className="flex-1 bg-black/40 border border-white/20 focus:border-[#D4FF3A] rounded-xl px-3.5 py-2 text-xs font-mono-code text-white focus:outline-none transition-colors"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2340FF] hover:bg-[#1B34D6] text-white text-xs font-mono-code font-bold transition-colors cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-[#D4FF3A]" />
                    <span>Upload Local</span>
                  </>
                )}
              </button>
            </div>

            {/* Thumbnail Live Preview */}
            <div className="mt-2 relative aspect-[16/9] w-full max-w-sm rounded-xl overflow-hidden border border-white/20 bg-black/50 shadow-md">
              <img
                src={
                  cover ||
                  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80'
                }
                alt="Pré-visualização da capa"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div
                className={`absolute top-0 right-0 w-10 h-10 pointer-events-none ${
                  lado === 'bonus'
                    ? 'bg-[linear-gradient(225deg,#D4FF3A_50%,#0F1222_50%,#0F1222_100%)]'
                    : lado === 'A'
                    ? 'bg-[linear-gradient(225deg,#F6F7F2_50%,#1B34D6_50%,#2340FF_100%)]'
                    : 'bg-[linear-gradient(225deg,#0F1222_50%,#C83C80_50%,#FF4FA0_100%)]'
                }`}
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono-code text-white/90">
                Preview Thumbnail (16:9)
              </span>
            </div>
          </div>

          {/* Conteúdo Detalhado para o Case Modal */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono-code text-[#AFC0FF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#D4FF3A]" />
                6. Conteúdo Detalhado (Case Modal):
              </label>
              <span className="text-[10px] font-mono-code text-white/50">
                Enter para novo parágrafo
              </span>
            </div>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escreva a história completa do case, desafio, ideia central, execução e resultados que serão exibidos no modal..."
              className="w-full bg-black/40 border border-white/20 focus:border-[#D4FF3A] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors leading-relaxed font-sans"
            />
          </div>

          {/* Links Opcionais de Imagens Extras e Vídeos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-white/10">
            <div className="space-y-1">
              <label className="text-[11px] font-mono-code text-[#AFC0FF] font-semibold flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#D4FF3A]" />
                Galeria Extra (URLs separadas por vírgula):
              </label>
              <input
                type="text"
                value={extraImgs}
                onChange={(e) => setExtraImgs(e.target.value)}
                placeholder="https://... , https://..."
                className="w-full bg-black/40 border border-white/20 focus:border-[#D4FF3A] rounded-lg px-2.5 py-1.5 text-xs font-mono-code text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono-code text-[#AFC0FF] font-semibold flex items-center gap-1">
                <Video className="w-3 h-3 text-[#D4FF3A]" />
                Vídeos YouTube/Vimeo (IDs ou URLs):
              </label>
              <input
                type="text"
                value={ytVideos}
                onChange={(e) => setYtVideos(e.target.value)}
                placeholder="dQw4w9WgXcQ ou link completo"
                className="w-full bg-black/40 border border-white/20 focus:border-[#D4FF3A] rounded-lg px-2.5 py-1.5 text-xs font-mono-code text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-mono-code font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4FF3A] hover:bg-[#e4ff70] text-[#0F1222] font-mono-code text-xs font-bold shadow-xl transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publicando no Firestore...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>+ Publicar Projeto</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCaseModal;
