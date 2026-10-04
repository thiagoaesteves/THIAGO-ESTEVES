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
  const handleDoorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerEl = document.querySelector('header');
      const headerOffset = headerEl ? headerEl.offsetHeight : 56;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', `#${targetId}`);
    } else {
      window.location.hash = targetId;
    }
  };

  return (
    <section id="topo" className="relative bg-[#2340FF] text-[#F6F7F2] overflow-hidden min-h-screen flex flex-col justify-between pt-20 sm:pt-22 md:pt-24 pb-6 sm:pb-8 md:pb-10 lg:pb-12">
      <div className="max-w-[1320px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 relative z-10 w-full flex-1 flex flex-col justify-between">
        {/* Top Hero Row: Headline on the left, Monumental Watermark Monogram on the right bleeding softly */}
        <div className="relative pt-2 sm:pt-4 my-auto min-h-[180px] sm:min-h-[240px] md:min-h-[280px] flex items-center">
          <div className="max-w-4xl relative z-10">
            <h1 className="font-disp font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4.5rem] 2xl:text-[5rem] tracking-tight text-white leading-[1.05] break-words">
              Creative Copywriter <br />
              <span className="font-serif-it italic font-normal text-[#D4FF3A] inline-block sm:whitespace-nowrap">
                &amp; Storyteller
              </span>
            </h1>
          </div>

          {/* Monumental Watermark: Large, architectural bleed off-canvas */}
          <div className="absolute -right-12 sm:-right-8 md:-right-4 lg:right-0 -bottom-16 sm:-bottom-20 md:-bottom-24 lg:-bottom-28 pointer-events-none select-none z-0">
            <div className="w-[240px] sm:w-[380px] md:w-[500px] lg:w-[660px] xl:w-[740px] aspect-[532/400]">
              <svg
                viewBox="0 0 532.13 400"
                className="w-full h-auto text-white opacity-[0.11] lg:opacity-[0.12] fill-current drop-shadow-sm transition-opacity duration-500"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Lado A Door */}
            <a
              id="hero-door-lado-a"
              href="#lado-a"
              onClick={(e) => handleDoorClick(e, 'lado-a')}
              className="group flex justify-between items-end gap-3 border-t border-[#6F85FF] pt-3.5 pb-2.5 sm:pt-4 sm:pb-3 md:pt-5 hover:border-[#D4FF3A] transition-colors cursor-pointer min-h-[48px]"
            >
              <div>
                <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-widest text-[#D4FF3A] block mb-1">
                  Lado A · {caseCountA} faixas
                </span>
                <b className="font-disp text-xl sm:text-2xl lg:text-3xl tracking-tight block text-white group-hover:text-[#D4FF3A] transition-colors">
                  Advertising
                </b>
                <small className="text-[#AFC0FF] text-xs sm:text-sm block mt-0.5">
                  Filmes, campanhas &amp; títulos
                </small>
              </div>
              <span className="text-2xl sm:text-3xl text-[#D4FF3A] transform group-hover:translate-x-2 transition-transform duration-200 shrink-0">
                →
              </span>
            </a>

            {/* Lado B Door */}
            <a
              id="hero-door-lado-b"
              href="#lado-b"
              onClick={(e) => handleDoorClick(e, 'lado-b')}
              className="group flex justify-between items-end gap-3 border-t border-[#6F85FF] pt-3.5 pb-2.5 sm:pt-4 sm:pb-3 md:pt-5 hover:border-[#FF4FA0] transition-colors cursor-pointer min-h-[48px]"
            >
              <div>
                <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-widest text-[#FF4FA0] block mb-1">
                  Lado B · {caseCountB} faixas
                </span>
                <b className="font-disp text-xl sm:text-2xl lg:text-3xl tracking-tight block text-white group-hover:text-[#FF4FA0] transition-colors">
                  Branding
                </b>
                <small className="text-[#AFC0FF] text-xs sm:text-sm block mt-0.5">
                  Posicionamento, naming &amp; tom de voz
                </small>
              </div>
              <span className="text-2xl sm:text-3xl text-[#FF4FA0] transform group-hover:translate-x-2 transition-transform duration-200 shrink-0">
                →
              </span>
            </a>

            {/* Faixa Bônus Door */}
            <a
              id="hero-door-bonus"
              href="#faixa-bonus"
              onClick={(e) => handleDoorClick(e, 'faixa-bonus')}
              className="group flex justify-between items-end gap-3 border-t border-[#6F85FF] pt-3.5 pb-2.5 sm:pt-4 sm:pb-3 md:pt-5 hover:border-[#D4FF3A] transition-colors cursor-pointer min-h-[48px]"
            >
              <div>
                <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-widest text-[#D4FF3A] block mb-1">
                  Faixa Bônus · {caseCountBonus} faixas
                </span>
                <b className="font-disp text-xl sm:text-2xl lg:text-3xl tracking-tight block text-white group-hover:text-[#D4FF3A] transition-colors">
                  Especiais
                </b>
                <small className="text-[#AFC0FF] text-xs sm:text-sm block mt-0.5">
                  Ideias que eram pra ser só um post
                </small>
              </div>
              <span className="text-2xl sm:text-3xl text-[#D4FF3A] transform group-hover:translate-x-2 transition-transform duration-200 shrink-0">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
