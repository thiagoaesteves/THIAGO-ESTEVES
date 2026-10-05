import React from 'react';
import { Type, Sparkles } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { DEFAULT_SERVICOS_DATA } from '../data/servicos';

export const ServicosSection: React.FC = () => {
  const cms = (useCms() as any) || {};
  const isEditMode = !!cms.isEditMode;
  const servicos = cms.servicos || DEFAULT_SERVICOS_DATA;
  const updateServicosField = cms.updateServicosField;

  const defaultEspecialidades = [
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

  const defaultManifesto = {
    line1: 'A vida me fez vendedor.',
    line2: 'Eu me fiz publicitário.',
    subText: 'E aprendi a gerar resultados criativos em qualquer formato.',
    badge: 'Inclusive... todos.',
  };

  const defaultFooter = {
    badge: '05 // E O QUE MAIS FOR PRECISO',
    line1: 'Especialista cascudo, ponta firme, sangue nos olhos',
    line2: 'sem nunca abrir mão da criatividade.',
  };

  const getFallbackText = (val: any, fallback: string): string => {
    if (val === undefined || val === null) return fallback;
    if (typeof val === 'string' && val.trim() === '') return fallback;
    return String(val);
  };

  const especialidades = (Array.isArray(servicos.especialidades) && servicos.especialidades.length > 0)
    ? servicos.especialidades.map((item: any, idx: number) => {
        const def = defaultEspecialidades[idx] || {
          num: `0${idx + 1}`,
          categoria: '',
          amp: '&',
          resto: '',
          itens: [],
        };
        return {
          num: getFallbackText(item?.num, def.num),
          categoria: getFallbackText(item?.categoria, def.categoria),
          amp: item?.amp !== undefined && item?.amp !== null && item?.amp !== '' ? item.amp : def.amp,
          resto: getFallbackText(item?.resto, def.resto),
          itens: Array.isArray(item?.itens) && item.itens.length > 0 ? item.itens : def.itens,
        };
      })
    : defaultEspecialidades;
  
  const manifesto = {
    line1: getFallbackText(servicos.manifesto?.line1, defaultManifesto.line1),
    line2: getFallbackText(servicos.manifesto?.line2, defaultManifesto.line2),
    subText: getFallbackText(servicos.manifesto?.subText, defaultManifesto.subText),
    badge: getFallbackText(servicos.manifesto?.badge, defaultManifesto.badge),
  };

  const footer = {
    badge: getFallbackText(servicos.footer?.badge, defaultFooter.badge),
    line1: getFallbackText(servicos.footer?.line1, defaultFooter.line1),
    line2: getFallbackText(servicos.footer?.line2, defaultFooter.line2),
  };

  const handleUpdate = (field: string, value: any) => {
    if (typeof updateServicosField === 'function') {
      updateServicosField(field, value);
    }
  };

  return (
    <div
      id="servicos"
      className="border-t border-[#DADCE3] bg-[#0F1222] relative z-10 w-full scroll-mt-[74px] sm:scroll-mt-[80px] pb-0 mb-0"
    >
      <section className="w-full bg-[#0F1222] text-[#0F1222] flex flex-col m-0 p-0">
        
        {/* Bloco Superior com Fundo Claro */}
        <div className="bg-[#F6F7F2] w-full pt-6 pb-2.5 sm:pt-8 sm:pb-3.5 text-[#0F1222]">
          <div className="max-w-[1320px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 w-full">
            <div className="w-full max-w-[1333px]">
              
              {/* Header & Manifesto Intro */}
              <div className="space-y-1.5">
                <span className="font-mono-code text-[10px] sm:text-xs uppercase tracking-widest text-[#2340FF] font-bold block mb-4">
                  Especialidades &amp; Craft
                </span>

                <div className="space-y-2 max-w-[72ch] 2xl:max-w-[85ch]">
                  {isEditMode ? (
                    <div className="space-y-2 p-3 rounded-xl bg-[#0F1222]/5 border border-[#2340FF]/30">
                      <label className="text-[10px] font-mono-code text-[#2340FF] font-bold flex items-center gap-1">
                        <Type className="w-3 h-3" /> Editar Manifesto Principal:
                      </label>
                      <input
                        type="text"
                        value={manifesto.line1}
                        onChange={(e) => handleUpdate('manifesto', { ...manifesto, line1: e.target.value })}
                        className="w-full text-sm font-disp font-bold bg-white border border-[#2340FF]/30 p-2 rounded text-[#0F1222]"
                        placeholder="Linha 1..."
                      />
                      <input
                        type="text"
                        value={manifesto.line2}
                        onChange={(e) => handleUpdate('manifesto', { ...manifesto, line2: e.target.value })}
                        className="w-full text-sm font-disp font-bold bg-white border border-[#2340FF]/30 p-2 rounded text-[#0F1222]"
                        placeholder="Linha 2..."
                      />
                    </div>
                  ) : (
                    <p className="font-disp font-extrabold text-lg sm:text-2xl md:text-3xl lg:text-[32px] 2xl:text-[36px] tracking-[-0.03em] leading-[1.06] text-[#0F1222] max-w-4xl">
                      <span className="font-serif-it italic text-[#2340FF] text-[1.18em] leading-none align-[-0.12em] mr-1.5">
                        “
                      </span>
                      {manifesto.line1}<br />
                      {manifesto.line2}
                    </p>
                  )}
                  
                  {isEditMode ? (
                    <div className="space-y-2 p-3 rounded-xl bg-[#0F1222]/5 border border-[#2340FF]/30">
                      <label className="text-[10px] font-mono-code text-[#2340FF] font-bold flex items-center gap-1">
                        <Type className="w-3 h-3" /> Editar Chamada Secundária e Destaque:
                      </label>
                      <input
                        type="text"
                        value={manifesto.subText}
                        onChange={(e) => handleUpdate('manifesto', { ...manifesto, subText: e.target.value })}
                        className="w-full text-xs font-sans bg-white border border-[#2340FF]/30 p-2 rounded text-[#0F1222]"
                        placeholder="Texto secundário..."
                      />
                      <input
                        type="text"
                        value={manifesto.badge}
                        onChange={(e) => handleUpdate('manifesto', { ...manifesto, badge: e.target.value })}
                        className="w-full text-xs font-sans bg-white border border-[#2340FF]/30 p-2 rounded text-[#0F1222]"
                        placeholder="Texto do Badge (ex: Inclusive... todos.)"
                      />
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base md:text-lg lg:text-[19px] 2xl:text-[21px] font-medium text-[#343848] leading-snug whitespace-nowrap pt-0.5 max-w-[838.8px] 2xl:max-w-[960px]">
                      {manifesto.subText}{' '}
                      <span className="inline-block bg-[#D4FF3A] text-[#0F1222] px-2 py-0.5 font-bold rounded-[255px_15px_225px_15px/15px_225px_15px_255px] transform -rotate-1 shadow-sm">
                        {manifesto.badge}”
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Categorias & Entregas 01 a 04 */}
              <div className="mt-3 sm:mt-4">
                {isEditMode && (
                  <div className="py-1 text-xs font-mono-code text-[#2340FF] font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Editar Especialidades & Itens:
                  </div>
                )}
                {especialidades.map((item: any, idx: number) => (
                  <div
                    key={item.num || idx}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-6 2xl:gap-8 items-baseline py-2 sm:py-2.5 border-t border-[#DADCE3] group"
                  >
                    <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-4">
                      {isEditMode ? (
                        <div className="space-y-1.5 p-2 rounded bg-white border border-[#2340FF]/30">
                          <div className="flex items-center gap-2">
                            <span className="font-mono-code text-xs font-bold text-[#2340FF]">{item.num}</span>
                            <input
                              type="text"
                              value={item.categoria}
                              onChange={(e) => {
                                const newEsp = [...especialidades];
                                newEsp[idx] = { ...newEsp[idx], categoria: e.target.value };
                                handleUpdate('especialidades', newEsp);
                              }}
                              className="text-xs font-bold bg-[#F6F7F2] p-1 rounded border border-gray-300 w-full"
                              placeholder="Categoria..."
                            />
                          </div>
                          <input
                            type="text"
                            value={item.resto}
                            onChange={(e) => {
                              const newEsp = [...especialidades];
                              newEsp[idx] = { ...newEsp[idx], resto: e.target.value };
                              handleUpdate('especialidades', newEsp);
                            }}
                            className="text-xs font-bold bg-[#F6F7F2] p-1 rounded border border-gray-300 w-full"
                            placeholder="Resto do título..."
                          />
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono-code text-[10px] sm:text-[11px] font-bold text-[#2340FF] tracking-wider shrink-0">
                            {item.num}
                          </span>
                          <h3 className="font-disp font-extrabold text-sm sm:text-base md:text-[17px] 2xl:text-[19px] tracking-tight text-[#0F1222]">
                            {item.categoria}{' '}
                            <span className="font-serif-it italic font-normal text-[#2340FF] text-[1.12em] align-baseline">
                              {item.amp}
                            </span>{' '}
                            {item.resto}
                          </h3>
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-8">
                      {isEditMode ? (
                        <textarea
                          value={Array.isArray(item.itens) ? item.itens.join('\n') : item.itens}
                          rows={2}
                          onChange={(e) => {
                            const newItens = e.target.value.split('\n').filter(Boolean);
                            const newEsp = [...especialidades];
                            newEsp[idx] = { ...newEsp[idx], itens: newItens };
                            handleUpdate('especialidades', newEsp);
                          }}
                          className="w-full text-xs font-sans bg-white border border-gray-300 p-2 rounded text-[#0F1222]"
                          placeholder="Digite um item por linha..."
                        />
                      ) : (
                        <p className="text-xs sm:text-sm md:text-[13px] lg:text-[14px] 2xl:text-[15px] text-[#343848] font-normal leading-relaxed max-w-4xl 2xl:max-w-5xl">
                          {Array.isArray(item.itens) && item.itens.map((sub: string, sIdx: number) => (
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
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* BARRA DE RODAPÉ // 05 (Altura expandida e texto alinhado verticalmente ao centro) */}
        <div className="bg-[#0F1222] text-[#F6F7F2] w-full max-w-full py-10 sm:py-14 m-0 border-b-0 overflow-hidden box-border flex flex-col justify-center">
          <div className="max-w-[1320px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 w-full">
            <div className="max-w-[1140px] 2xl:max-w-[1440px] space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full">
                {isEditMode ? (
                  <input
                    type="text"
                    value={footer?.badge || '05 // E O QUE MAIS FOR PRECISO'}
                    onChange={(e) => handleUpdate('footer', { ...footer, badge: e.target.value })}
                    className="font-mono-code text-xs uppercase font-bold bg-black border border-[#D4FF3A]/50 text-[#D4FF3A] p-1 rounded max-w-xs"
                  />
                ) : (
                  <span className="font-mono-code text-[10px] sm:text-xs uppercase tracking-widest text-[#D4FF3A] font-bold shrink-0">
                    {footer?.badge || '05 // E O QUE MAIS FOR PRECISO'}
                  </span>
                )}
                <span className="h-px w-10 sm:w-16 bg-[#D4FF3A]/50 block shrink-0" />
              </div>

              {isEditMode ? (
                <div className="space-y-2 p-3 rounded bg-white/10 border border-white/20 w-full max-w-full">
                  <input
                    type="text"
                    value={footer?.line1 || 'Especialista cascudo, ponta firme, sangue nos olhos'}
                    onChange={(e) => handleUpdate('footer', { ...footer, line1: e.target.value })}
                    className="w-full text-xs bg-black text-white p-2 rounded border border-white/20"
                    placeholder="Linha 1 do rodapé..."
                  />
                  <input
                    type="text"
                    value={footer?.line2 || 'sem nunca abrir mão da criatividade.'}
                    onChange={(e) => handleUpdate('footer', { ...footer, line2: e.target.value })}
                    className="w-full text-xs bg-black text-white p-2 rounded border border-white/20"
                    placeholder="Linha 2 do rodapé..."
                  />
                </div>
              ) : (
                <p className="font-disp font-extrabold text-sm sm:text-base md:text-lg lg:text-[20px] 2xl:text-[22px] leading-tight tracking-tight text-white max-w-4xl 2xl:max-w-5xl break-words">
                  {footer?.line1 || 'Especialista cascudo, ponta firme, sangue nos olhos'}<br />
                  <span className="font-serif-it italic font-normal text-[#AFC0FF]">
                    {footer?.line2 || 'sem nunca abrir mão da criatividade.'}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default ServicosSection;