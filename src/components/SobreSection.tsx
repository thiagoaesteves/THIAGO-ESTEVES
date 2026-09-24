import React from 'react';

export const SobreSection: React.FC = () => {
  return (
    <section id="sobre" className="py-20 md:py-32 bg-[#2340FF] text-[#F6F7F2] relative overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center">
          {/* Photo Column - Real Photo of Thiago Esteves from thiagoesteves.com */}
          <div className="md:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-[#0F1222] group">
              <div className="aspect-[4/5] relative overflow-hidden">
                <img
                  src="https://cdn.myportfolio.com/1d3f31e9-221e-41c7-bd84-2a081f93562b/bc5e16c3-d424-4341-854b-78011e6a2516_rw_1920.jpeg?h=7f552ace409a0aa0e4d9fdfe434da652"
                  alt="Thiago Esteves · Creative Copywriter & Transmídia Storyteller"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle gradient overlay at bottom for legible captions */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1222]/95 via-[#0F1222]/20 to-transparent pointer-events-none" />

                <div className="absolute bottom-5 left-5 right-5 z-10 space-y-1">
                  <span className="font-mono-code text-xs uppercase tracking-widest text-[#D4FF3A] block">
                    Based in Brazil · Available Worldwide
                  </span>
                  <div className="font-disp font-extrabold text-2xl sm:text-3xl text-white">
                    Thiago Esteves
                  </div>
                  <p className="font-serif-it text-base sm:text-lg text-[#AFC0FF] italic">
                    Creative Copywriter &amp; Transmídia Storyteller
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text & Presentation Column - Aligned exactly with thiagoesteves.com/sobre */}
          <div className="md:col-span-7 space-y-6">
            <span className="font-mono-code text-xs uppercase tracking-widest text-[#D4FF3A] font-bold">
              Sobre
            </span>

            <h2 className="font-disp font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-[-0.035em] text-white">
              Quem eu sou?
            </h2>

            <div className="space-y-4 text-lg sm:text-xl text-[#F6F7F2]/90 leading-relaxed font-normal">
              <p className="text-xl sm:text-2xl font-medium text-white leading-snug">
                Publicitário carioca, redator criativo e roteirista. Já bati o ponto em agências do Rio de Janeiro, Sul, São Paulo e algumas das minhas ideias já saíram do país.
              </p>

              <p>
                Amo boas histórias, novas culturas e a minha profissão.
              </p>

              <p>
                Sou apaixonado por música e poesia, mas se você está procurando um músico ou poeta, eu passo a bola, porque o que eu faço bem é criar propaganda.
              </p>
            </div>

            {/* Para quem já criei section */}
            <div className="pt-5 border-t border-[#6F85FF]/60">
              <span className="font-mono-code text-xs uppercase tracking-widest text-[#D4FF3A] font-bold block mb-2">
                Para quem já criei?
              </span>
              <p className="text-xs sm:text-sm text-[#D5DBF5] leading-relaxed font-mono-code">
                Unicred, GSK GlaxoSmithKline Pharmaceuticals, Sesi, Senai, BEAUTYCOLOR, Grupo Boticário, Frimesa, Chilli Beans, Max Atacadista, Jasmine Alimentos, Dunlop Pneus, Alphaville Urbanismo, Depimiel, Herbarium, Maple Bear Canadian School, Keune Haircosmetics, Pivot Point, Vodka Kovak, BR Malls, Unimed RJ, Detran-RJ, Nipponflex Brasil e USA, WEG Motores, NHS Energia, RPC - afiliada Rede Globo, Volvo Trucks Corporation, John Deere Brasil e Espanha, Electrolux, Tintas Verginia, Farmácias Nissei, Lojas Daju, Multilojas, Coritiba Football Club, Mabu Thermas Resort e Blue Park, Paraná Banco, inFlux English School, Tintas Darka, Hortifruti e Natural da Terra, Confederação Brasileira de Futebol (CBF), Vivo, Samsung..
              </p>
            </div>

            {/* Stats Triad */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 pt-6 border-t border-[#6F85FF]">
              {/* 1. Brands */}
              <div>
                <b className="font-disp text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white block">
                  50+
                </b>
                <span className="text-white text-xs sm:text-sm font-mono-code uppercase tracking-wider block mt-1 font-medium">
                  marcas atendidas
                </span>
                <span className="text-[#D5DBF5]/70 text-[11px] font-mono-code block mt-0.5">
                  nacionais e multinacionais
                </span>
              </div>

              {/* 2. States & Countries */}
              <div>
                <b className="font-disp text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white block">
                  3 + 3
                </b>
                <span className="text-white text-xs sm:text-sm font-mono-code uppercase tracking-wider block mt-1 font-medium">
                  praças &amp; países
                </span>
                <span className="text-[#D5DBF5]/70 text-[11px] font-mono-code block mt-0.5 leading-snug">
                  RJ, Sul, SP · Brasil, EUA &amp; Espanha
                </span>
              </div>

              {/* 3. Experience */}
              <div>
                <b className="font-disp text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#D4FF3A] block">
                  15+
                </b>
                <span className="text-white text-xs sm:text-sm font-mono-code uppercase tracking-wider block mt-1 font-medium">
                  anos de estrada
                </span>
                <span className="text-[#D5DBF5]/70 text-[11px] font-mono-code block mt-0.5">
                  e muita história pra contar
                </span>
              </div>
            </div>

            {/* Segment Keywords Cloud */}
            <div className="pt-6 border-t border-[#6F85FF]/40">
              <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#D4FF3A] font-bold block mb-3">
                Segmentos atendidos
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Beleza & Cosméticos',
                  'Finanças & Bancos',
                  'Tech & Telecom',
                  'Automotivo & Linha Pesada',
                  'Saúde & Farma',
                  'Alimentos & Bebidas',
                  'Varejo & Moda',
                  'Bens de Consumo & Indústria',
                  'Educação & Idiomas',
                  'Esportes & Futebol',
                  'Imobiliário & Hotelaria',
                  'Governo & Cidadania',
                ].map((segmento) => (
                  <span
                    key={segmento}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-mono-code text-[#F6F7F2] bg-white/10 hover:bg-white/15 border border-white/15 transition-colors"
                  >
                    {segmento}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
