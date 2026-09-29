import React from 'react';

export const ManifestoSection: React.FC = () => {
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

  return (
    <section id="servicos" className="border-t border-[#DADCE3]">
      {/* PARTE SUPERIOR: Background Claro (Off-white padrão) */}
      <div className="pt-7 pb-6 sm:pt-9 sm:pb-7 md:pt-10 md:pb-8 lg:pt-11 lg:pb-9 bg-[#F6F7F2] text-[#0F1222]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1140px] space-y-5 sm:space-y-6 md:space-y-7">
            {/* Header & Manifesto Intro */}
            <div className="space-y-2.5 sm:space-y-3">
              <span className="font-mono-code text-[10px] sm:text-xs uppercase tracking-widest text-[#2340FF] font-bold block">
                Especialidades &amp; Craft
              </span>

              {/* Big Headline & Abertura */}
              <div className="space-y-1.5 sm:space-y-2 max-w-[72ch]">
                <p className="font-disp font-extrabold text-xl sm:text-3xl md:text-4xl lg:text-[40px] tracking-[-0.03em] leading-[1.06] text-[#0F1222] text-balance">
                  <span className="font-serif-it italic text-[#2340FF] text-[1.18em] leading-none align-[-0.12em] mr-1.5">
                    “
                  </span>
                  A vida me fez vendedor.<br />
                  Eu me fiz publicitário.
                </p>
                <p className="text-sm sm:text-base md:text-[17px] text-[#343848] leading-snug pt-0.5">
                  E com isso, aprendi a gerar resultados com criatividade em qualquer formato,{' '}
                  <span className="hl-mark font-semibold text-[#0F1222]">inclusive... todos.</span>”
                </p>
              </div>
            </div>

            {/* Categorias & Entregas 01 a 04 (Editorial Tipográfico Claro Compacto) */}
            <div className="border-b border-[#DADCE3]">
              {especialidades.map((item) => (
                <div
                  key={item.num}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-1.5 lg:gap-6 items-baseline py-2.5 sm:py-3 md:py-3.5 border-t border-[#DADCE3] group"
                >
                  {/* Título da Categoria */}
                  <div className="lg:col-span-4 xl:col-span-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono-code text-[10px] sm:text-[11px] font-bold text-[#2340FF] tracking-wider shrink-0">
                        {item.num}
                      </span>
                      <h3 className="font-disp font-extrabold text-base sm:text-lg md:text-[20px] tracking-tight text-[#0F1222] leading-snug">
                        {item.categoria}{' '}
                        <span className="font-serif-it italic font-normal text-[#2340FF] text-[1.12em] align-baseline">
                          {item.amp}
                        </span>{' '}
                        {item.resto}
                      </h3>
                    </div>
                  </div>

                  {/* Itens Fluidos com Travessões Sutis */}
                  <div className="lg:col-span-8 xl:col-span-8 pt-0.5 lg:pt-0">
                    <p className="text-xs sm:text-sm md:text-[15px] lg:text-base text-[#343848] font-normal leading-relaxed">
                      {item.itens.map((sub, sIdx) => (
                        <React.Fragment key={sIdx}>
                          <span className="text-[#202433] hover:text-[#2340FF] transition-colors duration-200">
                            {sub}
                          </span>
                          {sIdx < item.itens.length - 1 && (
                            <span className="text-[#2340FF]/40 mx-2 sm:mx-2.5 font-light select-none">
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

      {/* BLOCO 05: Destaque Isolado no Rodapé da Seção (Background Escuro / Dark Mode, Sem Box, Otimizado) */}
      <div className="py-6 sm:py-7 md:py-8 lg:py-9 bg-[#0F1222] text-[#F6F7F2] border-t border-black/15">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1140px] space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono-code text-[10px] sm:text-xs uppercase tracking-widest text-[#D4FF3A] font-bold">
                05 // E O QUE MAIS FOR PRECISO
              </span>
              <span className="h-px w-8 sm:w-12 bg-[#D4FF3A]/40 block" />
            </div>

            <p className="font-disp font-extrabold text-lg sm:text-xl md:text-2xl lg:text-[28px] xl:text-[30px] leading-tight tracking-tight text-white text-balance">
              “Especialista cascudo, ponta firme, sangue nos olhos{' '}
              <span className="font-serif-it italic font-normal text-[#AFC0FF] inline-block">
                sem nunca abrir mão da criatividade.
              </span>”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

