import React from 'react';

const SEGMENTS: string[] = [
  'Beleza & Cosméticos',
  'Finanças & Bancos',
  'Tech & Telecom',
  'Automotivo & Linha Pesada',
  'Saúde & Farma',
  'Alimentos & Bebidas',
  'Varejo & Moda',
  'Bens de Consumo & Indústria',
  'Educação & Idiomas',
  'Esportes & Futebol',
  'Imobiliário & Hotelaria',
  'Governo & Cidadania',
];

export const SegmentosSection: React.FC = () => {
  // Duplicar os 12 segmentos para 24 por repetição garante que a largura física
  // coincida exatamente com a largura das marcas, mantendo a velocidade linear
  // (pixels por segundo) idêntica entre os dois marquees.
  const segmentsSequence = [...SEGMENTS, ...SEGMENTS];

  return (
    <section
      id="segmentos"
      aria-label="Segmentos atendidos"
      className="bg-[#0F1222] text-[#F6F7F2] py-8 sm:py-10 border-b border-[#262A3D] select-none relative z-20"
    >
      {/* Título / Microcopy exatamente com tipografia, cor verde limão (#D4FF3A) e espaçamento da seção de marcas */}
      <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-4 sm:mb-5">
        <span className="font-mono-code text-xs sm:text-[13px] uppercase tracking-widest text-[#D4FF3A] font-bold block">
          Quais segmentos já atendi (e vendi)?
        </span>
      </div>

      {/* Letreiro Animado (Marquee) Contínuo dos Segmentos */}
      <div
        aria-label="Lista de segmentos atendidos"
        className="overflow-hidden py-4 sm:py-5 border-y border-white/10 select-none bg-black/30 relative"
      >
        {/* Gradientes sutis para fade nas extremidades */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#0F1222] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#0F1222] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee items-center text-lg sm:text-xl lg:text-2xl font-bold tracking-tight font-disp">
          {/* Repetição 1 */}
          <div className="flex items-center gap-6 sm:gap-8 pr-6 sm:pr-8 shrink-0">
            {segmentsSequence.map((segment, i) => (
              <React.Fragment key={`seg-1-${i}`}>
                <span className="text-[#F6F7F2] hover:text-[#D4FF3A] transition-colors whitespace-nowrap cursor-default">
                  {segment}
                </span>
                <span className="text-[#D4FF3A] text-xs sm:text-sm font-mono-code font-bold select-none opacity-80" aria-hidden="true">
                  +
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Repetição 2 para looping infinito sem corte */}
          <div className="flex items-center gap-6 sm:gap-8 pr-6 sm:pr-8 shrink-0">
            {segmentsSequence.map((segment, i) => (
              <React.Fragment key={`seg-2-${i}`}>
                <span className="text-[#F6F7F2] hover:text-[#D4FF3A] transition-colors whitespace-nowrap cursor-default">
                  {segment}
                </span>
                <span className="text-[#D4FF3A] text-xs sm:text-sm font-mono-code font-bold select-none opacity-80" aria-hidden="true">
                  +
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SegmentosSection;
