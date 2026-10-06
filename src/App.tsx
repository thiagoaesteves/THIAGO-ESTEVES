import React, { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
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

const getCaseSpanClass = (item: CaseItem, idx: number, isSectionBonus = false) => {
  const span = item.gridSpan || (isSectionBonus && idx === 0 ? 'full' : idx === 0 ? 'full' : 'half');
  switch (span) {
    case 'full':
      return 'col-span-1 md:col-span-12';
    case 'half':
      return 'col-span-1 sm:col-span-6 md:col-span-6';
    case 'half-center':
      return 'col-span-1 md:col-span-6 md:col-start-4 mx-auto w-full';
    case 'half-right':
      return 'col-span-1 sm:col-span-6 md:col-span-6 ml-auto';
    case 'third':
      return 'col-span-1 sm:col-span-6 md:col-span-4';
    case 'third-center':
      return 'col-span-1 md:col-span-4 md:col-start-5 mx-auto w-full';
    case 'third-right':
      return 'col-span-1 sm:col-span-6 md:col-span-4 ml-auto';
    default:
      return 'col-span-1 sm:col-span-6 md:col-span-6';
  }
};

function PortfolioApp() {
  const { 
    cases, 
    isEditMode, 
    isAddModalOpen, 
    setIsAddModalOpen,
    updateCaseField
  } = useCms();

  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [lightboxData, setLightboxData] = useState<{ url: string; title: string } | null>(null);

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
  }, []); // Mantém o scroll estável ao editar textos

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
          <div className="max-w-[1320px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 sm:mb-6 md:mb-8">
              <div className="max-w-3xl space-y-1">
                <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#2340FF] font-bold block select-text">
                  Lado A
                </span>
                <h2 className="font-disp font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] 2xl:text-[5.75rem] tracking-[-0.04em] text-[#0F1222] leading-[0.98] select-text">
                  Advertising
                </h2>
              </div>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-[#2340FF] hover:bg-blue-700 text-white font-mono-code text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
                  title="Adicionar novo case ao Lado A"
                >
                  <Plus className="w-4 h-4 text-[#D4FF3A]" />
                  <span>+ Adicionar Projeto</span>
                </button>
              )}
            </div>

            {casesLadoA.length === 0 ? (
              <div className="py-12 text-center text-[#5B6070] font-mono-code text-sm select-text">
                Nenhum case do Lado A corresponde à pesquisa atual.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 sm:gap-x-8 md:gap-x-10 lg:gap-x-12 gap-y-6 sm:gap-y-8 items-start">
                {casesLadoA.map((item, idx) => {
                  const currentSpan = item.gridSpan || (idx === 0 ? 'full' : 'half');
                  const currentRatio = item.cardRatio || 'original';
                  return (
                    <div key={item.slug} className={getCaseSpanClass(item, idx, false)}>
                      {/* Barra de controle individual acima de cada card no Modo Edição */}
                      {isEditMode && (
                        <div className="mb-2.5 p-2 bg-[#181C32] text-white rounded-xl border border-white/15 flex flex-col gap-2 shadow-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-mono-code text-[10px] uppercase text-[#D4FF3A] font-bold px-1">
                              Card: {item.name}
                            </span>
                            {/* Largura (Span) */}
                            <div className="inline-flex bg-[#0F1222] rounded p-0.5 border border-white/10 text-[10px] font-mono-code">
                              <button
                                type="button"
                                onClick={() => updateCaseField(item.slug, 'gridSpan', 'full')}
                                className={`px-2 py-0.5 rounded font-bold transition-all ${currentSpan.includes('full') ? 'bg-[#2340FF] text-white' : 'text-white/60 hover:text-white'}`}
                              >
                                Full (100%)
                              </button>
                              <button
                                type="button"
                                onClick={() => updateCaseField(item.slug, 'gridSpan', currentSpan.includes('center') ? 'half-center' : currentSpan.includes('right') ? 'half-right' : 'half')}
                                className={`px-2 py-0.5 rounded font-bold transition-all ${currentSpan.includes('half') ? 'bg-[#2340FF] text-white' : 'text-white/60 hover:text-white'}`}
                              >
                                50%
                              </button>
                              <button
                                type="button"
                                onClick={() => updateCaseField(item.slug, 'gridSpan', currentSpan.includes('center') ? 'third-center' : currentSpan.includes('right') ? 'third-right' : 'third')}
                                className={`px-2 py-0.5 rounded font-bold transition-all ${currentSpan.includes('third') ? 'bg-[#2340FF] text-white' : 'text-white/60 hover:text-white'}`}
                              >
                                Mini (33%)
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
                            {/* Alinhamento (se não for full) */}
                            {!currentSpan.includes('full') ? (
                              <div className="inline-flex items-center gap-1">
                                <span className="font-mono-code text-[9px] text-white/50 uppercase">Alinhamento:</span>
                                <div className="inline-flex bg-[#0F1222] rounded p-0.5 border border-white/10 text-[10px] font-mono-code">
                                  <button
                                    type="button"
                                    onClick={() => updateCaseField(item.slug, 'gridSpan', currentSpan.includes('third') ? 'third' : 'half')}
                                    className={`px-1.5 py-0.5 rounded ${!currentSpan.includes('center') && !currentSpan.includes('right') ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
                                  >
                                    Esq
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateCaseField(item.slug, 'gridSpan', currentSpan.includes('third') ? 'third-center' : 'half-center')}
                                    className={`px-1.5 py-0.5 rounded ${currentSpan.includes('center') ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
                                  >
                                    Centro
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateCaseField(item.slug, 'gridSpan', currentSpan.includes('third') ? 'third-right' : 'half-right')}
                                    className={`px-1.5 py-0.5 rounded ${currentSpan.includes('right') ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
                                  >
                                    Dir
                                  </button>
                                </div>
                              </div>
                            ) : <div />}

                            {/* Proporção / Formato */}
                            <div className="inline-flex items-center gap-1">
                              <span className="font-mono-code text-[9px] text-white/50 uppercase">Formato:</span>
                              <div className="inline-flex bg-[#0F1222] rounded p-0.5 border border-white/10 text-[10px] font-mono-code">
                                {(['original', 'square', 'vertical', 'horizontal'] as const).map((ratio) => (
                                  <button
                                    key={ratio}
                                    type="button"
                                    onClick={() => updateCaseField(item.slug, 'cardRatio', ratio)}
                                    className={`px-1.5 py-0.5 rounded capitalize ${currentRatio === ratio ? 'bg-[#2340FF] text-white font-bold' : 'text-white/50 hover:text-white'}`}
                                  >
                                    {ratio === 'square' ? 'Quadrado' : ratio === 'vertical' ? 'Vertical' : ratio === 'horizontal' ? 'Horizontal' : 'Original'}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <CaseCard
                        item={item}
                        onSelect={handleOpenCase}
                        featured={currentSpan === 'full'}
                        positionIndex={idx + 1}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Lado B */}
        {casesLadoB.length > 0 && (
          <section id="lado-b" className="pt-4 sm:pt-6 md:pt-8 pb-14 sm:pb-18 md:pb-24 bg-[#0F1222] text-[#F6F7F2] border-t border-[#262A3D]">
            <div className="max-w-[1320px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 sm:mb-6 md:mb-8">
                <div className="max-w-3xl space-y-1">
                  <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#FF4FA0] font-bold block select-text">
                    Lado B
                  </span>
                  <h2 className="font-disp font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] 2xl:text-[5.75rem] tracking-[-0.04em] text-white leading-[0.98] select-text">
                    Branding
                  </h2>
                </div>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF4FA0] hover:bg-pink-600 text-white font-mono-code text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
                    title="Adicionar novo case ao Lado B"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span>+ Adicionar Projeto</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 sm:gap-x-8 md:gap-x-10 lg:gap-x-12 gap-y-6 sm:gap-y-8 items-start">
                {casesLadoB.map((item, idx) => {
                  const currentSpan = item.gridSpan || (idx === 0 ? 'full' : 'half');
                  const currentRatio = item.cardRatio || 'original';
                  return (
                    <div key={item.slug} className={getCaseSpanClass(item, idx, false)}>
                      {isEditMode && (
                        <div className="mb-2.5 p-2 bg-[#181C32] text-white rounded-xl border border-white/15 flex flex-col gap-2 shadow-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-mono-code text-[10px] uppercase text-[#FF4FA0] font-bold px-1">
                              Card: {item.name}
                            </span>
                            <div className="inline-flex bg-[#0F1222] rounded p-0.5 border border-white/10 text-[10px] font-mono-code">
                              <button
                                type="button"
                                onClick={() => updateCaseField(item.slug, 'gridSpan', 'full')}
                                className={`px-2 py-0.5 rounded font-bold transition-all ${currentSpan.includes('full') ? 'bg-[#FF4FA0] text-white' : 'text-white/60 hover:text-white'}`}
                              >
                                Full (100%)
                              </button>
                              <button
                                type="button"
                                onClick={() => updateCaseField(item.slug, 'gridSpan', currentSpan.includes('center') ? 'half-center' : currentSpan.includes('right') ? 'half-right' : 'half')}
                                className={`px-2 py-0.5 rounded font-bold transition-all ${currentSpan.includes('half') ? 'bg-[#FF4FA0] text-white' : 'text-white/60 hover:text-white'}`}
                              >
                                50%
                              </button>
                              <button
                                type="button"
                                onClick={() => updateCaseField(item.slug, 'gridSpan', currentSpan.includes('center') ? 'third-center' : currentSpan.includes('right') ? 'third-right' : 'third')}
                                className={`px-2 py-0.5 rounded font-bold transition-all ${currentSpan.includes('third') ? 'bg-[#FF4FA0] text-white' : 'text-white/60 hover:text-white'}`}
                              >
                                Mini (33%)
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
                            {!currentSpan.includes('full') ? (
                              <div className="inline-flex items-center gap-1">
                                <span className="font-mono-code text-[9px] text-white/50 uppercase">Alinhamento:</span>
                                <div className="inline-flex bg-[#0F1222] rounded p-0.5 border border-white/10 text-[10px] font-mono-code">
                                  <button
                                    type="button"
                                    onClick={() => updateCaseField(item.slug, 'gridSpan', currentSpan.includes('third') ? 'third' : 'half')}
                                    className={`px-1.5 py-0.5 rounded ${!currentSpan.includes('center') && !currentSpan.includes('right') ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
                                  >
                                    Esq
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateCaseField(item.slug, 'gridSpan', currentSpan.includes('third') ? 'third-center' : 'half-center')}
                                    className={`px-1.5 py-0.5 rounded ${currentSpan.includes('center') ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
                                  >
                                    Centro
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateCaseField(item.slug, 'gridSpan', currentSpan.includes('third') ? 'third-right' : 'half-right')}
                                    className={`px-1.5 py-0.5 rounded ${currentSpan.includes('right') ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
                                  >
                                    Dir
                                  </button>
                                </div>
                              </div>
                            ) : <div />}

                            <div className="inline-flex items-center gap-1">
                              <span className="font-mono-code text-[9px] text-white/50 uppercase">Formato:</span>
                              <div className="inline-flex bg-[#0F1222] rounded p-0.5 border border-white/10 text-[10px] font-mono-code">
                                {(['original', 'square', 'vertical', 'horizontal'] as const).map((ratio) => (
                                  <button
                                    key={ratio}
                                    type="button"
                                    onClick={() => updateCaseField(item.slug, 'cardRatio', ratio)}
                                    className={`px-1.5 py-0.5 rounded capitalize ${currentRatio === ratio ? 'bg-[#FF4FA0] text-white font-bold' : 'text-white/50 hover:text-white'}`}
                                  >
                                    {ratio === 'square' ? 'Quadrado' : ratio === 'vertical' ? 'Vertical' : ratio === 'horizontal' ? 'Horizontal' : 'Original'}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <CaseCard
                        item={item}
                        onSelect={handleOpenCase}
                        dark
                        featured={currentSpan === 'full'}
                        positionIndex={idx + 1}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Faixa Bônus */}
        {casesBonus.length > 0 && (
          <section id="faixa-bonus" className="pt-4 sm:pt-6 md:pt-8 pb-14 sm:pb-18 md:pb-24 bg-[#D4FF3A] text-[#0F1222] border-t border-black/10">
            <div className="max-w-[1320px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 sm:mb-6 md:mb-8">
                <div className="max-w-4xl space-y-1">
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
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F1222] hover:bg-black text-[#D4FF3A] font-mono-code text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
                    title="Adicionar novo case à Faixa Bônus"
                  >
                    <Plus className="w-4 h-4 text-[#D4FF3A]" />
                    <span>+ Adicionar Projeto</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 sm:gap-x-8 md:gap-x-10 lg:gap-x-12 gap-y-6 sm:gap-y-8 items-start">
                {casesBonus.map((item, idx) => {
                  const currentSpan = item.gridSpan || (idx === 0 ? 'full' : 'half');
                  const currentRatio = item.cardRatio || 'original';
                  return (
                    <div key={item.slug} className={getCaseSpanClass(item, idx, true)}>
                      {isEditMode && (
                        <div className="mb-2.5 p-2 bg-[#0F1222] text-white rounded-xl border border-black/20 flex flex-col gap-2 shadow-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-mono-code text-[10px] uppercase text-[#D4FF3A] font-bold px-1">
                              Card: {item.name}
                            </span>
                            <div className="inline-flex bg-[#181C32] rounded p-0.5 border border-white/10 text-[10px] font-mono-code">
                              <button
                                type="button"
                                onClick={() => updateCaseField(item.slug, 'gridSpan', 'full')}
                                className={`px-2 py-0.5 rounded font-bold transition-all ${currentSpan.includes('full') ? 'bg-[#D4FF3A] text-[#0F1222]' : 'text-white/60 hover:text-white'}`}
                              >
                                Full (100%)
                              </button>
                              <button
                                type="button"
                                onClick={() => updateCaseField(item.slug, 'gridSpan', currentSpan.includes('center') ? 'half-center' : currentSpan.includes('right') ? 'half-right' : 'half')}
                                className={`px-2 py-0.5 rounded font-bold transition-all ${currentSpan.includes('half') ? 'bg-[#D4FF3A] text-[#0F1222]' : 'text-white/60 hover:text-white'}`}
                              >
                                50%
                              </button>
                              <button
                                type="button"
                                onClick={() => updateCaseField(item.slug, 'gridSpan', currentSpan.includes('center') ? 'third-center' : currentSpan.includes('right') ? 'third-right' : 'third')}
                                className={`px-2 py-0.5 rounded font-bold transition-all ${currentSpan.includes('third') ? 'bg-[#D4FF3A] text-[#0F1222]' : 'text-white/60 hover:text-white'}`}
                              >
                                Mini (33%)
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
                            {!currentSpan.includes('full') ? (
                              <div className="inline-flex items-center gap-1">
                                <span className="font-mono-code text-[9px] text-white/50 uppercase">Alinhamento:</span>
                                <div className="inline-flex bg-[#181C32] rounded p-0.5 border border-white/10 text-[10px] font-mono-code">
                                  <button
                                    type="button"
                                    onClick={() => updateCaseField(item.slug, 'gridSpan', currentSpan.includes('third') ? 'third' : 'half')}
                                    className={`px-1.5 py-0.5 rounded ${!currentSpan.includes('center') && !currentSpan.includes('right') ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
                                  >
                                    Esq
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateCaseField(item.slug, 'gridSpan', currentSpan.includes('third') ? 'third-center' : 'half-center')}
                                    className={`px-1.5 py-0.5 rounded ${currentSpan.includes('center') ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
                                  >
                                    Centro
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateCaseField(item.slug, 'gridSpan', currentSpan.includes('third') ? 'third-right' : 'half-right')}
                                    className={`px-1.5 py-0.5 rounded ${currentSpan.includes('right') ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
                                  >
                                    Dir
                                  </button>
                                </div>
                              </div>
                            ) : <div />}

                            <div className="inline-flex items-center gap-1">
                              <span className="font-mono-code text-[9px] text-white/50 uppercase">Formato:</span>
                              <div className="inline-flex bg-[#181C32] rounded p-0.5 border border-white/10 text-[10px] font-mono-code">
                                {(['original', 'square', 'vertical', 'horizontal'] as const).map((ratio) => (
                                  <button
                                    key={ratio}
                                    type="button"
                                    onClick={() => updateCaseField(item.slug, 'cardRatio', ratio)}
                                    className={`px-1.5 py-0.5 rounded capitalize ${currentRatio === ratio ? 'bg-[#D4FF3A] text-[#0F1222] font-bold' : 'text-white/50 hover:text-white'}`}
                                  >
                                    {ratio === 'square' ? 'Quadrado' : ratio === 'vertical' ? 'Vertical' : ratio === 'horizontal' ? 'Horizontal' : 'Original'}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <CaseCard
                        item={item}
                        onSelect={handleOpenCase}
                        bonus
                        featured={currentSpan === 'full'}
                        positionIndex={idx + 1}
                      />
                    </div>
                  );
                })}
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