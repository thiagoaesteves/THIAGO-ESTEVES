import React from 'react';

interface HeroProps {
  caseCountA: number;
  caseCountB: number;
  caseCountBonus: number;
}

export const Hero: React.FC<HeroProps> = ({
  caseCountA,
  caseCountB,
  caseCountBonus,
}) => {
  return (
    <section id="topo" className="relative bg-[#2340FF] text-[#F6F7F2] overflow-hidden min-h-[calc(100dvh-64px)] flex flex-col justify-between pt-6 pb-6 md:pt-10 md:pb-8">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex flex-col justify-between">
        {/* Top Hero Row: Headline on the left, "T" Watermark Monogram on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 sm:pt-4 my-auto">
          <div className="lg:col-span-9">
            <h1 className="font-disp font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4.4rem] tracking-tight text-white leading-[1.05]">
              Creative Copywriter <br />
              <span className="font-serif-it italic font-normal text-[#D4FF3A] inline-block sm:whitespace-nowrap">
                &amp; Transmídia Storyteller
              </span>
            </h1>
          </div>

          <div className="lg:col-span-3 flex justify-center lg:justify-end items-center select-none pointer-events-none">
            <div className="w-[140px] sm:w-[170px] md:w-[200px] lg:w-[230px] aspect-[532/400]">
              <svg
                viewBox="0 0 532.13 400"
                className="w-full h-auto text-white opacity-20 hover:opacity-30 transition-opacity fill-current drop-shadow-sm"
                aria-hidden="true"
              >
                <g transform="translate(-35.145 -101.065) scale(7.34484)">
                  <path d="m16.65 14.92-11.29 11.21c-1.23 1.2-0.35 3.04 1.36 3.04h21.32c1.09 0 2.12-0.46 2.88-1.23l14.08-14.18h-25.71c-1.02 0-1.94 0.46-2.64 1.16z" />
                  <path d="m75.51 13.76h-25.59c-1.18 0-2.31 0.49-3.14 1.33l-11.64 11.67c-0.79 0.75-1.15 1.85-1.15 2.92v36.57c0 1.84 1.92 2.6 3.2 1.37l9.83-9.66c0.7-0.7 1-1.6 1-2.58v-26.21h14.67c1.13 0 2.15-0.54 2.95-1.35l11.04-10.97c1.15-1.14 0.39-3.09-1.17-3.09z" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Section: Doors Grid + Scroll Hint */}
        <div className="mt-auto pt-6 md:pt-10">
          {/* Doors Grid - 3 Columns (Lado A, Lado B, Faixa Bônus) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {/* Lado A Door */}
            <a
              id="hero-door-lado-a"
              href="#lado-a"
              className="group flex justify-between items-end gap-3 border-t border-[#6F85FF] pt-4 md:pt-5 hover:border-[#D4FF3A] transition-colors"
            >
              <div>
                <span className="font-mono-code text-xs uppercase tracking-widest text-[#D4FF3A] block mb-1">
                  Lado A · {caseCountA} faixas
                </span>
                <b className="font-disp text-2xl sm:text-3xl tracking-tight block text-white group-hover:text-[#D4FF3A] transition-colors">
                  Advertising
                </b>
                <small className="text-[#AFC0FF] text-sm block mt-0.5">
                  Filmes, campanhas &amp; títulos
                </small>
              </div>
              <span className="text-3xl text-[#D4FF3A] transform group-hover:translate-x-2 transition-transform duration-200">
                →
              </span>
            </a>

            {/* Lado B Door */}
            <a
              id="hero-door-lado-b"
              href="#lado-b"
              className="group flex justify-between items-end gap-3 border-t border-[#6F85FF] pt-4 md:pt-5 hover:border-[#FF4FA0] transition-colors"
            >
              <div>
                <span className="font-mono-code text-xs uppercase tracking-widest text-[#FF4FA0] block mb-1">
                  Lado B · {caseCountB} faixas
                </span>
                <b className="font-disp text-2xl sm:text-3xl tracking-tight block text-white group-hover:text-[#FF4FA0] transition-colors">
                  Branding
                </b>
                <small className="text-[#AFC0FF] text-sm block mt-0.5">
                  Posicionamento, naming &amp; tom de voz
                </small>
              </div>
              <span className="text-3xl text-[#FF4FA0] transform group-hover:translate-x-2 transition-transform duration-200">
                →
              </span>
            </a>

            {/* Faixa Bônus Door */}
            <a
              id="hero-door-bonus"
              href="#faixa-bonus"
              className="group flex justify-between items-end gap-3 border-t border-[#6F85FF] pt-4 md:pt-5 hover:border-[#D4FF3A] transition-colors"
            >
              <div>
                <span className="font-mono-code text-xs uppercase tracking-widest text-[#D4FF3A] block mb-1">
                  Faixa Bônus · {caseCountBonus} faixas
                </span>
                <b className="font-disp text-2xl sm:text-3xl tracking-tight block text-white group-hover:text-[#D4FF3A] transition-colors">
                  Especiais
                </b>
                <small className="text-[#AFC0FF] text-sm block mt-0.5">
                  Ativações, convenções &amp; guerrilha
                </small>
              </div>
              <span className="text-3xl text-[#D4FF3A] transform group-hover:translate-x-2 transition-transform duration-200">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
