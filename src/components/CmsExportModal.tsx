import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { X, Copy, Check, Download, Code, FileText, User } from 'lucide-react';

export const CmsExportModal: React.FC = () => {
  const { exportModalOpen, setExportModalOpen, cases, headliner, sobre } = useCms();
  const currentHeadliner = headliner || sobre;
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'cases-json' | 'cases-ts' | 'headliner-json' | 'headliner-ts'>('cases-json');

  if (!exportModalOpen) return null;

  const casesJson = JSON.stringify(cases, null, 2);
  const casesTs = `import { CaseItem } from '../types';

export const CASES: CaseItem[] = ${JSON.stringify(cases, null, 2)};
`;

  const headlinerJson = JSON.stringify(currentHeadliner, null, 2);
  const headlinerTs = `import { HeadlinerData } from '../data/headliner';

export const ORIGINAL_HEADLINE_DATA: HeadlinerData = ${JSON.stringify(currentHeadliner, null, 2)};
`;

  let contentToCopy = casesJson;
  let filename = 'cases.json';

  if (activeTab === 'cases-json') {
    contentToCopy = casesJson;
    filename = 'cases.json';
  } else if (activeTab === 'cases-ts') {
    contentToCopy = casesTs;
    filename = 'cases.ts';
  } else if (activeTab === 'headliner-json') {
    contentToCopy = headlinerJson;
    filename = 'headliner.json';
  } else if (activeTab === 'headliner-ts') {
    contentToCopy = headlinerTs;
    filename = 'headliner.ts';
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Falha ao copiar:', e);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([contentToCopy], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#0F1222] text-[#F6F7F2] border border-white/20 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="font-disp text-lg sm:text-2xl font-bold text-white flex flex-wrap items-center gap-2">
              <span>Exportar Dados Atualizados</span>
              <span className="text-[11px] sm:text-xs font-mono-code font-normal px-2 py-0.5 rounded bg-[#2340FF] text-white">
                Para Netlify & Git
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-[#AFC0FF] font-mono-code mt-0.5">
              Baixe os arquivos JSON ou TypeScript contendo todos os novos textos e imagens Base64.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setExportModalOpen(false)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fechar modal de exportação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Netlify Deployment Instructions Banner */}
        <div className="bg-[#2340FF]/20 border-b border-white/10 px-4 sm:px-6 py-3 flex items-start gap-2.5 sm:gap-3 text-xs font-mono-code text-[#AFC0FF]">
          <span className="text-base select-none">💡</span>
          <div className="space-y-1">
            <p className="text-white font-semibold">
              Como publicar permanentemente no Netlify para qualquer visitante:
            </p>
            <ol className="list-decimal list-inside space-y-0.5 text-white/85 text-[11px] sm:text-xs">
              <li>Clique em <b>"Baixar cases.ts"</b> (ou <b>"Baixar cases.json"</b>).</li>
              <li>Substitua o arquivo na pasta <code className="text-[#D4FF3A] bg-black/50 px-1.5 py-0.5 rounded">src/data/cases.ts</code> do seu projeto.</li>
              <li>Envie para o GitHub (<code className="text-[#D4FF3A] bg-black/50 px-1 py-0.5 rounded">git commit & push</code>). O Netlify reconstruirá o site com todas as suas novidades!</li>
            </ol>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-6 pt-3 sm:pt-4 border-b border-white/10 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('cases-json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-mono-code text-xs font-semibold border-b-2 transition-colors cursor-pointer shrink-0 min-h-[36px] ${
              activeTab === 'cases-json'
                ? 'border-[#D4FF3A] text-[#D4FF3A] bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Cases (JSON)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cases-ts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-mono-code text-xs font-semibold border-b-2 transition-colors cursor-pointer shrink-0 min-h-[36px] ${
              activeTab === 'cases-ts'
                ? 'border-[#2340FF] text-[#AFC0FF] bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Cases (TypeScript)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('headliner-json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-mono-code text-xs font-semibold border-b-2 transition-colors cursor-pointer shrink-0 min-h-[36px] ${
              activeTab === 'headliner-json'
                ? 'border-[#FF4FA0] text-[#FF4FA0] bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Seção Headliner (JSON)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('headliner-ts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-mono-code text-xs font-semibold border-b-2 transition-colors cursor-pointer shrink-0 min-h-[36px] ${
              activeTab === 'headliner-ts'
                ? 'border-[#D4FF3A] text-[#D4FF3A] bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Seção Headliner (TypeScript)
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-black/40 font-mono-code text-xs text-green-300 select-all max-h-[42vh] sm:max-h-[50vh]">
          <pre className="whitespace-pre-wrap leading-relaxed">{contentToCopy}</pre>
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#0F1222]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#AFC0FF] font-mono-code">
              Visualizando: <b className="text-white">{filename}</b>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2340FF] hover:bg-[#1B34D6] text-white font-mono-code text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105"
            >
              <Download className="w-4 h-4 text-[#D4FF3A]" /> Baixar {filename}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D4FF3A] text-[#0F1222] font-mono-code text-xs font-bold hover:bg-[#e4ff70] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copiar Código
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
