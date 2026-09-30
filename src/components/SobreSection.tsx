import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { convertFileToBase64 } from '../utils/imageUpload';

export const SobreSection: React.FC = () => {
  const { isEditMode, sobre, updateSobreField } = useCms();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Let's filter out "Quem é do Méier não bobéia." from the narrative body since it is already the main H2 headline
  const narrativeParagraphs = sobre.bio.filter(
    (p) => !p.toLowerCase().includes('quem é do méier')
  );

  return (
    <section id="sobre" className="py-16 sm:py-20 md:py-28 bg-[#2340FF] text-[#F6F7F2] relative overflow-hidden">
      {/* Editorial background ambient texture */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" 
        aria-hidden="true" 
      />

      <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* TOP ROW: Photo & Narrative Aligned (desktop side-by-side) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Portrait Card with elegant aspect-[4/5] ratio */}
          <div className="md:col-span-5 flex flex-col">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-white/20 bg-[#0F1222] group flex flex-col">
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1222]/95 via-[#0F1222]/45 to-transparent pointer-events-none" />

              {/* Author caption pinned at bottom left */}
              <div className="mt-auto relative z-10 p-5 sm:p-6 lg:p-7 flex flex-col items-start text-left">
                {/* 1. Nome */}
                <div className="font-disp font-extrabold text-2xl sm:text-3xl lg:text-[34px] text-white tracking-tight leading-tight">
                  {sobre.name}
                </div>

                {/* 2. Cargo: diretamente ligado ao nome, tipografia aumentada */}
                <p className="font-serif-it text-base sm:text-lg lg:text-[21px] text-[#AFC0FF] italic leading-snug mt-1">
                  {sobre.role}
                </p>

                {/* 3. Localização / Status: diretamente abaixo do cargo, fonte aumentada para alta legibilidade */}
                <span className="font-mono-code text-xs sm:text-[13px] uppercase tracking-wider text-[#D4FF3A] font-semibold block leading-normal mt-2.5 sm:mt-3 select-none">
                  {sobre.badge}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Body balanced to match photo height */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Headline with Stylized Quote Marks */}
            <div>
              <h2 className="font-disp font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.25rem] tracking-[-0.035em] text-white leading-[1.08] relative break-words">
                <span className="text-[#D4FF3A] font-serif select-none mr-1 inline-block -translate-y-0.5">“</span>
                Quem é do Méier não bobéia.
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

        {/* BOTTOM ROW: Bloco de Métricas em Grid de 3 Colunas Limpas e Responsivas */}
        <div className="mt-14 pt-10 border-t border-white/20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-10">
            {/* 1. Anos de Estrada (15+) */}
            <div className="space-y-1.5">
              <span className="font-disp text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#D4FF3A] block">
                15+
              </span>
              <p className="text-white text-xs sm:text-sm font-mono-code font-bold uppercase tracking-wider block mt-2">
                anos de estrada
              </p>
              <span className="text-[#AFC0FF] text-xs sm:text-sm font-mono-code block mt-0.5">
                e muita história pra contar
              </span>
            </div>

            {/* 2. Marcas Atendidas (50+) */}
            <div className="space-y-1.5 sm:border-l sm:border-white/15 sm:pl-8 lg:pl-10">
              <span className="font-disp text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white block">
                50+
              </span>
              <p className="text-white text-xs sm:text-sm font-mono-code font-bold uppercase tracking-wider block mt-2">
                marcas atendidas
              </p>
              <span className="text-[#AFC0FF] text-xs sm:text-sm font-mono-code block mt-0.5">
                nacionais e multinacionais
              </span>
            </div>

            {/* 3. Praças & Países (3 + 3) */}
            <div className="space-y-1.5 sm:border-l sm:border-white/15 sm:pl-8 lg:pl-10">
              <span className="font-disp text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white block">
                3 + 3
              </span>
              <p className="text-white text-xs sm:text-sm font-mono-code font-bold uppercase tracking-wider block mt-2">
                praças &amp; países
              </p>
              <span className="text-[#AFC0FF] text-xs sm:text-sm font-mono-code block mt-0.5 leading-snug">
                RJ, Sul, SP · Brasil, EUA &amp; Espanha
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
