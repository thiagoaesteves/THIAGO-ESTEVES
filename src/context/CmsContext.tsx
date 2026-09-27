import React, { createContext, useContext, useState, useEffect } from 'react';
import { CaseItem, CaseBlock } from '../types';
import { CASES as ORIGINAL_CASES } from '../data/cases';
import { SobreData, ORIGINAL_SOBRE_DATA } from '../data/sobre';

// Use STORAGE_KEY v19 so that user customized texts, tags and project subtitles are preserved
const STORAGE_KEY = 'thiago_portfolio_custom_cases_v19';
const STORAGE_SOBRE_KEY = 'thiago_portfolio_custom_sobre_v1';

interface CmsContextType {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  toggleEditMode: () => void;
  cases: CaseItem[];
  sobre: SobreData;
  hasChanges: boolean;
  updateCaseField: (slug: string, field: keyof CaseItem, value: any) => void;
  updateCaseParagraph: (slug: string, index: number, value: string) => void;
  addCaseParagraph: (slug: string) => void;
  removeCaseParagraph: (slug: string, index: number) => void;
  reorderCases: (draggedSlug: string, targetSlug: string) => void;
  moveCaseOrder: (slug: string, direction: 'up' | 'down') => void;
  reorderCaseImages: (slug: string, sourceIdx: number, targetIdx: number) => void;
  addCaseImage: (slug: string, url: string) => void;
  removeCaseImage: (slug: string, index: number) => void;
  reorderCaseVideos: (slug: string, sourceIdx: number, targetIdx: number) => void;
  addCaseVideo: (slug: string, ytId: string) => void;
  removeCaseVideo: (slug: string, index: number) => void;
  updateCaseBlocks: (slug: string, blocks: CaseBlock[]) => void;
  updateSobreField: <K extends keyof SobreData>(field: K, value: SobreData[K]) => void;
  updateSobreBioParagraph: (index: number, value: string) => void;
  addSobreBioParagraph: () => void;
  removeSobreBioParagraph: (index: number) => void;
  updateSobreStat: (statKey: keyof SobreData['stats'], value: string) => void;
  addSobreSegment: (segment: string) => void;
  removeSobreSegment: (index: number) => void;
  saveChanges: () => void;
  resetToOriginal: () => void;
  exportModalOpen: boolean;
  setExportModalOpen: (val: boolean) => void;
  activeNotification: string | null;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [cases, setCases] = useState<CaseItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep all saved user customized texts, titles, concepts, delivs, and orders
          // Ensure unicred reflects the complete 24 piece campaign gallery from ORIGINAL_CASES
          const unicredOriginal = ORIGINAL_CASES.find((c) => c.slug === 'unicred');
          return parsed.map((c: CaseItem) => {
            if (c.slug === 'unicred' && unicredOriginal) {
              return {
                ...c,
                imgs: unicredOriginal.imgs, // keeps the complete 24 campaign pieces with 4 horizontal + 20 stories
              };
            }
            return c;
          });
        }
      }
    } catch (e) {
      console.error('Erro ao ler casos do localStorage:', e);
    }
    return ORIGINAL_CASES;
  });

  const [sobre, setSobre] = useState<SobreData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SOBRE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...ORIGINAL_SOBRE_DATA, ...parsed };
        }
      }
    } catch (e) {
      console.error('Erro ao ler dados do Sobre do localStorage:', e);
    }
    return ORIGINAL_SOBRE_DATA;
  });

  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => {
      setActiveNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => {
      const next = !prev;
      if (next) {
        showToast('Modo Edição ativado! Arraste itens e clique nos textos para editar.');
      } else {
        showToast('Modo de visualização final ativo.');
      }
      return next;
    });
  };

  // Keyboard shortcut Ctrl+E or Cmd+E to toggle edit mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        toggleEditMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateCaseField = (slug: string, field: keyof CaseItem, value: any) => {
    setCases((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, [field]: value } : c))
    );
    setHasChanges(true);
  };

  const updateCaseParagraph = (slug: string, index: number, value: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.slug !== slug) return c;
        const newText = [...c.text];
        newText[index] = value;
        return { ...c, text: newText };
      })
    );
    setHasChanges(true);
  };

  const addCaseParagraph = (slug: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.slug !== slug) return c;
        return { ...c, text: [...c.text, 'Novo parágrafo de texto...'] };
      })
    );
    setHasChanges(true);
    showToast('Novo parágrafo adicionado.');
  };

  const removeCaseParagraph = (slug: string, index: number) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.slug !== slug) return c;
        const newText = c.text.filter((_, i) => i !== index);
        return { ...c, text: newText };
      })
    );
    setHasChanges(true);
    showToast('Parágrafo removido.');
  };

  const reorderCases = (draggedSlug: string, targetSlug: string) => {
    if (draggedSlug === targetSlug) return;
    setCases((prev) => {
      const fromIndex = prev.findIndex((c) => c.slug === draggedSlug);
      const toIndex = prev.findIndex((c) => c.slug === targetSlug);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const newCases = [...prev];
      const [moved] = newCases.splice(fromIndex, 1);
      newCases.splice(toIndex, 0, moved);
      return newCases;
    });
    setHasChanges(true);
    showToast('Ordem dos projetos atualizada!');
  };

  const moveCaseOrder = (slug: string, direction: 'up' | 'down') => {
    setCases((prev) => {
      const index = prev.findIndex((c) => c.slug === slug);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const newCases = [...prev];
      const [moved] = newCases.splice(index, 1);
      newCases.splice(targetIndex, 0, moved);
      return newCases;
    });
    setHasChanges(true);
    showToast(`Projeto movido para ${direction === 'up' ? 'cima' : 'baixo'}.`);
  };

  const reorderCaseImages = (slug: string, sourceIdx: number, targetIdx: number) => {
    if (sourceIdx === targetIdx) return;
    setCases((prev) =>
      prev.map((c) => {
        if (c.slug !== slug) return c;
        const newImgs = [...c.imgs];
        const [moved] = newImgs.splice(sourceIdx, 1);
        newImgs.splice(targetIdx, 0, moved);
        return { ...c, imgs: newImgs };
      })
    );
    setHasChanges(true);
    showToast('Ordem das peças/imagens atualizada!');
  };

  const addCaseImage = (slug: string, url: string) => {
    if (!url.trim()) return;
    setCases((prev) =>
      prev.map((c) => {
        if (c.slug !== slug) return c;
        return { ...c, imgs: [...c.imgs, url.trim()] };
      })
    );
    setHasChanges(true);
    showToast('Nova peça/imagem adicionada!');
  };

  const removeCaseImage = (slug: string, index: number) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.slug !== slug) return c;
        const newImgs = c.imgs.filter((_, i) => i !== index);
        return { ...c, imgs: newImgs };
      })
    );
    setHasChanges(true);
    showToast('Peça removida.');
  };

  const reorderCaseVideos = (slug: string, sourceIdx: number, targetIdx: number) => {
    if (sourceIdx === targetIdx) return;
    setCases((prev) =>
      prev.map((c) => {
        if (c.slug !== slug) return c;
        const newYt = [...c.yt];
        const [moved] = newYt.splice(sourceIdx, 1);
        newYt.splice(targetIdx, 0, moved);
        return { ...c, yt: newYt };
      })
    );
    setHasChanges(true);
    showToast('Ordem dos vídeos atualizada!');
  };

  const addCaseVideo = (slug: string, input: string) => {
    if (!input.trim()) return;
    // Extract ID if full URL passed
    let videoId = input.trim();
    if (videoId.includes('v=')) {
      videoId = videoId.split('v=')[1]?.split('&')[0] || videoId;
    } else if (videoId.includes('youtu.be/')) {
      videoId = videoId.split('youtu.be/')[1]?.split('?')[0] || videoId;
    }
    setCases((prev) =>
      prev.map((c) => {
        if (c.slug !== slug) return c;
        return { ...c, yt: [...c.yt, videoId] };
      })
    );
    setHasChanges(true);
    showToast('Vídeo adicionado!');
  };

  const removeCaseVideo = (slug: string, index: number) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.slug !== slug) return c;
        const newYt = c.yt.filter((_, i) => i !== index);
        return { ...c, yt: newYt };
      })
    );
    setHasChanges(true);
    showToast('Vídeo removido.');
  };

  const updateCaseBlocks = (slug: string, blocks: CaseBlock[]) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.slug !== slug) return c;
        const text = blocks.filter((b) => b.type === 'text').map((b) => b.value);
        const yt = blocks.filter((b) => b.type === 'video').map((b) => b.value);
        const imgs = blocks.filter((b) => b.type === 'image').map((b) => b.value);
        return {
          ...c,
          blocks,
          text,
          yt,
          imgs,
        };
      })
    );
    setHasChanges(true);
  };

  const updateSobreField = <K extends keyof SobreData>(field: K, value: SobreData[K]) => {
    setSobre((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const updateSobreBioParagraph = (index: number, value: string) => {
    setSobre((prev) => {
      const newBio = [...prev.bio];
      newBio[index] = value;
      return { ...prev, bio: newBio };
    });
    setHasChanges(true);
  };

  const addSobreBioParagraph = () => {
    setSobre((prev) => ({
      ...prev,
      bio: [...prev.bio, 'Novo parágrafo da biografia. Clique para editar.'],
    }));
    setHasChanges(true);
    showToast('Novo parágrafo adicionado à biografia.');
  };

  const removeSobreBioParagraph = (index: number) => {
    setSobre((prev) => ({
      ...prev,
      bio: prev.bio.filter((_, i) => i !== index),
    }));
    setHasChanges(true);
    showToast('Parágrafo da biografia removido.');
  };

  const updateSobreStat = (statKey: keyof SobreData['stats'], value: string) => {
    setSobre((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statKey]: value,
      },
    }));
    setHasChanges(true);
  };

  const addSobreSegment = (segment: string) => {
    if (!segment.trim()) return;
    setSobre((prev) => ({
      ...prev,
      segments: [...prev.segments, segment.trim()],
    }));
    setHasChanges(true);
    showToast('Segmento adicionado!');
  };

  const removeSobreSegment = (index: number) => {
    setSobre((prev) => ({
      ...prev,
      segments: prev.segments.filter((_, i) => i !== index),
    }));
    setHasChanges(true);
    showToast('Segmento removido.');
  };

  const saveChanges = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
      localStorage.setItem(STORAGE_SOBRE_KEY, JSON.stringify(sobre));
      setHasChanges(false);
      showToast('Alterações salvas com sucesso no seu navegador!');
    } catch (e) {
      console.error(e);
      showToast('Erro ao salvar alterações no armazenamento local.');
    }
  };

  const resetToOriginal = () => {
    if (window.confirm('Tem certeza de que deseja restaurar a ordem e os textos originais do portfólio (incluindo a seção Sobre)?')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_SOBRE_KEY);
      setCases(ORIGINAL_CASES);
      setSobre(ORIGINAL_SOBRE_DATA);
      setHasChanges(false);
      showToast('Portfólio restaurado para os dados originais!');
    }
  };

  return (
    <CmsContext.Provider
      value={{
        isEditMode,
        setIsEditMode,
        toggleEditMode,
        cases,
        sobre,
        hasChanges,
        updateCaseField,
        updateCaseParagraph,
        addCaseParagraph,
        removeCaseParagraph,
        reorderCases,
        moveCaseOrder,
        reorderCaseImages,
        addCaseImage,
        removeCaseImage,
        reorderCaseVideos,
        addCaseVideo,
        removeCaseVideo,
        updateCaseBlocks,
        updateSobreField,
        updateSobreBioParagraph,
        addSobreBioParagraph,
        removeSobreBioParagraph,
        updateSobreStat,
        addSobreSegment,
        removeSobreSegment,
        saveChanges,
        resetToOriginal,
        exportModalOpen,
        setExportModalOpen,
        activeNotification,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
