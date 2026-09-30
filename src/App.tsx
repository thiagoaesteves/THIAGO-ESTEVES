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

import { CmsProvider, useCms } from './context/CmsContext';

import { CaseItem } from './types';

function PortfolioApp() {

  const { cases } = useCms();

  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

  const [lightboxData, setLightboxData] = useState<{ url: string; title: string } | null>(null);



  // Hash deep linking: check if hash matches a case slug

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
              const headerOffset = 70;
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



  const casesLadoA = useMemo(
    () => cases.filter((c) => c.lado === 'A'),
    [cases]
  );

  const casesLadoB = useMemo(
    () => cases.filter((c) => c.lado === 'B'),
    [cases]
  );

  const casesBonus = useMemo(
    () => cases.filter((c) => c.lado === 'bonus'),
    [cases]
  );

  const totalA = useMemo(() => cases.filter((c) => c.lado === 'A').length, [cases]);
  const totalB = useMemo(() => cases.filter((c) => c.lado === 'B').length, [cases]);
  const totalBonus = useMemo(() => cases.filter((c) => c.lado === 'bonus').length, [cases]);

  return (
    <div className="min-h-screen bg-[#F6F7F2] text-[#0F1222] font-disp antialiased selection:bg-[#D4FF3A] selection:text-[#0F1222]">
      {/* Fixed Header with Navigation */}
      <Header />

      {/* Hero Section */}
      <Hero
        caseCountA={totalA}
        caseCountB={totalB}
        caseCountBonus={totalBonus}
      />

      {/* Infinite Brand Marquee */}
      <Marquee />

      <main>
        {/* Lado A: Advertising */}
        <section id="lado-a" className="py-14 sm:py-18 md:py-24 bg-[#F6F7F2]">
            <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
              {/* Section Header */}
              <div className="max-w-3xl space-y-1 mb-8 sm:mb-10 md:mb-12">
                <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#2340FF] font-bold block">
                  Lado A
                </span>
                <h2 className="font-disp font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] 2xl:text-[5.75rem] tracking-[-0.04em] text-[#0F1222] leading-[0.98]">
                  Advertising
                </h2>
              </div>

              {/* Grid of Lado A Cards - Grid Simétrico: 1 Coluna em Mobile, 2 Colunas em Tablets e Desktops */}
              {casesLadoA.length === 0 ? (
                <div className="py-12 text-center text-[#5B6070] font-mono-code text-sm">
                  Nenhum case do Lado A corresponde à pesquisa atual.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-14">
                  {casesLadoA.map((item, idx) => (
                    <div
                      key={item.slug}
                      className="col-span-1"
                    >
                      <CaseCard
                        item={item}
                        onSelect={handleOpenCase}
                        featured={false}
                        columns={2}
                        positionIndex={idx + 1}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        {/* Lado B: Branding (Original Dark Visual Style) */}
        {casesLadoB.length > 0 && (
          <section id="lado-b" className="py-14 sm:py-18 md:py-24 bg-[#0F1222] text-[#F6F7F2] border-t border-[#262A3D]">
            <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
              {/* Section Header */}
              <div className="max-w-3xl space-y-1 mb-8 sm:mb-10 md:mb-12">
                <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#FF4FA0] font-bold block">
                  Lado B
                </span>
                <h2 className="font-disp font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] 2xl:text-[5.75rem] tracking-[-0.04em] text-white leading-[0.98]">
                  Branding
                </h2>
              </div>

              {/* Lado B Layout: 1 Coluna em Mobile, 2 em Tablets, 3 Colunas em Desktops (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                {casesLadoB.map((item, idx) => (
                  <div
                    key={item.slug}
                    className="col-span-1"
                  >
                    <CaseCard
                      item={item}
                      onSelect={handleOpenCase}
                      dark
                      featured={false}
                      columns={3}
                      positionIndex={idx + 1}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Faixa Bônus (Acid Green / Electric Lime Backdrop #D4FF3A) */}
        {casesBonus.length > 0 && (
          <section id="faixa-bonus" className="py-14 sm:py-18 md:py-24 bg-[#D4FF3A] text-[#0F1222] border-t border-black/10">
            <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
              {/* Section Header */}
              <div className="max-w-4xl space-y-1 mb-8 sm:mb-10 md:mb-12">
                <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#2340FF] font-bold block">
                  Faixa Bônus · {totalBonus} faixas
                </span>
                <h2 className="font-disp font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] 2xl:text-[5.75rem] tracking-[-0.04em] text-[#0F1222] leading-[0.98]">
                  Especiais
                </h2>
                <p className="font-mono-code text-sm sm:text-base text-[#0F1222]/80 pt-2 font-medium">
                  Ideias que eram pra ser só um post
                </p>
              </div>

              {/* Faixa Bônus Layout: Grid Fluido e Simétrico em 1 Coluna no mobile e 2 Colunas no tablet/desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-14">

                {casesBonus.map((item, idx) => (

                  <div

                    key={item.slug}

                    className={idx === 0 ? 'md:col-span-2' : 'col-span-1'}

                  >

                    <CaseCard

                      item={item}

                      onSelect={handleOpenCase}

                      bonus

                      featured={idx === 0}

                      columns={2}

                      positionIndex={idx + 1}

                    />

                  </div>

                ))}

              </div>

            </div>

          </section>

        )}



        {/* Entregas & Serviços */}

        <ServicosSection />



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