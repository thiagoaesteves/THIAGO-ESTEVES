import React from 'react';
import { useCms } from '../context/CmsContext';
import {
  Save,
  Download,
  RotateCcw,
  Check,
  Move,
  Type,
  X,
  Sparkles,
} from 'lucide-react';

export const CmsToolbar: React.FC = () => {
  const {
    isEditMode,
    toggleEditMode,
    hasChanges,
    saveChanges,
    resetToOriginal,
    setExportModalOpen,
    activeNotification,
  } = useCms();

  if (!isEditMode && !activeNotification) {
    return null;
  }

  return (
    <>
      {/* Toast Notification */}
      {activeNotification && (
        <div className="fixed top-20 right-6 z-50 bg-[#0F1222] text-white px-5 py-3 rounded-lg shadow-2xl border border-white/20 flex items-center gap-3 animate-fade-in font-mono-code text-xs">
          <Sparkles className="w-4 h-4 text-[#D4FF3A] shrink-0" />
          <span>{activeNotification}</span>
        </div>
      )}

      {/* Floating Bottom Toolbar when in Edit Mode */}
      {isEditMode && (
        <aside
          aria-label="Barra do Modo Edição"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl bg-[#0F1222]/95 backdrop-blur-md text-white px-4 sm:px-6 py-3 rounded-2xl shadow-2xl border border-white/20 flex flex-wrap items-center justify-between gap-3 animate-fade-in"
        >
          {/* Left badge and hints */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#2340FF] text-white text-xs font-mono-code font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#D4FF3A] animate-pulse" />
              Modo Edição
            </span>

            <div className="hidden md:flex items-center gap-4 text-xs text-[#AFC0FF] font-mono-code">
              <span className="flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-[#D4FF3A]" /> Arraste para ordenar
              </span>
              <span className="flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#D4FF3A]" /> Clique no texto para editar
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Save Button */}
            <button
              type="button"
              onClick={saveChanges}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-mono-code font-bold cursor-pointer transition-all ${
                hasChanges
                  ? 'bg-[#D4FF3A] hover:bg-[#e4ff70] text-[#0F1222] shadow-lg animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="Salvar alterações no navegador"
            >
              {hasChanges ? <Save className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5 text-[#D4FF3A]" />}
              {hasChanges ? 'Salvar Alterações' : 'Salvo no navegador'}
            </button>

            {/* Export JSON / Code Button */}
            <button
              type="button"
              onClick={() => setExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code font-semibold bg-white/10 hover:bg-white/20 text-[#AFC0FF] hover:text-white transition-colors cursor-pointer"
              title="Exportar código e JSON das alterações"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar Dados</span>
            </button>

            {/* Reset to Original Button */}
            <button
              type="button"
              onClick={resetToOriginal}
              className="p-1.5 rounded-lg text-xs text-[#AFC0FF] hover:text-[#FF4FA0] hover:bg-white/10 transition-colors cursor-pointer"
              title="Restaurar dados originais"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Exit Edit Mode */}
            <button
              type="button"
              onClick={toggleEditMode}
              className="p-1.5 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
              title="Sair do Modo Edição"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}
    </>
  );
};
