import React from 'react';
import { Layers, Megaphone, Zap, MessageSquareQuote, Sparkles } from 'lucide-react';

export const ManifestoSection: React.FC = () => {
  const especialidades = [
    {
      num: '01',
      categoria: 'Conceito & Estratégia',
      icon: Layers,
      itens: [
        'Desenvolvimento de conceitos',
        'Branding, Brand Content e Branded Experience',
        'Naming, Tom de Voz e Craft',
      ],
    },
    {
      num: '02',
      categoria: 'Campanhas & Conteúdo',
      icon: Megaphone,
      itens: [
        'Campanhas on e off',
        'Títulos e raciocínio criativo',
        'Social',
        'Criação de roteiros audiovisuais e jingles',
      ],
    },
    {
      num: '03',
      categoria: 'Experiência & Ativação',
      icon: Zap,
      itens: [
        'Ações de live marketing, Big Ideas e PDV',
        'Comunicação interna',
      ],
    },
    {
      num: '04',
      categoria: 'Apresentação & Conexão',
      icon: MessageSquareQuote,
      itens: [
        'Storytelling de projetos',
        'Defesa de ideias com narrativa de alto impacto para encantar clientes e destravar negócios',
      ],
    },
  ];

  return (
    <section id="servicos" className="py-20 md:py-32 bg-[#F6F7F2] text-[#0F1222] border-t border-[#DADCE3]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1100px] space-y-12 md:space-y-16">
          {/* Header & Manifesto Intro */}
          <div className="space-y-8">
            <span className="font-mono-code text-xs uppercase tracking-widest text-[#2340FF] font-bold inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2340FF]" />
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
                Repertório e bagagem cultural construídos em agências do Rio de Janeiro, Sul e São Paulo. Quase 15 anos de experiência com muita história para contar do ontem e do amanhã.
              </p>
              <p className="text-xl sm:text-2xl md:text-3xl text-[#343848] leading-relaxed">
                Aprendi a gerar resultados com criatividade em qualquer formato, <span className="hl-mark font-semibold text-[#0F1222]">inclusive... todos.</span>
              </p>
            </div>
          </div>

          {/* Categorias & Entregas (Diagramação Editorial de Alta Agência) */}
          <div className="space-y-6 pt-6 border-t border-[#DADCE3]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {especialidades.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.num}
                    className="bg-white/80 rounded-2xl p-6 sm:p-7 border border-[#DADCE3] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(35,64,255,0.08)] hover:border-[#2340FF]/40 transition-all duration-300 flex flex-col justify-between space-y-5"
                  >
                    {/* Cabeçalho da Categoria */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-[#DADCE3]/70">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 rounded-lg bg-[#2340FF]/10 text-[#2340FF]">
                          <Icon className="w-4 h-4" />
                        </span>
                        <h3 className="font-disp text-xl sm:text-2xl font-bold tracking-tight text-[#0F1222]">
                          {item.categoria}
                        </h3>
                      </div>
                      <span className="font-mono-code text-xs font-bold text-[#2340FF] tracking-wider bg-[#2340FF]/5 px-2 py-0.5 rounded">
                        {item.num}
                      </span>
                    </div>

                    {/* Tags / Pílulas de Entregas */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.itens.map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center text-xs sm:text-sm font-medium text-[#252836] bg-[#F6F7F2] border border-[#DADCE3] px-3.5 py-1.5 rounded-lg shadow-2xs hover:border-[#2340FF]/60 hover:text-[#2340FF] hover:bg-white transition-colors"
                        >
                          <span className="text-[#2340FF] mr-2 font-mono text-[11px] select-none font-bold">/</span>
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 05 // E o que mais for preciso (Fechamento de Atitude do Manifesto) */}
            <div className="relative rounded-2xl bg-[#0F1222] text-white p-7 sm:p-9 md:p-10 border border-black/10 overflow-hidden shadow-xl group mt-6">
              {/* Luzes e texturas sutis de fundo */}
              <div
                className="absolute -right-24 -top-24 w-80 h-80 bg-[#2340FF]/25 rounded-full blur-3xl pointer-events-none group-hover:bg-[#2340FF]/35 transition-all duration-700"
                aria-hidden="true"
              />
              <div
                className="absolute -left-24 -bottom-24 w-80 h-80 bg-[#D4FF3A]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#D4FF3A]/25 transition-all duration-700"
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 lg:gap-10">
                <div className="space-y-3.5 max-w-3xl">
                  <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#D4FF3A] font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4FF3A]" />
                    <span>05 // E o que mais for preciso</span>
                  </div>
                  <p className="font-disp font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-[1.1] tracking-tight text-white">
                    Especialista cascudo, ponta firme, sangue nos olhos{' '}
                    <span className="text-[#AFC0FF] font-serif-it italic font-normal">
                      sem nunca abrir mão da criatividade.
                    </span>
                  </p>
                </div>

                <div className="shrink-0 self-start md:self-center">
                  <span className="inline-block font-mono-code text-xs text-[#0F1222] bg-[#D4FF3A] font-bold px-3.5 py-1.5 rounded uppercase tracking-wider shadow-sm">
                    Atitude
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

