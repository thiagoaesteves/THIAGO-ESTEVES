import React from 'react';
import { Type, Sliders, Sparkles } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { ORIGINAL_HEADLINE_DATA, HeadlinerData } from '../data/headliner';
import { ProfilePhotoBox } from './ProfilePhotoBox';

const FONT_SIZE_MAP: Record<string, string> = {
  sm: 'text-xs sm:text-sm',
  base: 'text-xs sm:text-base leading-snug sm:leading-relaxed',
  lg: 'text-sm sm:text-lg leading-snug sm:leading-relaxed',
  xl: 'text-base sm:text-xl leading-snug sm:leading-relaxed',
};

const TITLE_SIZE_MAP: Record<string, string> = {
  sm: 'text-xl sm:text-3xl',
  base: 'text-2xl sm:text-4xl',
  lg: 'text-2xl sm:text-4xl lg:text-5xl',
  xl: 'text-3xl sm:text-5xl lg:text-6xl',
};

const TEXT_COLOR_MAP: Record<string, { label: string; class: string }> = {
  white: { label: 'Branco Padrão', class: 'text-white/95' },
  accent: { label: 'Verde Limão', class: 'text-[#D4FF3A]' },
  muted: { label: 'Azul Suave', class: 'text-[#AFC0FF]' },
};

const TEXT_STYLE_MAP: Record<string, { label: string; class: string }> = {
  normal: { label: 'Normal', class: 'font-sans font-normal' },
  serifItalic: { label: 'Caligrafia Editorial', class: 'font-serif-it italic font-normal' },
  semibold: { label: 'Destaque Forte', class: 'font-sans font-semibold' },
};

const PARAGRAPH_SIZE_MAP: Record<string, string> = {
  normal: '', 
  lg: 'text-sm sm:text-lg lg:text-[19px] leading-snug sm:leading-snug',
  xl: 'text-base sm:text-xl lg:text-[21px] leading-snug sm:leading-snug',
};

