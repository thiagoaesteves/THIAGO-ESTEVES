import React from 'react';
import { Mail, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';

export const ContatoSection: React.FC = () => {
  return (
    <section id="contato" className="pt-10 pb-16 sm:pt-14 sm:pb-20 md:pt-16 md:pb-24 bg-[#0F1222] text-[#F6F7F2] relative overflow-hidden">
      {/* Importação da fonte manuscrita para o efeito de caligrafia */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');
        .font-handwriting {
          font-family: 'Caveat', cursive;
        }
      `}</style>

      <div className="max-w-[1320px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full">
          
          {/* Left Column: Headline & Links */}
          <div className="lg:col-span-7 w-full">
            <span className="font-mono-code text-xs uppercase tracking-widest text-[#FF4FA0] font-bold block mb-2 sm:mb-3">
              Curtiu?
            </span>

            <h2 className="font-disp font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-[-0.04em] leading-[0.96] text-white">
              Vamos<br />conversar?
            </h2>

            {/* CTA Container */}
            <div className="flex flex-col items-start gap-4 sm:gap-5 mt-6 sm:mt-8">
              
              {/* WhatsApp Button */}
              <a
                id="link-contato-whatsapp"
                href="https://wa.me/5521988871110?text=Olá%20Thiago,%20vi%20seu%20portfólio%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto."
                target="_blank"
                rel="noopener noreferrer"
                className="faixa-clip bg-[#D4FF3A] text-[#0F1222] text-sm sm:text-base md:text-lg lg:text-xl font-bold py-2.5 sm:py-3 px-5 sm:px-7 shadow-xl transition-all transform hover:-translate-y-1 inline-flex items-center gap-2.5 cursor-pointer w-fit"
              >
                <span>DESENROLAR AGORA</span>
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>

              {/* Email, LinkedIn e Instagram lado a lado */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono-code text-xs sm:text-sm tracking-widest pt-1">
                <a
                  id="link-contato-email"
                  href="mailto:desenrola@thiagoesteves.com"
                  className="text-[#F6F7F2] hover:text-[#FF4FA0] pb-1 border-b-2 border-[#FF4FA0] transition-colors flex items-center gap-1.5 font-semibold lowercase"
                >
                  <Mail className="w-4 h-4" />
                  <span>desenrola@thiagoesteves.com</span>
                </a>

                <a
                  id="link-contato-linkedin"
                  href="https://www.linkedin.com/in/thiagoaesteves/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F6F7F2] hover:text-[#FF4FA0] pb-1 border-b-2 border-[#FF4FA0] transition-colors flex items-center gap-1.5 font-semibold uppercase"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  id="link-contato-instagram"
                  href="https://www.instagram.com/thiagoeesteves/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F6F7F2] hover:text-[#FF4FA0] pb-1 border-b-2 border-[#FF4FA0] transition-colors flex items-center gap-1.5 font-semibold uppercase"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex lg:justify-end mt-4 lg:mt-0 w-full">
            <div className="w-full lg:max-w-md space-y-3 sm:space-y-5">
              
              {/* Live Status Indicator */}
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4FF3A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4FF3A]"></span>
                </span>
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#D4FF3A] font-bold">
                  Status
                </span>
                <span className="text-white/20">·</span>
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-white/40">
                  BR [UTC-3]
                </span>
              </div>

              {/* Main Statement */}
              <p className="font-disp font-semibold text-xl sm:text-2xl md:text-3xl text-white tracking-tight leading-snug">
                Open for full-time opportunities &amp; freelance projects.
              </p>

              {/* Retorno à font-disp original com escala ajustada e flexível para mobile e telas grandes */}
              <p className="font-disp font-semibold text-xs min-[400px]:text-sm sm:text-base md:text-lg lg:text-xl tracking-tight uppercase flex items-center flex-wrap sm:flex-nowrap gap-x-2" style={{ color: '#AFC0FF' }}>
                <span>BORN TO ERREJOTA · OPEN TO</span>
                
                {/* WORK em azul exato com risco manual em rosa */}
                <span className="relative inline-block font-semibold px-1" style={{ color: '#AFC0FF' }}>
                  WORK
                  <span className="absolute inset-x-[-3px] top-1/2 -translate-y-1/2 h-[2.5px] bg-[#FF4FA0] -rotate-6 rounded-full pointer-events-none"></span>
                </span>
                
                {/* WORLD em fonte caligráfica manuscrita rosa */}
                <span className="font-handwriting text-2xl sm:text-3xl md:text-4xl text-[#FF4FA0] font-bold normal-case tracking-normal rotate-3 transform inline-block translate-y-[-1px]">
                  world
                </span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContatoSection;