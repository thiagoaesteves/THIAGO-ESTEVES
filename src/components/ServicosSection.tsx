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
    <section id="servicos" className="border-t border-[#DADCE3]">
      {/* PARTE SUPERIOR: Background Claro (Off-white padrão) */}
      <div className="pt-8 pb-7 sm:pt-10 sm:pb-8 md:pt-12 md:pb-9 lg:pt-14 lg:pb-10 bg-[#F6F7F2] text-[#0F1222]">
        <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-[1140px] space-y-4 sm:space-y-5 md:space-y-6">
            {/* Header & Manifesto Intro */}
            <div className="space-y-2 sm:space-y-2.5">
              <span className="font-mono-code text-[10px] sm:text-xs uppercase tracking-widest text-[#2340FF] font-bold block">
                Especialidades &amp; Craft
              </span>

              {/* Big Headline & Abertura */}
              <div className="space-y-1.5 sm:space-y-2 max-w-[72ch]">
                <p className="font-disp font-extrabold text-xl sm:text-3xl md:text-4xl lg:text-[40px] 2xl:text-[44px] tracking-[-0.03em] leading-[1.06] text-[#0F1222] text-balance">
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

            {/* Categorias & Entregas 01 a 04 */}
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

      {/* PARTE INFERIOR: Bloco 05 + Prova Social e Credibilidade (Marquee & Chips) */}
      <div className="pt-8 sm:pt-10 md:pt-12 pb-10 sm:pb-12 md:pb-14 bg-[#0F1222] text-[#F6F7F2] border-t border-black/15">
        
        {/* BLOCO 05: Destaque Isolado */}
        <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-2 mb-10 sm:mb-12">
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

        {/* BLOCO DE PROVA SOCIAL E CREDIBILIDADE */}
        <div className="pt-8 border-t border-white/15">
          
          {/* Microcopy / Título */}
          <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-4 sm:mb-5">
            <span className="font-mono-code text-xs sm:text-[13px] uppercase tracking-widest text-[#D4FF3A] font-bold block">
              Para quem já criei (e vendi)?
            </span>
          </div>

          {/* Letreiro Animado (Marquee) Contínuo dos Clientes e Marcas */}
          <div
            aria-label="Marcas e clientes atendidos"
            className="overflow-hidden py-4 sm:py-5 border-y border-white/10 select-none bg-black/30 relative"
          >
            {/* Gradientes sutis para fade nas extremidades */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#0F1222] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#0F1222] to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee items-center text-lg sm:text-xl lg:text-2xl font-bold tracking-tight font-disp">
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
              {/* Repetição 2 para looping infinito sem corte */}
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

          {/* Painel opcional de edição rápida caso o usuário esteja no modo CMS */}
          {isEditMode && (
            <div className="max-w-[1320px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mt-6">
              <div className="p-4 rounded-xl bg-black/40 border border-[#D4FF3A]/40 space-y-3 max-w-4xl">
                <span className="text-xs font-mono-code text-[#D4FF3A] font-bold block uppercase tracking-wider">
                  Edição Rápida de Clientes (CMS):
                </span>
                <textarea
                  value={sobre?.clientsText || defaultMarcas.join(' / ')}
                  rows={2}
                  onChange={(e) => updateSobreField('clientsText', e.target.value)}
                  className="w-full text-xs font-mono-code text-white bg-black/50 border border-white/20 p-2.5 rounded-lg focus:outline-none focus:border-[#D4FF3A]"
                  placeholder="Clientes separados por /"
                />
                <span className="text-[10px] font-mono-code text-[#AFC0FF] block">
                  As marcas editadas fluem automaticamente no letreiro marquee. Salve pelo painel flutuante.
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
