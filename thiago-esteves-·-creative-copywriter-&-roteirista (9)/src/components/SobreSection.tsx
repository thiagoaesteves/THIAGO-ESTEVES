import React, { useState } from 'react';
import { MapPin, Upload, Loader2 } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { convertFileToBase64 } from '../utils/imageUpload';

export const SobreSection: React.FC = () => {
  const { isEditMode, sobre, updateSobreField } = useCms();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Let's filter out "Quem é do Méier não bobeia." from the narrative body since it is already the main H2 headline
  const narrativeParagraphs = sobre.bio.filter(
    (p) => !p.toLowerCase().includes('quem é do méier')
  );

  return (
    <section id="sobre" className="py-20 md:py-28 bg-[#2340FF] text-[#F6F7F2] relative overflow-hidden">
      {/* Editorial background ambient texture */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" 
        aria-hidden="true" 
      />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TOP ROW: Photo & Narrative Aligned in Height (desktop side-by-side) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          
          {/* Left Column: Portrait Card fills the height of the narrative */}
          <div className="md:col-span-5 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-white/20 bg-[#0F1222] group h-full min-h-[480px] lg:min-h-[560px] flex flex-col">
              {/* Author Photo */}
              <img
                src={sobre.photoUrl}
                alt={`${sobre.name} · ${sobre.role}`}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 absolute inset-0"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              {/* Edit Mode: Upload Local Photo */}
              {isEditMode && (
                <div className="absolute top-4 right-4 z-20 bg-black/85 backdrop-blur-md p-2.5 rounded-xl border border-white/20 shadow-xl max-w-[240px]">
                  <label className="text-[11px] font-mono-code text-[#D4FF3A] font-bold flex items-center gap-1.5 mb-1.5">
                    <Upload className="w-3.5 h-3.5" /> Trocar Foto (Local):
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
                    className="text-[10px] font-mono-code text-white file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-[#2340FF] file:text-white cursor-pointer w-full"
                  />
                  {isUploadingPhoto && (
                    <span className="text-[10px] font-mono-code text-[#D4FF3A] flex items-center gap-1 mt-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Convertendo...
                    </span>
                  )}
                </div>
              )}

              {/* Gradient overlay for text contrast at the bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1222]/95 via-[#0F1222]/30 to-transparent pointer-events-none" />

              {/* Author caption pinned at bottom */}
              <div className="mt-auto relative z-10 p-6 sm:p-7 space-y-1.5">
                <span className="inline-flex items-center gap-1.5 font-mono-code text-[11px] uppercase tracking-widest text-[#D4FF3A] font-semibold">
                  <MapPin className="w-3 h-3 text-[#D4FF3A]" />
                  {sobre.badge}
                </span>
                
                <div className="font-disp font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                  {sobre.name}
                </div>
                
                <p className="font-serif-it text-sm sm:text-base text-[#AFC0FF] italic">
                  {sobre.role}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Body balanced to match photo height */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Header: Tag + Stylized Quote Headline (Sem bolinhas/bullets) */}
            <div className="space-y-3">
              <span className="font-mono-code text-xs uppercase tracking-widest text-[#D4FF3A] font-bold block">
                {sobre.tagline}
              </span>

              {/* Title with Stylized Quote Marks */}
              <h2 className="font-disp font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] tracking-[-0.035em] text-white leading-[1.08] relative">
                <span className="text-[#D4FF3A] font-serif select-none mr-1 inline-block -translate-y-0.5">“</span>
                Quem é do Méier não bobeia.
                <span className="text-[#D4FF3A] font-serif select-none ml-1 inline-block -translate-y-0.5">”</span>
              </h2>
            </div>

            {/* Narrative Paragraphs precisely spaced */}
            {isEditMode ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-code text-[#D4FF3A] uppercase tracking-wider font-bold">
                    Biografia Narrativa (Edição Unificada):
                  </span>
                  <span className="text-[11px] font-mono-code text-[#AFC0FF]">
                    Pressione Enter para quebrar parágrafos
                  </span>
                </div>
                <textarea
                  value={narrativeParagraphs.join('\n\n')}
                  rows={Math.max(8, narrativeParagraphs.join('\n\n').split('\n').length + 2)}
                  onChange={(e) => {
                    const fullText = e.target.value;
                    const paras = fullText.split(/\n\s*\n/).filter((p) => p.trim());
                    updateSobreField('bio', paras);
                  }}
                  className="w-full text-base sm:text-lg leading-relaxed bg-black/30 border-2 border-dashed border-[#D4FF3A] p-4 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF3A] font-normal resize-y min-h-[220px] whitespace-pre-wrap font-sans"
                  placeholder="Escreva a narrativa aqui. Pressione Enter para criar novos parágrafos livremente..."
                />
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                {narrativeParagraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className={`leading-relaxed font-normal antialiased whitespace-pre-line ${
                      idx === 0
                        ? 'text-lg sm:text-xl text-white font-medium'
                        : idx === 1
                        ? 'text-base sm:text-lg text-[#F6F7F2]/95'
                        : idx === 2
                        ? 'text-base sm:text-[17px] text-[#E0E7FF]'
                        : idx === 3
                        ? 'text-base sm:text-[17px] text-[#C9D4FF]'
                        : 'text-base sm:text-[17px] text-[#AFC0FF]'
                    }`}
                  >
                    {para}
                  </p>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* BOTTOM ROW: Clientes (sem box), Stats Cards & Segmentos */}
        <div className="mt-14 pt-10 border-t border-white/20 space-y-10">
          
          {/* Para quem já criei (e vendi)? - Tipografia limpa sem bullets */}
          <div className="space-y-3">
            <span className="font-mono-code text-xs uppercase tracking-widest text-[#D4FF3A] font-bold block">
              {sobre.clientsTitle}
            </span>
            {isEditMode ? (
              <textarea
                value={sobre.clientsText}
                rows={3}
                onChange={(e) => updateSobreField('clientsText', e.target.value)}
                className="w-full text-sm sm:text-base text-white bg-black/30 border-2 border-dashed border-[#D4FF3A] p-3 rounded-lg font-mono-code focus:outline-none focus:ring-2 focus:ring-[#D4FF3A]"
                placeholder="Clientes separados por /"
              />
            ) : (
              <p className="text-sm sm:text-base text-[#E0E7FF] leading-relaxed font-mono-code selection:bg-[#D4FF3A] selection:text-[#0F1222] max-w-5xl">
                {sobre.clientsText.split(' / ').map((client, cIdx, arr) => (
                  <React.Fragment key={cIdx}>
                    <span className="hover:text-white transition-colors duration-150">{client}</span>
                    {cIdx < arr.length - 1 && (
                      <span className="text-[#D4FF3A] mx-2 font-mono font-bold select-none opacity-80">/</span>
                    )}
                  </React.Fragment>
                ))}
              </p>
            )}
          </div>

          {/* Stats Triad - Sem caixas / sem boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-4 border-t border-white/15">
            {/* 1. Brands */}
            <div className="space-y-1">
              <b className="font-disp text-4xl sm:text-5xl font-extrabold tracking-tight text-white block">
                {sobre.stats.stat1Number}
              </b>
              <span className="text-white text-xs font-mono-code uppercase tracking-wider block mt-2 font-bold">
                {sobre.stats.stat1Label}
              </span>
              <span className="text-[#AFC0FF] text-xs font-mono-code block mt-0.5">
                {sobre.stats.stat1Sub}
              </span>
            </div>

            {/* 2. States & Countries */}
            <div className="space-y-1 sm:border-l sm:border-white/15 sm:pl-8">
              <b className="font-disp text-4xl sm:text-5xl font-extrabold tracking-tight text-white block">
                {sobre.stats.stat2Number}
              </b>
              <span className="text-white text-xs font-mono-code uppercase tracking-wider block mt-2 font-bold">
                {sobre.stats.stat2Label}
              </span>
              <span className="text-[#AFC0FF] text-xs font-mono-code block mt-0.5 leading-snug">
                {sobre.stats.stat2Sub}
              </span>
            </div>

            {/* 3. Experience */}
            <div className="space-y-1 sm:border-l sm:border-white/15 sm:pl-8">
              <b className="font-disp text-4xl sm:text-5xl font-extrabold tracking-tight text-[#D4FF3A] block">
                {sobre.stats.stat3Number}
              </b>
              <span className="text-white text-xs font-mono-code uppercase tracking-wider block mt-2 font-bold">
                {sobre.stats.stat3Label}
              </span>
              <span className="text-[#AFC0FF] text-xs font-mono-code block mt-0.5">
                {sobre.stats.stat3Sub}
              </span>
            </div>
          </div>

          {/* Segmentos Atendidos (Lista limpa, sem bullets/ícones, puro espaçamento tipográfico) */}
          <div className="space-y-4 pt-4 border-t border-white/15">
            <span className="font-mono-code text-xs uppercase tracking-widest text-[#D4FF3A] font-bold block">
              {sobre.segmentsTitle}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-2.5 sm:gap-y-3">
              {sobre.segments.map((segmento, idx) => (
                <div
                  key={idx}
                  className="font-mono-code text-xs sm:text-[13px] text-[#D5DBF5] hover:text-white transition-colors duration-150 py-0.5"
                >
                  {segmento}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
