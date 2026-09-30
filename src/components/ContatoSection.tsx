import React from 'react';
import { Mail, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';

export const ContatoSection: React.FC = () => {
  return (
    <section id="contato" className="py-20 sm:py-28 md:py-36 bg-[#0F1222] text-[#F6F7F2] relative overflow-hidden">
      <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline & Links */}
          <div className="lg:col-span-7">
            <span className="font-mono-code text-xs uppercase tracking-widest text-[#FF4FA0] font-bold block mb-3 sm:mb-4">
              Contato
            </span>

            <h2 className="font-disp font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-[-0.04em] leading-[0.94] text-white">
              Vamos<br />conversar?
            </h2>

            {/* CTA Links */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-10">
              {/* Email button in Faixa style */}
              <a
                id="link-contato-email"
                href="mailto:thiagoaesteves@gmail.com"
                className="faixa-clip bg-[#D4FF3A] hover:bg-white text-[#0F1222] text-sm sm:text-base md:text-lg lg:text-xl font-bold py-2.5 sm:py-3 px-4 sm:px-6 shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-2 max-w-full break-all sm:break-normal cursor-pointer"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>thiagoaesteves@gmail.com</span>
              </a>

              {/* Social links */}
              <div className="flex items-center gap-5 sm:gap-6 font-mono-code text-xs sm:text-sm uppercase tracking-widest">
                <a
                  id="link-contato-linkedin"
                  href="https://www.linkedin.com/in/thiagoaesteves/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F6F7F2] hover:text-[#FF4FA0] pb-1 border-b-2 border-[#FF4FA0] transition-colors flex items-center gap-1 font-semibold min-h-[44px]"
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
                  className="text-[#F6F7F2] hover:text-[#FF4FA0] pb-1 border-b-2 border-[#FF4FA0] transition-colors flex items-center gap-1 font-semibold min-h-[44px]"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Ultra-clean Typographic Statement (No Box) */}
          <div className="lg:col-span-5 flex lg:justify-end mt-4 lg:mt-0">
            <div className="max-w-md space-y-4 sm:space-y-6">
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

              {/* Location */}
              <p className="font-mono-code text-xs text-[#AFC0FF]/80 uppercase tracking-wider">
                Based in Brazil · Available worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
