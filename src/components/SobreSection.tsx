import React, { useState } from 'react';
import { Upload, Loader2, Type, Sliders } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { convertFileToBase64 } from '../utils/imageUpload';

// Tokens e classes utilitárias estritamente restritos ao design system atual do projeto:
const FONT_SIZE_MAP: Record<string, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const FONT_WEIGHT_MAP: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const TITLE_SIZE_MAP: Record<string, string> = {
  sm: 'text-2xl sm:text-3xl',
  base: 'text-3xl sm:text-4xl',
  lg: 'text-3xl sm:text-4xl lg:text-5xl',
  xl: 'text-4xl sm:text-5xl lg:text-6xl',
};

export const SobreSection: React.FC = () => {
  const {
    isEditMode,
    sobre,
    updateSobreField,
    updateSobreStat,
    updateSobreTypography,
  } = useCms();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const currentTitle = sobre.title || 'Quem é do Méier não bobéia.';

  // Filter out the headline from the narrative paragraphs to avoid duplication
  const narrativeParagraphs = sobre.bio.filter(
    (p) =>
      p.trim() !== currentTitle.trim() &&
      !p.toLowerCase().includes('quem é do méier')
  );

  // Dynamic typography styles from CMS state
  const fontSizeKey = sobre.typography?.fontSize || 'base';
  const fontWeightKey = sobre.typography?.fontWeight || 'normal';
  const titleSizeKey = sobre.typography?.titleSize || 'lg';

  const bodySizeClass = FONT_SIZE_MAP[fontSizeKey] || FONT_SIZE_MAP.base;
  const bodyWeightClass = FONT_WEIGHT_MAP[fontWeightKey] || FONT_WEIGHT_MAP.normal;
  const titleSizeClass = TITLE_SIZE_MAP[titleSizeKey] || TITLE_SIZE_MAP.lg;

  return (
    <section
      id="sobre"
      className={`w-full bg-[#2340FF] text-white flex flex-col justify-between py-2.5 sm:py-3 lg:py-3 px-6 sm:px-10 lg:px-16 xl:px-20 scroll-mt-[60px] relative ${
        isEditMode
          ? 'min-h-[calc(100vh-60px)] overflow-y-auto'
          : 'h-[calc(100vh-60px)] lg:max-h-[calc(100vh-60px)] overflow-hidden'
      }`}
    >
      {/* Editorial background ambient texture */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" 
        aria-hidden="true" 
      />

      <div className="max-w-[1280px] 2xl:max-w-[1360px] w-full mx-auto h-full flex flex-col justify-between relative z-10">
        
        {/* BLOCO CENTRAL COESO: Foto Retrato Ampliada + Copy Editorial com Espaçamento Ajustado (Aproximado) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center my-auto flex-1">
          
          {/* Coluna Esquerda: Fotografia Retrato com Formato Vertical Estrito 4/5 (w-[260px] a w-[320px]) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start items-center">
            <div className="relative w-[260px] sm:w-[285px] lg:w-[315px] xl:w-[325px] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-white/20 bg-[#0F1222] group flex flex-col">
              {/* Author Photo */}
              <img
                src={sobre.photoUrl}
                alt={`${sobre.name} · ${sobre.role}`}
                className="w-full h-full object-cover object-top sm:object-center transition-transform duration-700 ease-out group-hover:scale-105 absolute inset-0"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              {/* Edit Mode: Upload Local Photo */}
              {isEditMode && (
                <div className="absolute top-2.5 right-2.5 z-20 bg-black/85 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-xl max-w-[210px]">
                  <label className="text-[10px] font-mono-code text-[#D4FF3A] font-bold flex items-center gap-1.5 mb-1">
                    <Upload className="w-3 h-3" /> Trocar Foto (Local):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingPhoto}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploadingPhoto(true);
                      try {
                        const base64 = await convertFileToBase64(file);
                        updateSobreField('photoUrl', base64);
                      } catch (err) {
                        console.error('Erro ao converter foto em base64:', err);
                      } finally {
                        setIsUploadingPhoto(false);
                        e.target.value = '';
                      }
                    }}
                    className="text-[9px] font-mono-code text-white file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-[9px] file:font-semibold file:bg-[#2340FF] file:text-white cursor-pointer w-full"
                  />
                  {isUploadingPhoto && (
                    <span className="text-[9px] font-mono-code text-[#D4FF3A] flex items-center gap-1 mt-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Convertendo...
                    </span>
                  )}
                </div>
              )}

              {/* Gradient overlay for text contrast at the bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

              {/* Assinatura sobreposta elegante na base da foto */}
              <div className="mt-auto relative z-10 p-3.5 sm:p-4 lg:p-4.5 flex flex-col items-start text-left">
                {/* 1. Nome com presença imponente */}
                <h3 className="font-disp font-extrabold text-lg sm:text-xl lg:text-[22px] xl:text-[24px] text-white tracking-tight leading-tight">
                  {sobre.name}
                </h3>

                {/* 2. Cargo: diretamente ligado ao nome */}
                <p className="font-serif-it text-xs sm:text-sm lg:text-[14px] xl:text-[15px] text-[#AFC0FF] italic leading-snug mt-0.5">
                  {sobre.role}
                </p>

                {/* 3. Localização / Status */}
                <span className="font-mono-code text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-wider text-[#D4FF3A] font-semibold block leading-normal mt-1.5 select-none">
                  {sobre.badge}
                </span>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Copy Biográfica Puxada para a Esquerda (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-2 sm:space-y-2.5">
            
            {/* Controles Dinâmicos de Estilo e Tipografia (Exibidos apenas no Modo Edição) */}
            {isEditMode && (
              <div className="flex flex-wrap items-center gap-2.5 p-2 rounded-xl bg-black/60 backdrop-blur-md border border-[#D4FF3A]/30 text-xs font-mono-code mb-1">
                <div className="flex items-center gap-1 text-[#D4FF3A] font-bold text-[10px] uppercase">
                  <Sliders className="w-3 h-3" /> Estilo:
                </div>

                {/* Tamanho do Texto */}
                <div className="flex items-center gap-1 border-l border-white/20 pl-2">
                  <span className="text-[#AFC0FF] text-[10px]">Texto:</span>
                  {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => updateSobreTypography('fontSize', sz)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        fontSizeKey === sz
                          ? 'bg-[#D4FF3A] text-[#0F1222] font-black'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      title={`Tamanho ${sz.toUpperCase()}`}
                    >
                      {sz === 'sm' ? 'P' : sz === 'base' ? 'M' : sz === 'lg' ? 'G' : 'GG'}
                    </button>
                  ))}
                </div>

                {/* Peso da Fonte */}
                <div className="flex items-center gap-1 border-l border-white/20 pl-2">
                  <span className="text-[#AFC0FF] text-[10px]">Peso:</span>
                  {(['normal', 'medium', 'semibold', 'bold'] as const).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => updateSobreTypography('fontWeight', w)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        fontWeightKey === w
                          ? 'bg-[#D4FF3A] text-[#0F1222] font-black'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {w === 'normal' ? 'Normal' : w === 'medium' ? 'Médio' : w === 'semibold' ? 'Semi' : 'Bold'}
                    </button>
                  ))}
                </div>

                {/* Tamanho do Título */}
                <div className="flex items-center gap-1 border-l border-white/20 pl-2">
                  <span className="text-[#AFC0FF] text-[10px]">Título:</span>
                  {(['sm', 'base', 'lg', 'xl'] as const).map((ts) => (
                    <button
                      key={ts}
                      type="button"
                      onClick={() => updateSobreTypography('titleSize', ts)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        titleSizeKey === ts
                          ? 'bg-[#D4FF3A] text-[#0F1222] font-black'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      title={`Título ${ts.toUpperCase()}`}
                    >
                      {ts === 'sm' ? 'P' : ts === 'base' ? 'M' : ts === 'lg' ? 'G' : 'GG'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Título Principal: Editável em tempo real no Modo Edição */}
            {isEditMode ? (
              <div className="space-y-1">
                <label className="text-[10px] font-mono-code text-[#D4FF3A] font-bold flex items-center gap-1">
                  <Type className="w-3 h-3" /> Título Principal da Seção:
                </label>
                <input
                  type="text"
                  value={currentTitle}
                  onChange={(e) => updateSobreField('title', e.target.value)}
                  className={`w-full font-disp font-extrabold ${titleSizeClass} tracking-[-0.03em] text-white bg-black/40 border border-[#D4FF3A] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#D4FF3A] leading-tight`}
                  placeholder="Quem é do Méier não bobéia."
                />
              </div>
            ) : (
              <div>
                <h2 className={`font-disp font-extrabold ${titleSizeClass} tracking-[-0.03em] text-white leading-[1.08] relative break-words`}>
                  <span className="text-[#D4FF3A] font-serif select-none mr-1.5 inline-block -translate-y-0.5">“</span>
                  {currentTitle}
                  <span className="text-[#D4FF3A] font-serif select-none ml-1.5 inline-block -translate-y-0.5">”</span>
                </h2>
              </div>
            )}

            {/* Parágrafos da Biografia com Estilização Dinâmica */}
            {isEditMode ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-code text-[#D4FF3A] uppercase tracking-wider font-bold">
                    Biografia Narrativa (Edição Completa):
                  </span>
                  <span className="text-[11px] font-mono-code text-[#AFC0FF]">
                    Pressione Enter para quebrar parágrafos
                  </span>
                </div>
                <textarea
                  value={narrativeParagraphs.join('\n\n')}
                  rows={5}
                  onChange={(e) => {
                    const fullText = e.target.value;
                    const paras = fullText.split(/\n\s*\n/).filter((p) => p.trim());
                    updateSobreField('bio', [currentTitle, ...paras]);
                  }}
                  className={`w-full ${bodySizeClass} ${bodyWeightClass} leading-relaxed bg-black/35 border-2 border-dashed border-[#D4FF3A] p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF3A] resize-y min-h-[140px] whitespace-pre-wrap font-sans`}
                  placeholder="Escreva a narrativa aqui. Pressione Enter para criar novos parágrafos livremente..."
                />
              </div>
            ) : (
              <div className={`space-y-2 ${bodySizeClass} ${bodyWeightClass} leading-relaxed text-white/95`}>
                {narrativeParagraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className={
                      idx === narrativeParagraphs.length - 1
                        ? 'text-white/85 italic font-serif-it'
                        : 'text-white/95'
                    }
                  >
                    {para}
                  </p>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* RODAPÉ DE MÉTRICAS: Empilhado verticalmente com efeito hover verde neon */}
        <div className="pt-2.5 sm:pt-3 border-t border-white/20 mt-auto pb-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            
            {/* 1º: REPERTÓRIO */}
            {isEditMode ? (
              <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/20">
                <span className="text-[9px] font-mono-code text-[#D4FF3A] font-bold block uppercase tracking-wider">
                  Repertório (50+):
                </span>
                <input
                  type="text"
                  value={sobre.stats?.stat2Number || ''}
                  onChange={(e) => updateSobreStat('stat2Number', e.target.value)}
                  className="font-disp text-2xl font-extrabold text-white bg-transparent border-b border-white/40 focus:outline-none w-full"
                  placeholder="50+"
                />
                <input
                  type="text"
                  value={sobre.stats?.stat2Label || ''}
                  onChange={(e) => updateSobreStat('stat2Label', e.target.value)}
                  className="text-white text-[11px] font-mono-code font-bold uppercase tracking-wider bg-transparent border-b border-white/20 focus:outline-none w-full"
                  placeholder="marcas atendidas"
                />
                <input
                  type="text"
                  value={sobre.stats?.stat2Sub || ''}
                  onChange={(e) => updateSobreStat('stat2Sub', e.target.value)}
                  className="text-[#AFC0FF] text-[10px] font-mono-code bg-transparent border-b border-white/20 focus:outline-none w-full"
                  placeholder="nacionais e multinacionais"
                />
              </div>
            ) : (
              <div className="flex flex-col space-y-1.5">
                <span className="font-disp text-xs sm:text-sm lg:text-[15px] text-white uppercase tracking-[0.14em] font-black block leading-none">
                  REPERTÓRIO
                </span>
                <span className="font-disp text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-extrabold tracking-tight text-white transition-colors duration-300 hover:text-[#D4FF3A] cursor-pointer block leading-none pt-0.5">
                  {sobre.stats?.stat2Number || '50+'}
                </span>
                <div className="space-y-0.5 pt-1">
                  <span className="text-white text-[10px] sm:text-[11px] font-mono-code font-bold uppercase tracking-wider block leading-tight">
                    {sobre.stats?.stat2Label || 'marcas atendidas'}
                  </span>
                  <span className="text-[#AFC0FF] text-[10px] sm:text-[11px] font-mono-code block leading-tight">
                    {sobre.stats?.stat2Sub || 'nacionais e multinacionais'}
                  </span>
                </div>
              </div>
            )}

            {/* 2º: TURNÊS */}
            {isEditMode ? (
              <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/20">
                <span className="text-[9px] font-mono-code text-[#D4FF3A] font-bold block uppercase tracking-wider">
                  Turnês (3 + 3):
                </span>
                <input
                  type="text"
                  value={sobre.stats?.stat3Number || ''}
                  onChange={(e) => updateSobreStat('stat3Number', e.target.value)}
                  className="font-disp text-2xl font-extrabold text-white bg-transparent border-b border-white/40 focus:outline-none w-full"
                  placeholder="3 + 3"
                />
                <input
                  type="text"
                  value={sobre.stats?.stat3Label || ''}
                  onChange={(e) => updateSobreStat('stat3Label', e.target.value)}
                  className="text-white text-[11px] font-mono-code font-bold uppercase tracking-wider bg-transparent border-b border-white/20 focus:outline-none w-full"
                  placeholder="praças & países"
                />
                <input
                  type="text"
                  value={sobre.stats?.stat3Sub || ''}
                  onChange={(e) => updateSobreStat('stat3Sub', e.target.value)}
                  className="text-[#AFC0FF] text-[10px] font-mono-code bg-transparent border-b border-white/20 focus:outline-none w-full"
                  placeholder="RJ, Sul, SP · Brasil, EUA & Espanha"
                />
              </div>
            ) : (
              <div className="flex flex-col space-y-1.5">
                <span className="font-disp text-xs sm:text-sm lg:text-[15px] text-white uppercase tracking-[0.14em] font-black block leading-none">
                  TURNÊS
                </span>
                <span className="font-disp text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-extrabold tracking-tight text-white transition-colors duration-300 hover:text-[#D4FF3A] cursor-pointer block leading-none pt-0.5">
                  {sobre.stats?.stat3Number || '3 + 3'}
                </span>
                <div className="space-y-0.5 pt-1">
                  <span className="text-white text-[10px] sm:text-[11px] font-mono-code font-bold uppercase tracking-wider block leading-tight">
                    {sobre.stats?.stat3Label || 'praças & países'}
                  </span>
                  <span className="text-[#AFC0FF] text-[10px] sm:text-[11px] font-mono-code block leading-tight">
                    {sobre.stats?.stat3Sub || 'RJ, Sul, SP · Brasil, EUA & Espanha'}
                  </span>
                </div>
              </div>
            )}

            {/* 3º: BAGAGEM */}
            {isEditMode ? (
              <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-[#D4FF3A]/40">
                <span className="text-[9px] font-mono-code text-[#D4FF3A] font-bold block uppercase tracking-wider">
                  Bagagem (15+):
                </span>
                <input
                  type="text"
                  value={sobre.stats?.stat1Number || ''}
                  onChange={(e) => updateSobreStat('stat1Number', e.target.value)}
                  className="font-disp text-2xl font-extrabold text-white bg-transparent border-b border-[#D4FF3A]/40 focus:outline-none w-full"
                  placeholder="15+"
                />
                <input
                  type="text"
                  value={sobre.stats?.stat1Label || ''}
                  onChange={(e) => updateSobreStat('stat1Label', e.target.value)}
                  className="text-white text-[11px] font-mono-code font-bold uppercase tracking-wider bg-transparent border-b border-white/20 focus:outline-none w-full"
                  placeholder="anos de estrada"
                />
                <input
                  type="text"
                  value={sobre.stats?.stat1Sub || ''}
                  onChange={(e) => updateSobreStat('stat1Sub', e.target.value)}
                  className="text-[#AFC0FF] text-[10px] font-mono-code bg-transparent border-b border-white/20 focus:outline-none w-full"
                  placeholder="e muita história pra contar"
                />
              </div>
            ) : (
              <div className="flex flex-col space-y-1.5">
                <span className="font-disp text-xs sm:text-sm lg:text-[15px] text-white uppercase tracking-[0.14em] font-black block leading-none">
                  BAGAGEM
                </span>
                <span className="font-disp text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-extrabold tracking-tight text-white transition-colors duration-300 hover:text-[#D4FF3A] cursor-pointer block leading-none pt-0.5">
                  {sobre.stats?.stat1Number || '15+'}
                </span>
                <div className="space-y-0.5 pt-1">
                  <span className="text-white text-[10px] sm:text-[11px] font-mono-code font-bold uppercase tracking-wider block leading-tight">
                    {sobre.stats?.stat1Label || 'anos de estrada'}
                  </span>
                  <span className="text-[#AFC0FF] text-[10px] sm:text-[11px] font-mono-code block leading-tight">
                    {sobre.stats?.stat1Sub || 'e muita história pra contar'}
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};

export default SobreSection;