import React from 'react';
import { useCms } from '../context/CmsContext';

export const ServicosSection: React.FC = () => {
  const { isEditMode, sobre, updateSobreField } = useCms();

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

  // Lista consolidada de clientes e marcas atendidas
  const defaultMarcas = [
    'Vivo',
    'Samsung',
    'Unicred',
    'GSK / GlaxoSmithKline',
    'Grupo Boticário',
    'Senai',
    'BEAUTYCOLOR',
    'Frimesa',
    'Chilli Beans',
    'Jasmine Alimentos',
    'Dunlop Pneus',
    'BR Malls',
    'Unimed RJ',
    'Detran-RJ',
    'Nipponflex Brasil & USA',
    'WEG Motores',
    'Volvo Trucks Corporation',
    'John Deere Brasil & Espanha',
    'Electrolux',
    'Tintas Verginia',
    'Coritiba Football Club',
    'Paraná Banco',
    'Hortifruti e Natural da Terra',
    'CBF',
    'entre outras',
  ];

  const marcasArray = sobre?.clientsText
    ? sobre.clientsText.split(/\s*[\/\n]\s*/).filter(Boolean)
    : defaultMarcas;

  return (
    <div id="servicos" className="border-t border-[#DADCE3]">
      
      {/* =========================================================
          SEÇÃO 1: BACKSTAGE (Rigidez de Grid e Hierarquia Tipográfica)
         ========================================================= */}
      <section className="h-[calc(100vh-74px)] flex flex-col justify-between bg-[#F6F7F2] text-[#0F1222] overflow-hidden">
        
        {/* Conteúdo Principal Superior */}
        <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full pt-3 sm:pt-5">
          <div className="max-w-[1140px] space-y-2.5 sm:space-y-4">
            
            {/* Header & Manifesto Intro */}
            <div className="space-y-2 sm:space-y-2.5">
              <span className="font-mono-code text-[10px] sm:text-xs uppercase tracking-widest text-[#2340FF] font-bold block">
                Especialidades &amp; Craft
              </span>

              {/* Big Headline */}
              <div className="space-y-3 sm:space-y-4 max-w-[72ch]">
                <p className="font-disp font-extrabold text-lg sm:text-2xl md:text-3xl lg:text-[34px] tracking-[-0.03em] leading-[1.06] text-[#0F1222]">
                  <span className="font-serif-it italic text-[#2340FF] text-[1.18em] leading-none align-[-0.12em] mr-1.5">
                    “
                  </span>
                  A vida me fez vendedor.<br />
                  Eu me fiz publicitário.
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-[20px] font-medium text-[#343848] leading-snug">
                  E com isso, aprendi a gerar resultados com criatividade em qualquer formato,<br />
                  <span className="hl-mark font-semibold text-[#0F1222]">inclusive... todos.</span>”
                </p>
              </div>
            </div>

            {/* Categorias & Entregas 01 a 04 */}
            <div className="border-b border-[#DADCE3]">
              {especialidades.map((item) => (
                <div
                  key={item.num}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-6 items-baseline py-2 sm:py-2.5 border-t border-[#DADCE3] group"
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

        {/* BARRA DE RODAPÉ ESCURA */}
        <div className="bg-[#0F1222] text-[#F6F7F2] w-full border-t border-white/15">
          <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full py-4 sm:py-5">
            <div className="max-w-[1140px] space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="font-mono-code text-[10px] sm:text-xs uppercase tracking-widest text-[#D4FF3A] font-bold">
                  05 // E O QUE MAIS FOR PRECISO
                </span>
                <span className="h-px w-12 sm:w-16 bg-[#D4FF3A]/50 block" />
              </div>

              <p className="font-disp font-extrabold text-sm sm:text-base md:text-lg lg:text-[21px] leading-tight tracking-tight text-white">
                “Especialista cascudo, ponta firme, sangue<br />
                nos olhos <span className="font-serif-it italic font-normal text-[#AFC0FF]">sem nunca abrir mão da criatividade.</span>”
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* =========================================================
          SEÇÃO 2: DIVISOR DE SEÇÕES (Marquee de Clientes - Abaixo da Dobra)
         ========================================================= */}
      <section className="py-6 sm:py-8 bg-[#0F1222] text-[#F6F7F2] border-t border-black/20">
        <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-3 w-full">
          <div className="max-w-[1140px]">
            <span className="font-mono-code text-[11px] sm:text-xs uppercase tracking-widest text-[#D4FF3A] font-bold block leading-tight">
              Para quem já criei?<br />
              <span className="text-[#AFC0FF] font-normal normal-case font-serif-it text-sm sm:text-base">(e vendi)</span>
            </span>
          </div>
        </div>

        <div
          aria-label="Marcas e clientes atendidos"
          className="overflow-hidden py-3 sm:py-4 border-y border-white/10 select-none bg-black/40 relative"
        >
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#0F1222] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#0F1222] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee items-center text-sm sm:text-base lg:text-lg font-bold tracking-tight font-disp">
            {/* Repetição 1 */}
            <div className="flex items-center gap-6 sm:gap-8 pr-6 sm:pr-8 shrink-0">
              {marcasArray.map((brand, i) => (
                <React.Fragment key={`brand-1-${i}`}>
                  <span className="text-[#F6F7F2] hover:text-[#D4FF3A] transition-colors whitespace-nowrap">
                    {brand}
                  </span>
                  <span className="text-[#D4FF3A] text-xs font-serif-it select-none opacity-80" aria-hidden="true">
                    ✦
                  </span>
                </React.Fragment>
              ))}
            </div>
            {/* Repetição 2 */}
            <div className="flex items-center gap-6 sm:gap-8 pr-6 sm:pr-8 shrink-0">
              {marcasArray.map((brand, i) => (
                <React.Fragment key={`brand-2-${i}`}>
                  <span className="text-[#F6F7F2] hover:text-[#D4FF3A] transition-colors whitespace-nowrap">
                    {brand}
                  </span>
                  <span className="text-[#D4FF3A] text-xs font-serif-it select-none opacity-80" aria-hidden="true">
                    ✦
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Painel opcional de edição rápida (CMS) */}
        {isEditMode && (
          <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mt-4">
            <div className="p-3 rounded-xl bg-black/40 border border-[#D4FF3A]/40 space-y-2 max-w-4xl">
              <span className="text-xs font-mono-code text-[#D4FF3A] font-bold block uppercase tracking-wider">
                Edição Rápida de Clientes (CMS):
              </span>
              <textarea
                value={sobre?.clientsText || defaultMarcas.join(' / ')}
                rows={2}
                onChange={(e) => updateSobreField('clientsText', e.target.value)}
                className="w-full text-xs font-mono-code text-white bg-black/50 border border-white/20 p-2 rounded-lg focus:outline-none focus:border-[#D4FF3A]"
                placeholder="Clientes separados por /"
              />
            </div>
          </div>
        )}
      </section>

    </div>
  );
};