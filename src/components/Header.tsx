import React, { useState } from 'react';
import { Search, Menu, X, Pencil } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isEditMode, toggleEditMode } = useCms();

  return (
    <header className="sticky top-0 z-40 bg-[#2340FF] text-[#F6F7F2] border-b border-[#3b55ff] transition-all shadow-md">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a
            id="brand-logo-link"
            href="#topo"
            className="flex items-center gap-3 text-xl font-bold tracking-tight text-[#F6F7F2] hover:opacity-95 transition-opacity"
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
          <nav className="hidden md:flex items-center gap-6 font-mono-code text-xs uppercase tracking-wider">
            <a
              id="nav-lado-a"
              href="#lado-a"
              className="text-[#F6F7F2] hover:text-[#D4FF3A] transition-colors font-medium"
            >
              Lado A
            </a>
            <a
              id="nav-lado-b"
              href="#lado-b"
              className="text-[#F6F7F2] hover:text-[#FF4FA0] transition-colors font-medium"
            >
              Lado B
            </a>
            <a
              id="nav-bonus"
              href="#faixa-bonus"
              className="text-[#F6F7F2] hover:text-[#D4FF3A] transition-colors font-medium"
            >
              Bônus
            </a>
            <a
              id="nav-servicos"
              href="#servicos"
              className="text-[#F6F7F2] hover:text-[#D4FF3A] transition-colors font-medium"
            >
              Serviços
            </a>
            <a
              id="nav-sobre"
              href="#sobre"
              className="text-[#F6F7F2] hover:text-[#D4FF3A] transition-colors font-medium"
            >
              Sobre
            </a>

            {/* Search Toggle */}
            <button
              id="btn-nav-search-toggle"
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded hover:bg-[#1B34D6] transition-colors cursor-pointer ${
                searchQuery ? 'text-[#D4FF3A]' : 'text-[#F6F7F2]'
              }`}
              title="Buscar cases"
              aria-label="Buscar"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Edit Mode Toggle Button */}
            <button
              id="btn-nav-edit-mode"
              type="button"
              onClick={toggleEditMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono-code text-xs font-bold transition-all cursor-pointer ${
                isEditMode
                  ? 'bg-[#D4FF3A] text-[#0F1222] border-[#D4FF3A] shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-[#F6F7F2] border-white/20'
              }`}
              title={isEditMode ? 'Desativar Modo Edição' : 'Ativar Modo Edição (arraste itens e edite textos)'}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Edição Ativa' : 'Modo Edição'}</span>
            </button>

            {/* Contact CTA */}
            <a
              id="nav-contato"
              href="#contato"
              className="faixa-clip bg-[#D4FF3A] text-[#0F1222] hover:bg-white transition-all transform hover:-translate-y-0.5 font-bold"
            >
              Contato
            </a>
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="btn-mobile-search-toggle"
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#F6F7F2] hover:bg-[#1B34D6] rounded"
              title="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              id="btn-mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F6F7F2] hover:bg-[#1B34D6] rounded"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="mt-3 pt-3 border-t border-[#6F85FF]/40 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AFC0FF]" />
              <input
                id="search-input-header"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por marca, conceito, formato (ex: Vivo, Roteiro, YAMY)..."
                className="w-full pl-9 pr-8 py-2 bg-[#1B34D6] border border-[#6F85FF] rounded text-sm text-[#F6F7F2] placeholder-[#AFC0FF] focus:outline-none focus:border-[#D4FF3A]"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#AFC0FF] hover:text-white"
                >
                  Limpar
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="text-xs text-[#AFC0FF] hover:text-white px-2 py-1"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-[#6F85FF]/40 flex flex-col gap-3 font-mono-code text-sm">
            <a
              href="#lado-a"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F6F7F2] py-2 border-b border-white/10"
            >
              Lado A (Advertising)
            </a>
            <a
              href="#lado-b"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F6F7F2] py-2 border-b border-white/10"
            >
              Lado B (Branding)
            </a>
            <a
              href="#faixa-bonus"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#D4FF3A] py-2 border-b border-white/10 font-bold"
            >
              Faixa Bônus (Projetos Especiais)
            </a>
            <a
              href="#servicos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F6F7F2] py-2 border-b border-white/10"
            >
              Serviços
            </a>
            <a
              href="#sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F6F7F2] py-2 border-b border-white/10"
            >
              Sobre
            </a>
            <button
              type="button"
              onClick={() => {
                toggleEditMode();
                setMobileMenuOpen(false);
              }}
              className="text-left text-[#D4FF3A] py-2 border-b border-white/10 flex items-center gap-2 font-bold cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              <span>{isEditMode ? 'Desativar Modo Edição' : 'Ativar Modo Edição Visual'}</span>
            </button>
            <div className="pt-2">
              <a
                href="#contato"
                onClick={() => setMobileMenuOpen(false)}
                className="faixa-clip bg-[#D4FF3A] text-[#0F1222] text-center block w-full py-2.5 font-bold"
              >
                Vamos Conversar
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
