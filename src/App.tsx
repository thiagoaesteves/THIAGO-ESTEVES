import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { CaseCard } from './components/CaseCard';
import { CaseModal } from './components/CaseModal';
import { LightboxModal } from './components/LightboxModal';
import { ServicosSection } from './components/ServicosSection';
import { SobreSection } from './components/SobreSection';
import { ContatoSection } from './components/ContatoSection';
import { Footer } from './components/Footer';
import { CmsToolbar } from './components/CmsToolbar';
import { CmsExportModal } from './components/CmsExportModal';
import { AddCaseModal } from './components/AddCaseModal';
import { CmsProvider, useCms } from './context/CmsContext';
import { CaseItem, GridSpanType } from './types';
import { Columns, GripVertical } from 'lucide-react';

const getCaseSpanClass = (item: CaseItem, idx: number, isSectionBonus = false) => {
  const span = item.gridSpan || (isSectionBonus && idx === 0 ? 'full' : idx === 0 ? 'full' : 'half');
  switch (span) {
    case 'full':
      return 'col-span-1 md:col-span-12';
    case 'third':
      return 'col-span-1 sm:col-span-6 md:col-span-4';
    case 'center-thumb':
      // Ocupa 8 colunas centralizadas (com offset de 2 colunas à esquerda) num grid de 12 colunas, com largura máxima de miniatura
      return 'col-span-1 md:col-span-8 md:col-start-3 mx-auto w-full max-w-2xl';
    case 'half':
    default:
      return 'col-span-1 sm:col-span-6 md:col-span-6';
  }
};

