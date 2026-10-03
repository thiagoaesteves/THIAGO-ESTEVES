import React from 'react';

export const ServicosSection: React.FC = () => {
  const especialidades = [
    {
      num: '01',
      categoria: 'Conceito',
      amp: '&',
      resto: 'Estratégia',
      itens: [
        'Desenvolvimento de conceitos',
        'Branding, Brand Content e Branded Experience',
        'Naming, Identidade verbal e Manifestos',
      ],
    },
    {
      num: '02',
      categoria: 'Campanhas',
      amp: '&',
      resto: 'Conteúdo',
      itens: [
        'Campanhas 360°, on e off',
        'Títulos, roteiros audiovisuais e jingles',
        'Desdobramentos cross-media, Conteúdo para social e projetos de transmídia storytelling',
      ],
    },
    {
      num: '03',
      categoria: 'Experiência',
      amp: '&',
      resto: 'Ativação',
      itens: [
        'Ações de live marketing, Big Ideas e PDV',
        'Comunicação interna',
      ],
    },
    {
      num: '04',
      categoria: 'Apresentação',
      amp: '&',
      resto: 'Conexão',
      itens: [
        'Storytelling de projetos',
        'Defesa de ideias com argumentos afiados para aprovar campanhas e tirar o projeto do papel',
      ],
    },
  ];

  const itemMinHeight: Record<string, string> = {
    '01': 'min-h-[69.35px]',
    '02': 'min-h-[69.35px]',
    '03': 'min-h-[46.0375px]',
    '04': 'min-h-[69.35px]',
  };

  return (
    <div
      id="servicos"
      className="border-t border-[#DADCE3] bg-[#0F1222] relative z-10 w-full scroll-mt-[74px] sm:scroll-mt-[80px]"
    >
      {/* SEÇÃO PRINCIPAL */}
      <section className="w-full bg-[#0F1222] text-[#0F1222] flex flex-col">
        
        {/* Bloco Superior com Fundo Claro */}
        <div className="bg-[#F6F7F2] w-full pt-4 sm:pt-6 pb-6 sm:pb-8 text-[#0F1222] min-h-[495.35px]">
          <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full min-h-[435.35px]">
            <div className="max-w-[1140px]">
              
              {/* Header & Manifesto Intro */}
              <div className="space-y-2 sm:space-y-2.5">
                <span className="font-mono-code text-[10px] sm:text-xs uppercase tracking-widest text-[#2340FF] font-bold block mb-2 sm:mb-3">
                  Especialidades &amp; Craft
                </span>

                {/* Big Headline */}
                <div className="space-y-3 sm:space-y-4 max-w-[72ch]">
                  <p className="font-disp font-extrabold text-lg sm:text-2xl md:text-3xl lg:text-[34px] tracking-[-0.03em] leading-[1.06] text-[#0F1222] min-h-[74.975px]">
                    <span className="font-serif-it italic text-[#2340FF] text-[1.18em] leading-none align-[-0.12em] mr-1.5">
                      “
                    </span>
                    A vida me fez vendedor.<br />
                    Eu me fiz publicitário.
                  </p>
                  
                  {/* Texto numa linha só com o efeito orgânico e tátil de marca-texto */}
                  <p className="text-sm sm:text-base md:text-lg lg:text-[20px] font-medium text-[#343848] leading-snug whitespace-nowrap pt-1 min-h-[34.5px] max-w-[838.8px]">
                    E aprendi a gerar resultados criativos em qualquer formato.{' '}
                    <span className="inline-block bg-[#D4FF3A] text-[#0F1222] px-2 py-0.5 font-bold rounded-[255px_15px_225px_15px/15px_225px_15px_255px] transform -rotate-1 shadow-sm">
                      Inclusive... todos.”
                    </span>
                  </p>
                </div>
              </div>

              {/* Categorias & Entregas 01 a 04 com espaçamento superior ajustado */}
              <div className="border-b border-[#DADCE3] mt-5 sm:mt-7">
                {especialidades.map((item) => (
                  <div
                    key={item.num}
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-6 items-baseline py-2 sm:py-2.5 border-t border-[#DADCE3] group ${
                      itemMinHeight[item.num] || ''
                    }`}
                  >
                    {/* Título da Categoria */}
                    <div className="lg:col-span-4 xl:col-span-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono-code text-[10px] sm:text-[11px] font-bold text-[#2340FF] tracking-wider shrink-0">
                          {item.num}
                        </span>
                        <h3 className="font-disp font-extrabold text-sm sm:text-base md:text-[18px] tracking-tight text-[#0F1222]">
                          {item.categoria}{' '}
                          <span className="font-serif-it italic font-normal text-[#2340FF] text-[1.12em] align-baseline">
                            {item.amp}
                          </span>{' '}
                          {item.resto}
                        </h3>
                      </div>
                    </div>

                    {/* Itens com quebra natural */}
                    <div className="lg:col-span-8 xl:col-span-8">
                      <p className="text-xs sm:text-sm md:text-[14px] lg:text-[15px] text-[#343848] font-normal leading-relaxed">
                        {item.itens.map((sub, sIdx) => (
                          <React.Fragment key={sIdx}>
                            <span className="text-[#202433] hover:text-[#2340FF] transition-colors duration-200">
                              {sub}
                            </span>
                            {sIdx < item.itens.length - 1 && (
                              <span className="text-[#2340FF]/40 mx-2 font-light select-none">
                                —
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                        <span className="text-[#2340FF] font-bold ml-0.5">.</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* BARRA DE RODAPÉ ESCURA (Com respiro inferior ajustado) */}
        <div className="bg-[#0F1222] text-[#F6F7F2] w-full border-t border-white/15 pt-5 pb-7 sm:pt-7 sm:pb-9 lg:pt-8 lg:pb-10 min-h-[153.087px]">
          <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full">
            <div className="max-w-[1140px] space-y-2 sm:space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono-code text-[10px] sm:text-xs uppercase tracking-widest text-[#D4FF3A] font-bold">
                  05 // E O QUE MAIS FOR PRECISO
                </span>
                <span className="h-px w-12 sm:w-16 bg-[#D4FF3A]/50 block" />
              </div>

              <p className="font-disp font-extrabold text-sm sm:text-base md:text-lg lg:text-[21px] leading-tight tracking-tight text-white">
                “Especialista cascudo, ponta firme, sangue nos olhos<br />
                <span className="font-serif-it italic font-normal text-[#AFC0FF]">sem nunca abrir mão da criatividade.</span>”
              </p>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};

export default ServicosSection;