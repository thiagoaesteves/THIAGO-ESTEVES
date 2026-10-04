import React from 'react';
import { Type, Sparkles } from 'lucide-react';
import { useCms } from '../context/CmsContext';

export const ServicosSection: React.FC = () => {
  const cms = (useCms() as any) || {};
  const isEditMode = !!cms.isEditMode;
  const servicos = cms.servicos || {};
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

  const especialidades = servicos.especialidades || defaultEspecialidades;
  const manifesto = servicos.manifesto || defaultManifesto;
  const footer = servicos.footer || defaultFooter;

  const handleUpdate = (field: string, value: any) => {
    if (typeof updateServicosField === 'function') {
      updateServicosField(field, value);
    }
  };

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
          <div className="max-w-[1320px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 w-full min-h-[435.35px]">
            <div className="max-w-[1140px] 2xl:max-w-[1440px]">
              
              {/* Header & Manifesto Intro */}
              <div className="space-y-2 sm:space-y-2.5">
                <span className="font-mono-code text-[10px] sm:text-xs uppercase tracking-widest text-[#2340FF] font-bold block mb-2 sm:mb-3">
                  Especialidades &amp; Craft
                </span>

                {/* Big Headline */}
                <div className="space-y-3 sm:space-y-4 max-w-[72ch] 2xl:max-w-[85ch]">
                  {isEditMode ? (
                    <div className="space-y-2 p-4 rounded-xl bg-[#0F1222]/5 border border-[#2340FF]/30">
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
                    <p className="font-disp font-extrabold text-lg sm:text-2xl md:text-3xl lg:text-[34px] 2xl:text-[38px] tracking-[-0.03em] leading-[1.06] text-[#0F1222] min-h-[74.975px] max-w-4xl">
                      <span className="font-serif-it italic text-[#2340FF] text-[1.18em] leading-none align-[-0.12em] mr-1.5">
                        “
                      </span>
                      {manifesto.line1}<br />
                      {manifesto.line2}
                    </p>
                  )}
                  
                  {/* Texto secundário & Badge */}
                  {isEditMode ? (
                    <div className="space-y-2 p-4 rounded-xl bg-[#0F1222]/5 border border-[#2340FF]/30">
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
                    <p className="text-sm sm:text-base md:text-lg lg:text-[20px] 2xl:text-[22px] font-medium text-[#343848] leading-snug whitespace-nowrap pt-1 min-h-[34.5px] max-w-[838.8px] 2xl:max-w-[960px]">
                      {manifesto.subText}{' '}
                      <span className="inline-block bg-[#D4FF3A] text-[#0F1222] px-2 py-0.5 font-bold rounded-[255px_15px_225px_15px/15px_225px_15px_255px] transform -rotate-1 shadow-sm">
                        {manifesto.badge}”
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Categorias & Entregas 01 a 04 */}
              <div className="border-b border-[#DADCE3] mt-5 sm:mt-7">
                {isEditMode && (
                  <div className="py-2 text-xs font-mono-code text-[#2340FF] font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Editar Especialidades & Itens (Itens separados por vírgula ou nova linha):
                  </div>
                )}
                {especialidades.map((item: any, idx: number) => (
                  <div
                    key={item.num || idx}
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-6 2xl:gap-8 items-baseline py-3 sm:py-3.5 2xl:py-4 border-t border-[#DADCE3] group ${
                      itemMinHeight[item.num] || ''
                    }`}
                  >
                    {/* Título da Categoria */}
                    <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-4">
                      {isEditMode ? (
                        <div className="space-y-1.5 p-3 rounded bg-white border border-[#2340FF]/30">
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
                          <h3 className="font-disp font-extrabold text-sm sm:text-base md:text-[18px] 2xl:text-[20px] tracking-tight text-[#0F1222]">
                            {item.categoria}{' '}
                            <span className="font-serif-it italic font-normal text-[#2340FF] text-[1.12em] align-baseline">
                              {item.amp}
                            </span>{' '}
                            {item.resto}
                          </h3>
                        </div>
                      )}
                    </div>

                    {/* Itens */}
                    <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-8">
                      {isEditMode ? (
                        <textarea
                          value={Array.isArray(item.itens) ? item.itens.join('\n') : item.itens}
                          rows={3}
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
                        <p className="text-xs sm:text-sm md:text-[14px] lg:text-[15px] 2xl:text-[16px] text-[#343848] font-normal leading-relaxed max-w-4xl 2xl:max-w-5xl">
                          {item.itens.map((sub: string, sIdx: number) => (
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

        {/* BARRA DE RODAPÉ ESCURA */}
        <div className="bg-[#0F1222] text-[#F6F7F2] w-full border-t border-white/15 pt-5 pb-7 sm:pt-7 sm:pb-9 lg:pt-8 lg:pb-10 2xl:pt-9 2xl:pb-11 min-h-[160.078px]">
          <div className="max-w-[1320px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 w-full">
            <div className="max-w-[1140px] 2xl:max-w-[1440px] space-y-2 sm:space-y-2.5">
              <div className="flex items-center gap-2.5">
                {isEditMode ? (
                  <input
                    type="text"
                    value={footer.badge}
                    onChange={(e) => handleUpdate('footer', { ...footer, badge: e.target.value })}
                    className="font-mono-code text-xs uppercase font-bold bg-black border border-[#D4FF3A]/50 text-[#D4FF3A] p-1 rounded w-64"
                  />
                ) : (
                  <span className="font-mono-code text-[10px] sm:text-xs uppercase tracking-widest text-[#D4FF3A] font-bold">
                    {footer.badge}
                  </span>
                )}
                <span className="h-px w-12 sm:w-16 bg-[#D4FF3A]/50 block" />
              </div>

              {isEditMode ? (
                <div className="space-y-2 p-3 rounded bg-white/10 border border-white/20">
                  <input
                    type="text"
                    value={footer.line1}
                    onChange={(e) => handleUpdate('footer', { ...footer, line1: e.target.value })}
                    className="w-full text-xs bg-black text-white p-2 rounded border border-white/20"
                    placeholder="Linha 1 do rodapé..."
                  />
                  <input
                    type="text"
                    value={footer.line2}
                    onChange={(e) => handleUpdate('footer', { ...footer, line2: e.target.value })}
                    className="w-full text-xs bg-black text-white p-2 rounded border border-white/20"
                    placeholder="Linha 2 do rodapé..."
                  />
                </div>
              ) : (
                <p className="font-disp font-extrabold text-sm sm:text-base md:text-lg lg:text-[21px] leading-tight tracking-tight text-white">
                  {footer.line1}<br />
                  <span className="font-serif-it italic font-normal text-[#AFC0FF]">{footer.line2}</span>
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