function PortfolioApp() {
  const { cases, isEditMode, isAddModalOpen, setIsAddModalOpen } = useCms();
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [lightboxData, setLightboxData] = useState<{ url: string; title: string } | null>(null);

  const [sectionCols, setSectionCols] = useState<{ [key: string]: number }>({
    ladoA: 2,
    ladoB: 2,
    bonus: 2,
  });

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        if (hash === 'edit') return;
        const found = cases.find((c) => c.slug === hash);
        if (found) {
          setSelectedCase(found);
        } else {
          const element = document.getElementById(hash);
          if (element) {
            setTimeout(() => {
              const headerEl = document.querySelector('header');
              const headerOffset = headerEl ? headerEl.offsetHeight : 56;
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
              });
            }, 60);
          }
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []); // Dependência vazia para evitar o scroll indesejado ao editar

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

  const casesLadoA = useMemo(() => cases.filter((c) => c.lado === 'A'), [cases]);
  const casesLadoB = useMemo(() => cases.filter((c) => c.lado === 'B'), [cases]);
  const casesBonus = useMemo(() => cases.filter((c) => c.lado === 'bonus'), [cases]);

  const totalA = useMemo(() => cases.filter((c) => c.lado === 'A').length, [cases]);
  const totalB = useMemo(() => cases.filter((c) => c.lado === 'B').length, [cases]);
  const totalBonus = useMemo(() => cases.filter((c) => c.lado === 'bonus').length, [cases]);

  return (
    <div className="min-h-screen bg-[#F6F7F2] text-[#0F1222] font-disp antialiased selection:bg-[#D4FF3A] selection:text-[#0F1222]">
      <Header />
      <Hero caseCountA={totalA} caseCountB={totalB} caseCountBonus={totalBonus} />
      <Marquee />

      <main>
        {/* Lado A */}
        <section id="lado-a" className="pt-4 sm:pt-6 md:pt-8 pb-14 sm:pb-18 md:pb-24 bg-[#F6F7F2]">
          <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
            {isEditMode && (
              <div className="mb-6 flex items-center justify-between bg-[#181C32] text-white border border-white/10 rounded-xl px-4 py-2.5 shadow-xl">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-white/40" />
                  <span className="font-mono-code text-xs uppercase tracking-wider text-[#D4FF3A] font-bold">
                    Definições da Grelha · Lado A
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono-code text-xs">
                  <span className="text-white/60 flex items-center gap-1">
                    <Columns className="w-3.5 h-3.5" /> Colunas Base:
                  </span>
                  <div className="inline-flex bg-[#0F1222] rounded p-0.5 border border-white/10">
                    {[1, 2, 3].map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSectionCols({ ...sectionCols, ladoA: col })}
                        className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                          sectionCols.ladoA === col ? 'bg-[#2340FF] text-white shadow' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="max-w-3xl space-y-1 mb-4 sm:mb-6 md:mb-8">
              <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#2340FF] font-bold block select-text">
                Lado A
              </span>
              <h2 className="font-disp font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] 2xl:text-[5.75rem] tracking-[-0.04em] text-[#0F1222] leading-[0.98] select-text">
                Advertising
              </h2>
            </div>

            {casesLadoA.length === 0 ? (
              <div className="py-12 text-center text-[#5B6070] font-mono-code text-sm select-text">
                Nenhum case do Lado A corresponde à pesquisa atual.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 sm:gap-x-8 md:gap-x-10 lg:gap-x-12 gap-y-6 sm:gap-y-8 items-start">
                {casesLadoA.map((item, idx) => (
                  <div key={item.slug} className={getCaseSpanClass(item, idx, false)}>
                    <CaseCard
                      item={item}
                      onSelect={handleOpenCase}
                      featured={item.gridSpan === 'full' || (!item.gridSpan && idx === 0)}
                      positionIndex={idx + 1}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lado B */}
        {casesLadoB.length > 0 && (
          <section id="lado-b" className="pt-4 sm:pt-6 md:pt-8 pb-14 sm:pb-18 md:pb-24 bg-[#0F1222] text-[#F6F7F2] border-t border-[#262A3D]">
            <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
              {isEditMode && (
                <div className="mb-6 flex items-center justify-between bg-[#181C32] text-white border border-white/10 rounded-xl px-4 py-2.5 shadow-xl">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-white/40" />
                    <span className="font-mono-code text-xs uppercase tracking-wider text-[#D4FF3A] font-bold">
                      Definições da Grelha · Lado B
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono-code text-xs">
                    <span className="text-white/60 flex items-center gap-1">
                      <Columns className="w-3.5 h-3.5" /> Colunas Base:
                    </span>
                    <div className="inline-flex bg-[#0F1222] rounded p-0.5 border border-white/10">
                      {[1, 2, 3].map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setSectionCols({ ...sectionCols, ladoB: col })}
                          className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                            sectionCols.ladoB === col ? 'bg-[#FF4FA0] text-white shadow' : 'text-white/60 hover:text-white'
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="max-w-3xl space-y-1 mb-4 sm:mb-6 md:mb-8">
                <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#FF4FA0] font-bold block select-text">
                  Lado B
                </span>
                <h2 className="font-disp font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] 2xl:text-[5.75rem] tracking-[-0.04em] text-white leading-[0.98] select-text">
                  Branding
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 sm:gap-x-8 md:gap-x-10 lg:gap-x-12 gap-y-6 sm:gap-y-8 items-start">
                {casesLadoB.map((item, idx) => (
                  <div key={item.slug} className={getCaseSpanClass(item, idx, false)}>
                    <CaseCard
                      item={item}
                      onSelect={handleOpenCase}
                      dark
                      featured={item.gridSpan === 'full'}
                      positionIndex={idx + 1}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Faixa Bônus */}
        {casesBonus.length > 0 && (
          <section id="faixa-bonus" className="pt-4 sm:pt-6 md:pt-8 pb-14 sm:pb-18 md:pb-24 bg-[#D4FF3A] text-[#0F1222] border-t border-black/10">
            <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
              {isEditMode && (
                <div className="mb-6 flex items-center justify-between bg-[#0F1222] text-white border border-black/10 rounded-xl px-4 py-2.5 shadow-xl">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-white/40" />
                    <span className="font-mono-code text-xs uppercase tracking-wider text-[#D4FF3A] font-bold">
                      Definições da Grelha · Faixa Bônus
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono-code text-xs">
                    <span className="text-white/60 flex items-center gap-1">
                      <Columns className="w-3.5 h-3.5" /> Colunas Base:
                    </span>
                    <div className="inline-flex bg-[#181C32] rounded p-0.5 border border-white/10">
                      {[1, 2, 3].map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setSectionCols({ ...sectionCols, bonus: col })}
                          className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                            sectionCols.bonus === col ? 'bg-[#D4FF3A] text-[#0F1222] shadow font-black' : 'text-white/60 hover:text-white'
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="max-w-4xl space-y-1 mb-4 sm:mb-6 md:mb-8">
                <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#2340FF] font-bold block select-text">
                  Faixas Bonus · {totalBonus} faixas
                </span>
                <h2 className="font-disp font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] 2xl:text-[5.75rem] tracking-[-0.04em] text-[#0F1222] leading-[0.98] select-text">
                  Especiais
                </h2>
                <p className="font-mono-code text-sm sm:text-base text-[#0F1222]/80 pt-2 font-medium select-text">
                  Ideias que eram pra ser só um post
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 sm:gap-x-8 md:gap-x-10 lg:gap-x-12 gap-y-6 sm:gap-y-8 items-start">
                {casesBonus.map((item, idx) => (
                  <div key={item.slug} className={getCaseSpanClass(item, idx, true)}>
                    <CaseCard
                      item={item}
                      onSelect={handleOpenCase}
                      bonus
                      featured={item.gridSpan === 'full' || (!item.gridSpan && idx === 0)}
                      positionIndex={idx + 1}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <ServicosSection />
        <SobreSection />
        <ContatoSection />
      </main>

      <Footer />

      <CaseModal
        item={selectedCase}
        onClose={handleCloseCase}
        onSelectCase={handleOpenCase}
        allCases={cases}
        onOpenLightbox={handleOpenLightbox}
      />

      <LightboxModal
        imgUrl={lightboxData?.url || null}
        title={lightboxData?.title}
        onClose={handleCloseLightbox}
      />

      <CmsToolbar />
      <CmsExportModal />

      <AddCaseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCaseCreated={(newCase) => {
          handleOpenCase(newCase);
        }}
      />
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