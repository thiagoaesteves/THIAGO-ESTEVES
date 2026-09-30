import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (targetId === 'topo') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', '#topo');
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 70;
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#2340FF] text-[#F6F7F2] border-b border-[#3b55ff] transition-all shadow-md">
      <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a
            id="brand-logo-link"
            href="#topo"
            onClick={(e) => handleNavClick(e, 'topo')}
            className="flex items-center gap-3 text-xl font-bold tracking-tight text-[#F6F7F2] hover:opacity-95 transition-opacity cursor-pointer select-none"
            aria-label="Thiago Esteves - Início"
          >
            <svg
              className="w-8 h-6 flex-shrink-0"
              viewBox="0 0 31.93 24"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="headerGrad" x1="47.97" x2="77.22" y1="21.49" y2="21.49" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#D4D4D0" />
                  <stop offset="0.15" stopColor="#E5E6E1" />
                  <stop offset="0.33" stopColor="#F1F2ED" />
                  <stop offset="1" stopColor="#F6F7F2" />
                </linearGradient>
              </defs>
              <g transform="translate(-2.109 -6.064) scale(0.44069)">
                <path
                  d="m16.65 14.92-11.29 11.21c-1.23 1.2-0.35 3.04 1.36 3.04h21.32c1.09 0 2.12-0.46 2.88-1.23l14.08-14.18h-25.71c-1.02 0-1.94 0.46-2.64 1.16z"
                  fill="#F6F7F2"
                />
                <path
                  d="m75.51 13.76h-25.59c-1.18 0-2.31 0.49-3.14 1.33l-11.64 11.67c-0.79 0.75-1.15 1.85-1.15 2.92v36.57c0 1.84 1.92 2.6 3.2 1.37l9.83-9.66c0.7-0.7 1-1.6 1-2.58v-26.21h14.67c1.13 0 2.15-0.54 2.95-1.35l11.04-10.97c1.15-1.14 0.39-3.09-1.17-3.09z"
                  fill="#F6F7F2"
                />
                <path
                  d="m75.51 13.76h-23.63c-2.17 0-3.9 1.74-3.9 4.05v11.36h14.71c1.13 0 2.15-0.54 2.95-1.35l11.04-10.97c1.15-1.14 0.39-3.09-1.17-3.09z"
                  fill="url(#headerGrad)"
                />
              </g>
            </svg>
            <span className="font-disp tracking-[-0.02em] text-lg sm:text-xl font-bold">
              Thiago Esteves
            </span>
          </a>

          {/* Navigation Links Desktop */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 font-mono-code text-xs uppercase tracking-wider">
            <a
              id="nav-lado-a"
              href="#lado-a"
              onClick={(e) => handleNavClick(e, 'lado-a')}
              className="text-[#F6F7F2] hover:text-[#D4FF3A] transition-colors font-medium cursor-pointer py-1"
            >
              Lado A
            </a>
            <a
              id="nav-lado-b"
              href="#lado-b"
              onClick={(e) => handleNavClick(e, 'lado-b')}
              className="text-[#F6F7F2] hover:text-[#FF4FA0] transition-colors font-medium cursor-pointer py-1"
            >
              Lado B
            </a>
            <a
              id="nav-bonus"
              href="#faixa-bonus"
              onClick={(e) => handleNavClick(e, 'faixa-bonus')}
              className="text-[#F6F7F2] hover:text-[#D4FF3A] transition-colors font-medium cursor-pointer py-1"
            >
              Bônus
            </a>
            <a
              id="nav-servicos"
              href="#servicos"
              onClick={(e) => handleNavClick(e, 'servicos')}
              className="text-[#F6F7F2] hover:text-[#D4FF3A] transition-colors font-medium cursor-pointer py-1"
            >
              Serviços
            </a>
            <a
              id="nav-sobre"
              href="#sobre"
              onClick={(e) => handleNavClick(e, 'sobre')}
              className="text-[#F6F7F2] hover:text-[#D4FF3A] transition-colors font-medium cursor-pointer py-1"
            >
              Sobre
            </a>
            <a
              id="nav-contato"
              href="#contato"
              onClick={(e) => handleNavClick(e, 'contato')}
              className="faixa-clip bg-[#D4FF3A] text-[#0F1222] hover:bg-white transition-all transform hover:-translate-y-0.5 font-bold cursor-pointer ml-1"
            >
              Contato
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              id="btn-mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F6F7F2] hover:bg-[#1B34D6] rounded min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer transition-colors"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <nav
            aria-label="Navegação mobile"
            className="md:hidden mt-3 pt-3 border-t border-[#6F85FF]/40 flex flex-col font-mono-code text-sm animate-fade-in"
          >
            <a
              href="#lado-a"
              onClick={(e) => handleNavClick(e, 'lado-a')}
              className="text-[#F6F7F2] py-3 min-h-[44px] flex items-center border-b border-white/10 active:text-[#D4FF3A]"
            >
              Lado A
            </a>
            <a
              href="#lado-b"
              onClick={(e) => handleNavClick(e, 'lado-b')}
              className="text-[#F6F7F2] py-3 min-h-[44px] flex items-center border-b border-white/10 active:text-[#FF4FA0]"
            >
              Lado B
            </a>
            <a
              href="#faixa-bonus"
              onClick={(e) => handleNavClick(e, 'faixa-bonus')}
              className="text-[#D4FF3A] py-3 min-h-[44px] flex items-center border-b border-white/10 font-bold"
            >
              Bônus
            </a>
            <a
              href="#servicos"
              onClick={(e) => handleNavClick(e, 'servicos')}
              className="text-[#F6F7F2] py-3 min-h-[44px] flex items-center border-b border-white/10 active:text-[#D4FF3A]"
            >
              Serviços
            </a>
            <a
              href="#sobre"
              onClick={(e) => handleNavClick(e, 'sobre')}
              className="text-[#F6F7F2] py-3 min-h-[44px] flex items-center border-b border-white/10 active:text-[#D4FF3A]"
            >
              Sobre
            </a>
            <div className="pt-3 pb-1">
              <a
                href="#contato"
                onClick={(e) => handleNavClick(e, 'contato')}
                className="faixa-clip bg-[#D4FF3A] text-[#0F1222] text-center block w-full py-3 min-h-[44px] font-bold"
              >
                Contato
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
