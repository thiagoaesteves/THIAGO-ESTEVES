import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface LightboxModalProps {
  imgUrl: string | null;
  title?: string;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  imgUrl,
  title,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!imgUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Top toolbar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20 pointer-events-auto"
      >
        <div className="font-mono-code text-xs text-[#AFC0FF] truncate max-w-[70%]">
          {title || 'Visualização da Peça'}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          title="Fechar (Esc)"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-full max-h-[85vh] flex items-center justify-center p-2"
      >
        <img
          src={imgUrl}
          alt={title || 'Peça ampliada'}
          className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl select-none"
          loading="eager"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};
