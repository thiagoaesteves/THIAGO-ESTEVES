import React from 'react';
import { ORIGINAL_SOBRE_DATA } from '../data/sobre';
import { MapPin } from 'lucide-react';

export const SobreSection: React.FC = () => {
  const sobre = ORIGINAL_SOBRE_DATA;

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
              <img
                src={sobre.photoUrl}
                alt={`${sobre.name} · ${sobre.role}`}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 absolute inset-0"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

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
            
            {/* Header: Tag + Stylized Quote Headline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4FF3A]" />
                <span className="font-mono-code text-xs uppercase tracking-widest text-[#D4FF3A] font-bold">
                  {sobre.tagline}
                </span>
              </div>

              {/* Title with Stylized Quote Marks */}
              <h2 className="font-disp font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] tracking-[-0.035em] text-white leading-[1.08] relative">
                <span className="text-[#D4FF3A] font-serif select-none mr-1 inline-block -translate-y-0.5">“</span>
                {sobre.title.replace(/[“”"]/g, '')}
                <span className="text-[#D4FF3A] font-serif select-none ml-1 inline-block -translate-y-0.5">”</span>
              </h2>
            </div>

            {/* Narrative Paragraphs precisely spaced */}
            <div className="space-y-4 sm:space-y-5">
              {/* P1: Hook */}
              <p className="text-lg sm:text-xl text-white font-medium leading-relaxed antialiased">
                {narrativeParagraphs[0]}
              </p>

              {/* P2: Insight vendedor */}
              <p className="text-base sm:text-lg text-[#F6F7F2]/95 font-normal leading-relaxed antialiased">
                {narrativeParagraphs[1]}
              </p>

              {/* P3: Soft skills */}
              <p className="text-base sm:text-[17px] text-[#E0E7FF] leading-relaxed font-normal antialiased">
                {narrativeParagraphs[2]}
              </p>

              {/* P4: Trajetória */}
              <p className="text-base sm:text-[17px] text-[#C9D4FF] leading-relaxed font-normal antialiased">
                {narrativeParagraphs[3]}
              </p>

              {/* P5: Amor e arremate */}
              <p className="text-base sm:text-[17px] text-[#AFC0FF] leading-relaxed font-normal antialiased">
                {narrativeParagraphs[4]}
              </p>
            </div>

          </div>
        </div>

        {/* BOTTOM ROW: Clientes (sem box), Stats Cards & Segmentos */}
        <div className="mt-14 pt-10 border-t border-white/20 space-y-10">
          
          {/* Para quem já criei (e vendi)? - Tipografia livre e fluida */}
          <div className="space-y-3">
            <span className="font-mono-code text-xs uppercase tracking-widest text-[#D4FF3A] font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF3A]" />
              {sobre.clientsTitle}
            </span>
            <p className="text-sm sm:text-base text-[#D5DBF5] leading-relaxed font-mono-code selection:bg-[#D4FF3A] selection:text-[#0F1222] max-w-5xl">
              {sobre.clientsText}
            </p>
          </div>

          {/* Stats Triad */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* 1. Brands */}
            <div className="bg-[#1B34D6]/70 backdrop-blur-sm rounded-xl p-5 border border-white/15">
              <b className="font-disp text-4xl sm:text-5xl font-extrabold tracking-tight text-white block">
                {sobre.stats.stat1Number}
              </b>
              <span className="text-white text-xs font-mono-code uppercase tracking-wider block mt-2 font-bold">
                {sobre.stats.stat1Label}
              </span>
              <span className="text-[#AFC0FF] text-[11px] font-mono-code block mt-0.5">
                {sobre.stats.stat1Sub}
              </span>
            </div>

            {/* 2. States & Countries */}
            <div className="bg-[#1B34D6]/70 backdrop-blur-sm rounded-xl p-5 border border-white/15">
              <b className="font-disp text-4xl sm:text-5xl font-extrabold tracking-tight text-white block">
                {sobre.stats.stat2Number}
              </b>
              <span className="text-white text-xs font-mono-code uppercase tracking-wider block mt-2 font-bold">
                {sobre.stats.stat2Label}
              </span>
              <span className="text-[#AFC0FF] text-[11px] font-mono-code block mt-0.5 leading-snug">
                {sobre.stats.stat2Sub}
              </span>
            </div>

            {/* 3. Experience */}
            <div className="bg-[#1B34D6]/70 backdrop-blur-sm rounded-xl p-5 border border-[#D4FF3A]/30">
              <b className="font-disp text-4xl sm:text-5xl font-extrabold tracking-tight text-[#D4FF3A] block">
                {sobre.stats.stat3Number}
              </b>
              <span className="text-white text-xs font-mono-code uppercase tracking-wider block mt-2 font-bold">
                {sobre.stats.stat3Label}
              </span>
              <span className="text-[#AFC0FF] text-[11px] font-mono-code block mt-0.5">
                {sobre.stats.stat3Sub}
              </span>
            </div>
          </div>

          {/* Segment Keywords Cloud */}
          <div className="space-y-3 pt-2">
            <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#AFC0FF] font-semibold block">
              {sobre.segmentsTitle}
            </span>

            <div className="flex flex-wrap gap-2">
              {sobre.segments.map((segmento, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-mono-code text-[#F6F7F2] bg-white/10 hover:bg-white/15 border border-white/15 transition-all hover:border-[#D4FF3A]/40"
                >
                  {segmento}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
