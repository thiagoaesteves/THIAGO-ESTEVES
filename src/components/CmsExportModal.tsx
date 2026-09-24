import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { X, Copy, Check, Download, Code, FileText } from 'lucide-react';

export const CmsExportModal: React.FC = () => {
  const { exportModalOpen, setExportModalOpen, cases } = useCms();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'json' | 'ts'>('json');

  if (!exportModalOpen) return null;

  const jsonString = JSON.stringify(cases, null, 2);

  const tsString = `import { CaseItem } from '../types';

export const CASES: CaseItem[] = ${JSON.stringify(cases, null, 2)};
`;

  const contentToCopy = activeTab === 'json' ? jsonString : tsString;

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
    const filename = activeTab === 'json' ? 'cases.json' : 'cases.ts';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#0F1222] text-[#F6F7F2] border border-white/20 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="font-disp text-xl sm:text-2xl font-bold text-white">
              Exportar Dados do Portfólio
            </h2>
            <p className="text-xs text-[#AFC0FF] font-mono-code mt-0.5">
              Copie o código das suas alterações para salvar permanentemente ou me enviar no chat!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setExportModalOpen(false)}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-white/10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-mono-code text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'json'
                ? 'border-[#D4FF3A] text-[#D4FF3A] bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Formato JSON
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-mono-code text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'ts'
                ? 'border-[#2340FF] text-[#AFC0FF] bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Formato TypeScript (cases.ts)
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-black/40 font-mono-code text-xs text-green-300 select-all">
          <pre className="whitespace-pre-wrap leading-relaxed">{contentToCopy}</pre>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#0F1222]">
          <span className="text-xs text-[#AFC0FF] font-mono-code">
            Total de cases: {cases.length}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono-code text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" /> Baixar arquivo
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-lg font-mono-code text-xs font-bold transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#D4FF3A] hover:bg-[#e2ff6b] text-[#0F1222]'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado para a área de transferência!' : 'Copiar Código'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
