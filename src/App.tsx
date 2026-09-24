import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { CaseCard } from './components/CaseCard';
import { CaseModal } from './components/CaseModal';
import { LightboxModal } from './components/LightboxModal';
import { ManifestoSection } from './components/ManifestoSection';
import { SobreSection } from './components/SobreSection';
import { ContatoSection } from './components/ContatoSection';
import { Footer } from './components/Footer';
import { CmsToolbar } from './components/CmsToolbar';
import { CmsExportModal } from './components/CmsExportModal';
import { CmsProvider, useCms } from './context/CmsContext';
import { CaseItem } from './types';
import { X } from 'lucide-react';

function PortfolioApp() {
  const { cases } = useCms();
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [lightboxData, setLightboxData] = useState<{ url: string; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Hash deep linking: check if hash matches a case slug
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const found = cases.find((c) => c.slug === hash);
        if (found) {
          setSelectedCase(found);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [cases]);

  const handleOpenCase = (c: CaseItem) => {
    setSelectedCase(c);
    window.history.replaceState(null, '', `#${c.slug}`);
  };

  const handleCloseCase = () => {
    setSelectedCase(null);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  };

  const handleOpenLightbox = (url: string, title: string) => {
    setLightboxData({ url, title });
  };

  const handleCloseLightbox = () => {
    setLightboxData(null);
  };

  // Filter cases based on search query
  const filteredCases = useMemo(() => {
    if (!searchQuery.trim()) return cases;
    const q = searchQuery.toLowerCase();
    return cases.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.concept.toLowerCase().includes(q) ||
        c.deliv.toLowerCase().includes(q) ||
        c.text.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [cases, searchQuery]);

  const casesLadoA = useMemo(
    () => filteredCases.filter((c) => c.lado === 'A'),
    [filteredCases]
  );
  const casesLadoB = useMemo(
    () => filteredCases.filter((c) => c.lado === 'B'),
    [filteredCases]
  );
  const casesBonus = useMemo(
    () => filteredCases.filter((c) => c.lado === 'bonus'),
    [filteredCases]
  );

  const totalA = useMemo(() => cases.filter((c) => c.lado === 'A').length, [cases]);
  const totalB = useMemo(() => cases.filter((c) => c.lado === 'B').length, [cases]);
  const totalBonus = useMemo(() => cases.filter((c) => c.lado === 'bonus').length, [cases]);

  return (
    <div className="min-h-screen bg-[#F6F7F2] text-[#0F1222] font-disp antialiased selection:bg-[#D4FF3A] selection:text-[#0F1222]">
      {/* Sticky Header with Edit Mode Button */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Section */}
      <Hero
        caseCountA={totalA}
        caseCountB={totalB}
        caseCountBonus={totalBonus}
      />

      {/* Infinite Brand Marquee */}
      <Marquee />

      {/* Active Search Notification Banner */}
      {searchQuery && (
        <div className="bg-[#EAECE6] border-b border-[#DADCE3] py-2.5">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-mono-code text-[#2340FF]">
            <span>
              Resultados para: <b>"{searchQuery}"</b> ({filteredCases.length} encontrados)
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[#5B6070] hover:text-black flex items-center gap-1 cursor-pointer font-bold"
            >
              <X className="w-3.5 h-3.5" /> Limpar busca
            </button>
          </div>
        </div>
      )}

      <main>
        {/* Lado A: Advertising */}
        <section id="lado-a" className="py-16 md:py-24 bg-[#F6F7F2]">
            <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="max-w-3xl space-y-1 mb-10 md:mb-12">
                <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#2340FF] font-bold block">
                  Lado A
                </span>
                <h2 className="font-disp font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] tracking-[-0.05em] text-[#0F1222] leading-[0.95]">
                  Advertising
                </h2>
              </div>

              {/* Grid of Lado A Cards - Single Column */}
              {casesLadoA.length === 0 ? (
                <div className="py-12 text-center text-[#5B6070] font-mono-code text-sm">
                  Nenhum case do Lado A corresponde à pesquisa atual.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-12 sm:gap-14 md:gap-16">
                  {casesLadoA.map((item) => (
                    <CaseCard
                      key={item.slug}
                      item={item}
                      onSelect={handleOpenCase}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

        {/* Lado B: Branding (Original Dark Visual Style) */}
        {(!searchQuery || casesLadoB.length > 0) && (
          <section id="lado-b" className="py-16 md:py-28 bg-[#0F1222] text-[#F6F7F2] border-t border-[#262A3D]">
            <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="max-w-3xl space-y-1 mb-10 md:mb-12">
                <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#FF4FA0] font-bold block">
                  Lado B
                </span>
                <h2 className="font-disp font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] tracking-[-0.05em] text-white leading-[0.95]">
                  Branding
                </h2>
              </div>

              {/* Lado B Main Grid - Single Column */}
              <div className="grid grid-cols-1 gap-12 sm:gap-14 md:gap-16">
                {casesLadoB.map((item) => (
                  <CaseCard
                    key={item.slug}
                    item={item}
                    onSelect={handleOpenCase}
                    dark
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Faixa Bônus (Acid Green / Electric Lime Backdrop #D4FF3A) */}
        {(!searchQuery || casesBonus.length > 0) && (
          <section id="faixa-bonus" className="py-16 md:py-28 bg-[#D4FF3A] text-[#0F1222] border-t border-black/10">
            <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="max-w-4xl space-y-1 mb-10 md:mb-12">
                <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#2340FF] font-bold block">
                  Faixa Bônus
                </span>
                <h2 className="font-disp font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-[-0.045em] text-[#0F1222] leading-[1.02]">
                  Ideias que eram só um post
                </h2>
              </div>

              {/* Faixa Bônus Grid - Single Column with bonus styles */}
              <div className="grid grid-cols-1 gap-12 sm:gap-14 md:gap-16">
                {casesBonus.map((item) => (
                  <CaseCard
                    key={item.slug}
                    item={item}
                    onSelect={handleOpenCase}
                    bonus
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Entregas & Serviços */}
        <ManifestoSection />

        {/* Sobre o Thiago */}
        <SobreSection />

        {/* Contato */}
        <ContatoSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Case Details Drawer / Modal */}
      <CaseModal
        item={selectedCase}
        onClose={handleCloseCase}
        onSelectCase={handleOpenCase}
        allCases={cases}
        onOpenLightbox={handleOpenLightbox}
      />

      {/* Lightbox for Zooming Pieces */}
      <LightboxModal
        imgUrl={lightboxData?.url || null}
        title={lightboxData?.title}
        onClose={handleCloseLightbox}
      />

      {/* Floating CMS Toolbar */}
      <CmsToolbar />

      {/* CMS Export JSON / Code Modal */}
      <CmsExportModal />
    </div>
  );
}

export default function App() {
  return (
    <CmsProvider>
      <PortfolioApp />
    </CmsProvider>
  );
}
