import React from 'react';

export const ManifestoSection: React.FC = () => {
  const colunaEsquerda = [
    'Desenvolvimento de conceitos',
    'Campanhas on e off',
    'Títulos e raciocínio criativo',
    'Criação de roteiros audiovisuais e jingles',
  ];

  const colunaDireita = [
    'Ações de live marketing, Big Ideas e PDV',
    'Comunicação interna',
    'Branding, Brand Content e Branded Experience',
    'Naming, Tom de Voz e Craft',
  ];

  return (
    <section id="servicos" className="py-20 md:py-32 bg-[#F6F7F2] text-[#0F1222] border-t border-[#DADCE3]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1100px] space-y-8">
          <span className="font-mono-code text-xs uppercase tracking-widest text-[#2340FF] font-bold">
            Entregas &amp; Especialidades
          </span>

          {/* Big Headline */}
          <p className="font-disp font-extrabold text-3xl sm:text-5xl md:text-7xl lg:text-[84px] tracking-[-0.04em] leading-[0.98] text-[#0F1222] text-balance">
            <span className="font-serif-it italic text-[#2340FF] text-[1.25em] leading-none align-[-0.15em] mr-2">
              “
            </span>
            A vida me fez vendedor.<br />
            Eu me fiz publicitário.
          </p>

          {/* Explanation */}
          <div className="space-y-4 max-w-[58ch]">
            <p className="text-xl sm:text-2xl md:text-3xl text-[#343848] leading-relaxed">
              Repertório e bagagem cultural construídos em agências do Rio de Janeiro, Sul e São Paulo. Quase 15 anos de experiência com muita história pra conta de ontem e amanhã.
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl text-[#343848] leading-relaxed">
              Aprendi a gerar resultados com criatividade em qualquer formato, <span className="hl-mark font-semibold text-[#0F1222]">inclusive... todos.</span>
            </p>
          </div>

          {/* Bullets List / Grid (2 balanced columns) */}
          <div className="pt-10 mt-8 border-t border-[#DADCE3]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-y-8 gap-x-12">
              {/* Coluna Esquerda */}
              <div className="space-y-6 md:space-y-8">
                {colunaEsquerda.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-[#2340FF] text-2xl leading-none select-none font-bold shrink-0">•</span>
                    <h3 className="font-disp text-xl sm:text-2xl font-bold tracking-tight text-[#0F1222] leading-snug">
                      {item}
                    </h3>
                  </div>
                ))}
              </div>

              {/* Coluna Direita */}
              <div className="space-y-6 md:space-y-8">
                {colunaDireita.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-[#2340FF] text-2xl leading-none select-none font-bold shrink-0">•</span>
                    <h3 className="font-disp text-xl sm:text-2xl font-bold tracking-tight text-[#0F1222] leading-snug">
                      {item}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