export const HeadlinerSection: React.FC = () => {
  const cms = (useCms() as any) || {};
  const isEditMode = !!cms.isEditMode;
  const headliner: HeadlinerData = cms.headliner || cms.sobre || ORIGINAL_HEADLINE_DATA;
  const updateHeadlinerField = cms.updateHeadlinerField || cms.updateSobreField;
  const updateHeadlinerTypography = cms.updateHeadlinerTypography || cms.updateSobreTypography;

  // Fallback seguro consolidado para evitar qualquer TypeError se headliner estiver indefinido
  const safeHeadliner = { ...ORIGINAL_HEADLINE_DATA, ...(headliner || {}) };

  const currentTitle = safeHeadliner?.title || ORIGINAL_HEADLINE_DATA.title || 'Quem é do Méier não bobéia.';

  const cleanName = (safeHeadliner?.name || ORIGINAL_HEADLINE_DATA.name || 'Thiago Esteves')
    .replace(/\s*undefined\b/gi, '')
    .trim() || 'Thiago Esteves';
  const cleanRole = (safeHeadliner?.role || ORIGINAL_HEADLINE_DATA.role || 'Creative Copywriter & Storyteller')
    .replace(/\s*undefined\b/gi, '')
    .trim() || 'Creative Copywriter & Storyteller';
  const cleanBadge = (safeHeadliner?.badge || ORIGINAL_HEADLINE_DATA.badge || 'Based in Brazil · Available Worldwide')
    .replace(/\s*undefined\b/gi, '')
    .trim() || 'Based in Brazil · Available Worldwide';

  const rawBio = Array.isArray(safeHeadliner?.bio) && safeHeadliner.bio.length > 0 
    ? safeHeadliner.bio 
    : (ORIGINAL_HEADLINE_DATA.bio || [currentTitle]);

  const normalizedBioItems = rawBio.map((item) => {
    if (typeof item === 'string') {
      return { text: item, color: 'white', style: 'normal', size: 'normal' };
    }
    return {
      text: item?.text || '',
      color: item?.color || 'white',
      style: item?.style || 'normal',
      size: item?.size || 'normal',
    };
  });

  const narrativeItems = normalizedBioItems.filter(
    (item) =>
      item.text.trim() !== currentTitle.trim() &&
      !item.text.toLowerCase().includes('quem é do méier')
  );

  const DEFAULT_OFFICIAL_BIO = [
    'E, como uma boa cria da Zona Norte carioca, eu tive que usar a criatividade para me virar e sobreviver desde cedo.',
    'A vida me fez vendedor por muitos anos, até eu deixar de ser ao me tornar publicitário (e continuar vendendo).',
    'Essa sagacidade me ensinou alguns soft skills off label que uso para vender ideias e conceitos nas minhas criações.',
    'Já bati o ponto em agências do Rio de Janeiro, do Sul e de São Paulo, e algumas das minhas ideias já saíram do país.',
    'Amo boas histórias, novas culturas e a minha profissão. Sou apaixonado por música e poesia, mas se você está procurando um músico ou poeta, eu passo a bola, porque o que eu faço bem é criar propaganda.',
  ];

  const effectiveNarrativeItems = narrativeItems.length > 0
    ? narrativeItems
    : DEFAULT_OFFICIAL_BIO.map((text) => ({
        text,
        color: 'white',
        style: 'normal',
        size: 'normal',
      }));

  const fontSizeKey = safeHeadliner?.typography?.fontSize || 'base';
  const titleSizeKey = safeHeadliner?.typography?.titleSize || 'lg';
  const globalBodySizeClass = FONT_SIZE_MAP[fontSizeKey] || FONT_SIZE_MAP.base;
  const titleSizeClass = TITLE_SIZE_MAP[titleSizeKey] || TITLE_SIZE_MAP.lg;
  const photoUrl = safeHeadliner?.photoUrl || ORIGINAL_HEADLINE_DATA.photoUrl;

  const titleParts = currentTitle.includes('Méier')
    ? [
        currentTitle.substring(0, currentTitle.indexOf('Méier') + 5),
        currentTitle.substring(currentTitle.indexOf('Méier') + 5).trim(),
      ]
    : [currentTitle, ''];

  const handleUpdateField = (field: string, val: any) => {
    if (typeof updateHeadlinerField === 'function') {
      updateHeadlinerField(field, val);
    }
  };

  const handleUpdateTypography = (key: string, val: any) => {
    if (typeof updateHeadlinerTypography === 'function') {
      updateHeadlinerTypography(key, val);
    }
  };

  return (
    <section
      id="headliner"
      className="w-full bg-[#2340FF] text-white flex flex-col justify-between py-16 sm:py-24 px-6 sm:px-10 lg:px-16 scroll-mt-[69px] sm:scroll-mt-[73px] relative min-h-screen min-h-[100dvh] overflow-hidden"
    >
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" 
        aria-hidden="true" 
      />

      <div className="max-w-[1600px] w-full mx-auto my-auto flex flex-col justify-between relative z-10 space-y-4 sm:space-y-6 lg:space-y-8">
        
        {isEditMode && (
          <div className="flex flex-wrap items-center gap-3 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-[#D4FF3A]/30 text-xs font-mono-code mb-1 shadow-xl">
            <div className="flex items-center gap-1 text-[#D4FF3A] font-bold text-[10px] uppercase">
              <Sliders className="w-3 h-3" /> Corpo Global:
            </div>
            <div className="flex items-center gap-1 border-l border-white/20 pl-2">
              {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleUpdateTypography('fontSize', sz)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    fontSizeKey === sz
                      ? 'bg-[#D4FF3A] text-[#0F1222] font-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {sz === 'sm' ? 'P' : sz === 'base' ? 'M' : sz === 'lg' ? 'G' : 'GG'}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 xl:gap-12 items-center">
          
          <div className="lg:col-span-5 flex justify-center lg:justify-start items-center">
            <ProfilePhotoBox
              isEditMode={isEditMode}
              cleanName={cleanName}
              cleanRole={cleanRole}
              cleanBadge={cleanBadge}
              defaultPhotoUrl={photoUrl}
              onPhotoUpdated={(url) => handleUpdateField('photoUrl', url)}
              renderTextLayer={
                <>
                  {isEditMode ? (
                    <div className="space-y-1 w-full bg-black/60 p-2 rounded-lg border border-white/20 mb-1">
                      <input
                        type="text"
                        value={cleanName}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\s*undefined\b/gi, '').trim();
                          handleUpdateField('name', val);
                        }}
                        className="font-disp font-extrabold text-sm text-white bg-black/50 border border-white/30 rounded px-1.5 py-0.5 w-full focus:outline-none focus:border-[#D4FF3A]"
                        placeholder="Nome..."
                      />
                      <input
                        type="text"
                        value={cleanRole}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\s*undefined\b/gi, '').trim();
                          handleUpdateField('role', val);
                        }}
                        className="font-serif-it text-xs text-[#AFC0FF] bg-black/50 border border-white/30 rounded px-1.5 py-0.5 w-full focus:outline-none focus:border-[#D4FF3A]"
                        placeholder="Cargo..."
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-disp font-extrabold text-lg sm:text-xl lg:text-[22px] xl:text-[24px] text-white tracking-tight leading-tight">
                        {cleanName}
                      </h3>
                      <p className="font-serif-it text-xs sm:text-sm lg:text-[14px] xl:text-[15px] text-[#AFC0FF] italic leading-snug mt-0.5">
                        {cleanRole}
                      </p>
                    </>
                  )}
                  <span className="font-mono-code text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-wider text-[#D4FF3A] font-semibold block leading-normal mt-1.5 select-none">
                    {cleanBadge}
                  </span>
                </>
              }
            />
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center space-y-2.5 sm:space-y-4">
            
            {isEditMode ? (
              <div className="space-y-1">
                <label className="text-[10px] font-mono-code text-[#D4FF3A] font-bold flex items-center gap-1">
                  <Type className="w-3 h-3" /> Título Principal:
                </label>
                <input
                  type="text"
                  value={currentTitle}
                  onChange={(e) => handleUpdateField('title', e.target.value)}
                  className={`w-full font-disp font-extrabold ${titleSizeClass} tracking-[-0.03em] text-white bg-black/40 border border-[#D4FF3A] rounded-xl px-3 py-1.5 focus:outline-none`}
                />
              </div>
            ) : (
              <div>
                <h2 className={`font-disp font-extrabold ${titleSizeClass} tracking-[-0.03em] text-white leading-tight sm:leading-[1.08] relative break-words`}>
                  <span className="text-[#D4FF3A] font-serif select-none mr-1.5 inline-block -translate-y-0.5">“</span>
                  {titleParts[0]}
                  <br />
                  <span className="font-disp font-extrabold text-white">
                    {titleParts[1]}
                  </span>
                  <span className="text-[#D4FF3A] font-serif select-none ml-1.5 inline-block -translate-y-0.5">”</span>
                </h2>
              </div>
            )}

            {isEditMode ? (
              <div className="space-y-4">
                <label className="text-[10px] font-mono-code text-[#D4FF3A] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Parágrafos & Personalização Editorial:
                </label>
                {effectiveNarrativeItems.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/50 border border-white/20 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-mono-code text-[#AFC0FF] font-bold">
                        Parágrafo {idx + 1}
                      </span>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <select
                          value={item.color}
                          onChange={(e) => {
                            const newItems = [...effectiveNarrativeItems];
                            newItems[idx] = { ...newItems[idx], color: e.target.value };
                            handleUpdateField('bio', [currentTitle, ...newItems]);
                          }}
                          className="bg-black text-[10px] font-mono-code text-[#D4FF3A] border border-[#D4FF3A]/40 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                        >
                          <option value="white">Cor: Branco</option>
                          <option value="accent">Cor: Verde Limão</option>
                          <option value="muted">Cor: Azul Suave</option>
                        </select>

                        <select
                          value={item.style}
                          onChange={(e) => {
                            const newItems = [...effectiveNarrativeItems];
                            newItems[idx] = { ...newItems[idx], style: e.target.value };
                            handleUpdateField('bio', [currentTitle, ...newItems]);
                          }}
                          className="bg-black text-[10px] font-mono-code text-white border border-white/30 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                        >
                          <option value="normal">Estilo: Normal</option>
                          <option value="serifItalic">Estilo: Caligrafia (Itálico)</option>
                          <option value="semibold">Estilo: Destaque Forte</option>
                        </select>

                        <select
                          value={item.size}
                          onChange={(e) => {
                            const newItems = [...effectiveNarrativeItems];
                            newItems[idx] = { ...newItems[idx], size: e.target.value };
                            handleUpdateField('bio', [currentTitle, ...newItems]);
                          }}
                          className="bg-black text-[10px] font-mono-code text-[#AFC0FF] border border-white/30 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                        >
                          <option value="normal">Tamanho: Padrão</option>
                          <option value="lg">Tamanho: Maior (L)</option>
                          <option value="xl">Tamanho: Destaque (XL)</option>
                        </select>
                      </div>
                    </div>

                    <textarea
                      value={item.text}
                      rows={3}
                      onChange={(e) => {
                        const newItems = [...effectiveNarrativeItems];
                        newItems[idx] = { ...newItems[idx], text: e.target.value };
                        handleUpdateField('bio', [currentTitle, ...newItems]);
                      }}
                      className="w-full text-xs font-sans leading-relaxed bg-black/70 border border-white/20 p-2 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#D4FF3A] resize-y"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {effectiveNarrativeItems.map((item, idx) => {
                  const colorClass = TEXT_COLOR_MAP[item.color]?.class || 'text-white/95';
                  const styleClass = TEXT_STYLE_MAP[item.style]?.class || 'font-sans font-normal';
                  const individualSizeClass = item.size && item.size !== 'normal' 
                    ? PARAGRAPH_SIZE_MAP[item.size] 
                    : globalBodySizeClass;

                  return (
                    <p 
                      key={idx} 
                      className={`${colorClass} ${styleClass} ${individualSizeClass} whitespace-pre-line transition-colors duration-300`}
                    >
                      {item.text}
                    </p>
                  );
                })}
              </div>
            )}

          </div>
        </div>

        <div className="pt-3.5 sm:pt-5 border-t border-white/20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-8 lg:gap-12">
            
            <div className="flex flex-col space-y-0.5 sm:space-y-1">
              <span className="font-disp text-[11px] sm:text-sm lg:text-[14px] text-white uppercase tracking-[0.14em] font-black block leading-none">
                REPERTÓRIO
              </span>
              <span className="font-disp text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-white block leading-none pt-0.5">
                {safeHeadliner?.stats?.stat2Number || ORIGINAL_HEADLINE_DATA.stats.stat2Number || '50+'}
              </span>
              <div className="space-y-0.5 pt-0.5">
                <span className="text-white text-[10px] sm:text-[11px] font-mono-code font-bold uppercase tracking-wider block leading-tight">
                  {safeHeadliner?.stats?.stat2Label || ORIGINAL_HEADLINE_DATA.stats.stat2Label || 'marcas atendidas'}
                </span>
                <span className="text-[#AFC0FF] text-[10px] sm:text-[11px] font-mono-code block leading-tight">
                  {safeHeadliner?.stats?.stat2Sub || ORIGINAL_HEADLINE_DATA.stats.stat2Sub || 'nacionais e multinacionais'}
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-0.5 sm:space-y-1">
              <span className="font-disp text-[11px] sm:text-sm lg:text-[14px] text-white uppercase tracking-[0.14em] font-black block leading-none">
                TURNÊS
              </span>
              <span className="font-disp text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-white block leading-none pt-0.5">
                {safeHeadliner?.stats?.stat3Number || ORIGINAL_HEADLINE_DATA.stats.stat3Number || '3 + 3'}
              </span>
              <div className="space-y-0.5 pt-0.5">
                <span className="text-white text-[10px] sm:text-[11px] font-mono-code font-bold uppercase tracking-wider block leading-tight">
                  {safeHeadliner?.stats?.stat3Label || ORIGINAL_HEADLINE_DATA.stats.stat3Label || 'praças & países'}
                </span>
                <span className="text-[#AFC0FF] text-[10px] sm:text-[11px] font-mono-code block leading-tight">
                  {safeHeadliner?.stats?.stat3Sub || ORIGINAL_HEADLINE_DATA.stats.stat3Sub || 'RJ, Sul, SP · Brasil, EUA & Espanha'}
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-0.5 sm:space-y-1">
              <span className="font-disp text-[11px] sm:text-sm lg:text-[14px] text-white uppercase tracking-[0.14em] font-black block leading-none">
                BAGAGEM
              </span>
              <span className="font-disp text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-white block leading-none pt-0.5">
                {safeHeadliner?.stats?.stat1Number || ORIGINAL_HEADLINE_DATA.stats.stat1Number || '15+'}
              </span>
              <div className="space-y-0.5 pt-0.5">
                <span className="text-white text-[10px] sm:text-[11px] font-mono-code font-bold uppercase tracking-wider block leading-tight">
                  {safeHeadliner?.stats?.stat1Label || ORIGINAL_HEADLINE_DATA.stats.stat1Label || 'anos de estrada'}
                </span>
                <span className="text-[#AFC0FF] text-[10px] sm:text-[11px] font-mono-code block leading-tight">
                  {safeHeadliner?.stats?.stat1Sub || ORIGINAL_HEADLINE_DATA.stats.stat1Sub || 'e muita história pra contar'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HeadlinerSection;
