import React, { createContext, useContext, useState, useEffect } from 'react';
import { CaseItem, CaseBlock, GridSpanType } from '../types';
import { CASES as ORIGINAL_CASES } from '../data/cases';
import { SobreData, ORIGINAL_SOBRE_DATA, SobreTypography } from '../data/sobre';
import {
  fetchCloudPortfolio,
  saveCloudPortfolio,
  testFirestoreConnection,
  SectionGridSettings,
} from '../lib/firebase';

// Storage keys for resilient local fallback cache
const STORAGE_KEY = 'thiago_portfolio_custom_cases_v19';
const STORAGE_SOBRE_KEY = 'thiago_portfolio_custom_sobre_v2';
const STORAGE_LAYOUT_KEY = 'thiago_portfolio_grid_columns';
const STORAGE_GRIDS_KEY = 'thiago_portfolio_section_grids_v1';

interface CmsContextType {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  toggleEditMode: () => void;
  iniciarModoEdicao: () => void;
  triggerAdminEasterEgg: () => void;
  changePassword: () => void;
  cases: CaseItem[];
  sobre: SobreData;
  gridLadoA: 1 | 2 | 3;
  gridLadoB: 1 | 2 | 3;
  gridBonus: 1 | 2 | 3;
  setGridLadoA: (cols: 1 | 2 | 3) => void;
  setGridLadoB: (cols: 1 | 2 | 3) => void;
  setGridBonus: (cols: 1 | 2 | 3) => void;
  gridColumns: 1 | 2 | 3;
  setGridColumns: (cols: 1 | 2 | 3) => void;
  hasChanges: boolean;
  isSaving: boolean;
  isCloudLoaded: boolean;
  updateCaseField: (slug: string, field: keyof CaseItem, value: any) => void;
  updateCaseGridSpan: (slug: string, span: GridSpanType) => Promise<void>;
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
  updateSobreTypography: (key: keyof SobreTypography, value: any) => void;
  addSobreSegment: (segment: string) => void;
  removeSobreSegment: (index: number) => void;
  saveChanges: () => Promise<void>;
  resetToOriginal: () => Promise<void>;
  exportModalOpen: boolean;
  setExportModalOpen: (val: boolean) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (val: boolean) => void;
  addNewCase: (caseData: {
    name: string;
    concept: string;
    lado: 'A' | 'B' | 'bonus';
    deliv?: string;
    cover: string;
    text: string[];
    imgs?: string[];
    yt?: string[];
    gridSpan?: GridSpanType;
  }) => Promise<CaseItem>;
  activeNotification: string | null;
  showToast: (msg: string) => void;
  exportCasesJson: () => void;
  exportCasesTs: () => void;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isCloudLoaded, setIsCloudLoaded] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Initial load from local cache fallback
  const [cases, setCases] = useState<CaseItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const unicredOriginal = ORIGINAL_CASES.find((c) => c.slug === 'unicred');
          return parsed.map((c: CaseItem) => {
            if (c.slug === 'unicred' && unicredOriginal) {
              return {
                ...c,
                imgs: unicredOriginal.imgs,
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

  const [gridSettings, setGridSettings] = useState<SectionGridSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GRIDS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            gridLadoA: (parsed.gridLadoA === 1 || parsed.gridLadoA === 2 || parsed.gridLadoA === 3) ? parsed.gridLadoA : 2,
            gridLadoB: (parsed.gridLadoB === 1 || parsed.gridLadoB === 2 || parsed.gridLadoB === 3) ? parsed.gridLadoB : 3,
            gridBonus: (parsed.gridBonus === 1 || parsed.gridBonus === 2 || parsed.gridBonus === 3) ? parsed.gridBonus : 2,
          };
        }
      }
    } catch (e) {
      // ignore
    }
    return { gridLadoA: 2, gridLadoB: 3, gridBonus: 2 };
  });

  const setGridLadoA = (cols: 1 | 2 | 3) => {
    setGridSettings((prev) => {
      const updated = { ...prev, gridLadoA: cols };
      try {
        localStorage.setItem(STORAGE_GRIDS_KEY, JSON.stringify(updated));
        localStorage.setItem(STORAGE_LAYOUT_KEY, String(cols));
      } catch (e) {}
      return updated;
    });
    setHasChanges(true);
  };

  const setGridLadoB = (cols: 1 | 2 | 3) => {
    setGridSettings((prev) => {
      const updated = { ...prev, gridLadoB: cols };
      try {
        localStorage.setItem(STORAGE_GRIDS_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setHasChanges(true);
  };

  const setGridBonus = (cols: 1 | 2 | 3) => {
    setGridSettings((prev) => {
      const updated = { ...prev, gridBonus: cols };
      try {
        localStorage.setItem(STORAGE_GRIDS_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setHasChanges(true);
  };

  const setGridColumns = (cols: 1 | 2 | 3) => {
    setGridLadoA(cols);
  };

  // Load latest published data directly from Cloud Firestore for all visitors
  useEffect(() => {
    testFirestoreConnection();

    fetchCloudPortfolio()
      .then((cloudData) => {
        if (cloudData.cases && Array.isArray(cloudData.cases) && cloudData.cases.length > 0) {
          setCases(cloudData.cases);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData.cases));
          } catch (e) {
            // ignore local storage quota
          }
        }
        if (cloudData.sobre && typeof cloudData.sobre === 'object') {
          setSobre(cloudData.sobre);
          try {
            localStorage.setItem(STORAGE_SOBRE_KEY, JSON.stringify(cloudData.sobre));
          } catch (e) {
            // ignore local storage quota
          }
        }
        if (cloudData.gridSettings) {
          setGridSettings(cloudData.gridSettings);
          try {
            localStorage.setItem(STORAGE_GRIDS_KEY, JSON.stringify(cloudData.gridSettings));
            localStorage.setItem(STORAGE_LAYOUT_KEY, String(cloudData.gridSettings.gridLadoA));
          } catch (e) {
            // ignore
          }
        } else if (cloudData.gridColumns === 1 || cloudData.gridColumns === 2 || cloudData.gridColumns === 3) {
          setGridSettings({
            gridLadoA: cloudData.gridColumns,
            gridLadoB: cloudData.gridColumns === 1 ? 1 : 3,
            gridBonus: cloudData.gridColumns,
          });
        }
        setIsCloudLoaded(true);
      })
      .catch((err) => {
        console.warn('Falha na sincronização inicial com a nuvem (usando cache local):', err);
        setIsCloudLoaded(true);
      });
  }, []);

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

  const iniciarModoEdicao = () => {
    setIsEditMode(true);
    showToast('Modo Edição Ativado com sucesso!');
  };

  // Expor iniciarModoEdicao globalmente no objeto window para acesso direto e infalível
  useEffect(() => {
    (window as any).iniciarModoEdicao = iniciarModoEdicao;
    return () => {
      delete (window as any).iniciarModoEdicao;
    };
  }, []);

  const triggerAdminEasterEgg = () => {
    if (isEditMode) {
      showToast('O Modo Edição já está ativo.');
      return;
    }

    const senhaSalva = localStorage.getItem('editPassword') || 'criadoRJ';
    const tentativa = window.prompt('Digite a senha para acessar o Modo Edição:');
    if (tentativa === null) {
      // Prompt cancelado pelo usuário
      return;
    }
    if (tentativa.trim() === senhaSalva.trim()) {
      iniciarModoEdicao();
    } else {
      alert('Senha incorreta.');
    }
  };

  const changePassword = () => {
    const newPassword = window.prompt('Digite a nova senha para o Modo Edição:');
    if (newPassword === null) return;
    if (!newPassword.trim()) {
      alert('A senha não pode ser vazia.');
      return;
    }
    const confirmPassword = window.prompt('Confirme a nova senha:');
    if (confirmPassword === null) return;
    if (newPassword.trim() !== confirmPassword.trim()) {
      alert('As senhas não coincidem. Nenhuma alteração foi realizada.');
      return;
    }
    localStorage.setItem('editPassword', newPassword.trim());
    showToast('Senha alterada com sucesso! Guarde-a com segurança.');
  };

  // Gatilhos Secretos de Acesso ao Modo Edição:
  // 1. Atalho de teclado: Ctrl + Shift + E (ou Cmd + Shift + E no Mac)
  // 2. Gatilho por URL: #edit (ex: meudominio.com/#edit)
  // 3. Clique no elemento trigger-esteves no rodapé
  useEffect(() => {
    // 1. Atalho de teclado Ctrl + Shift + E / Cmd + Shift + E
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      if (isCmdOrCtrl && e.shiftKey && (e.key === 'E' || e.key === 'e' || e.code === 'KeyE')) {
        e.preventDefault();
        e.stopPropagation();
        triggerAdminEasterEgg();
      }
    };

    // 2. Gatilho por URL hash #edit
    const checkUrlHash = () => {
      const hash = window.location.hash;
      if (hash === '#edit' || hash === '#/edit') {
        // Limpar o hash da URL para não deixar vestígios na barra de endereços
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } else {
          window.location.hash = '';
        }
        triggerAdminEasterEgg();
      }
    };

    // 3. Clique em trigger-esteves
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isTrigger = target.closest('#trigger-esteves, [data-trigger-esteves="true"]');
      if (isTrigger) {
        e.preventDefault();
        e.stopPropagation();
        triggerAdminEasterEgg();
      }
    };

    // Executa verificação inicial de hash na URL
    checkUrlHash();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', checkUrlHash);
    document.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkUrlHash);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isEditMode]);

  const updateCaseField = (slug: string, field: keyof CaseItem, value: any) => {
    setCases((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, [field]: value } : c))
    );
    setHasChanges(true);
  };

  const updateCaseGridSpan = async (slug: string, span: GridSpanType) => {
    let updatedCasesList: CaseItem[] = [];
    setCases((prev) => {
      updatedCasesList = prev.map((c) => (c.slug === slug ? { ...c, gridSpan: span } : c));
      return updatedCasesList;
    });

    const spanLabel =
      span === 'full'
        ? 'Destaque (100% da linha)'
        : span === 'half'
        ? 'Médio (50% da linha)'
        : 'Compacto (33% da linha)';

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCasesList));
    } catch (e) {
      console.warn('Erro ao atualizar cache local:', e);
    }

    const cloudRes = await saveCloudPortfolio(updatedCasesList, sobre, gridSettings);
    if (cloudRes.success) {
      setHasChanges(false);
      showToast(`Layout alterado para ${spanLabel} e salvo na nuvem.`);
    } else {
      showToast(`Layout alterado localmente. Nuvem: ${cloudRes.error || 'Aviso de sincronização'}`);
    }
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
      
      // Keep section assignment in sync with target position
      const targetItem = prev[toIndex];
      moved.lado = targetItem.lado;

      newCases.splice(toIndex, 0, moved);
      return newCases;
    });
    setHasChanges(true);
    showToast('Ordem dos projetos atualizada!');
  };

  const moveCaseOrder = (slug: string, direction: 'up' | 'down') => {
    setCases((prev) => {
      const currentItem = prev.find((c) => c.slug === slug);
      if (!currentItem) return prev;

      // Find items in the exact same section (Lado A, Lado B, or Faixa Bonus)
      const lado = currentItem.lado;
      const sectionCases = prev.filter((c) => c.lado === lado);

      const sectionIndex = sectionCases.findIndex((c) => c.slug === slug);
      if (sectionIndex === -1) return prev;

      const targetSectionIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
      if (targetSectionIndex < 0 || targetSectionIndex >= sectionCases.length) return prev;

      const targetItem = sectionCases[targetSectionIndex];
      const fromGlobalIndex = prev.findIndex((c) => c.slug === slug);
      const toGlobalIndex = prev.findIndex((c) => c.slug === targetItem.slug);
      if (fromGlobalIndex === -1 || toGlobalIndex === -1) return prev;

      const newCases = [...prev];
      const [moved] = newCases.splice(fromGlobalIndex, 1);
      newCases.splice(toGlobalIndex, 0, moved);
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
        const text = blocks
          .filter((b) => b.type === 'text')
          .flatMap((b) => b.value.split(/\n\s*\n/).filter((p) => p.trim()));
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

  const updateSobreTypography = (key: keyof SobreTypography, value: any) => {
    setSobre((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value,
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

  const addNewCase = async (caseData: {
    name: string;
    concept: string;
    lado: 'A' | 'B' | 'bonus';
    deliv?: string;
    cover: string;
    text: string[];
    imgs?: string[];
    yt?: string[];
    gridSpan?: GridSpanType;
  }): Promise<CaseItem> => {
    setIsSaving(true);

    // Helper slug generator
    const baseSlug = caseData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `projeto-${Date.now()}`;

    let finalSlug = baseSlug;
    let counter = 1;
    while (cases.some((c) => c.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const countOnLado = cases.filter((c) => c.lado === caseData.lado).length;
    const faixaNum = countOnLado + 1;
    const faixa = `FAIXA ${faixaNum < 10 ? '0' + faixaNum : faixaNum}`;

    const newCaseItem: CaseItem = {
      slug: finalSlug,
      lado: caseData.lado,
      faixa,
      name: caseData.name.trim(),
      concept: caseData.concept.trim(),
      deliv: caseData.deliv?.trim() || 'PROJETO & CONCEITO',
      gridSpan: caseData.gridSpan || 'half',
      cover:
        caseData.cover.trim() ||
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
      text: caseData.text.length > 0 ? caseData.text : [caseData.concept],
      imgs: caseData.imgs || [],
      yt: caseData.yt || [],
      blocks: [
        {
          id: `block-${Date.now()}-1`,
          type: 'text',
          value: caseData.text.join('\n\n') || caseData.concept,
        },
      ],
    };

    const newCasesList = [newCaseItem, ...cases];
    setCases(newCasesList);

    // Persist to local cache
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCasesList));
      localStorage.setItem(STORAGE_GRIDS_KEY, JSON.stringify(gridSettings));
      localStorage.setItem(STORAGE_LAYOUT_KEY, String(gridSettings.gridLadoA));
    } catch (e) {
      console.warn('Erro ao atualizar cache local:', e);
    }

    // Persist directly to Cloud Firestore
    const cloudRes = await saveCloudPortfolio(newCasesList, sobre, gridSettings);
    setIsSaving(false);

    if (cloudRes.success) {
      setHasChanges(false);
      showToast(`Projeto "${newCaseItem.name}" publicado na nuvem com sucesso!`);
    } else {
      showToast(`Projeto criado localmente. Nuvem: ${cloudRes.error || 'Aviso de conexão'}`);
    }

    return newCaseItem;
  };

  const saveChanges = async () => {
    setIsSaving(true);

    // 1. Immediately persist to localStorage as resilient offline cache
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
      localStorage.setItem(STORAGE_SOBRE_KEY, JSON.stringify(sobre));
      localStorage.setItem(STORAGE_GRIDS_KEY, JSON.stringify(gridSettings));
      localStorage.setItem(STORAGE_LAYOUT_KEY, String(gridSettings.gridLadoA));
    } catch (e) {
      console.warn('Erro ao atualizar cache local:', e);
    }

    // 2. Publish to Cloud Firestore for all visitors worldwide
    const cloudRes = await saveCloudPortfolio(cases, sobre, gridSettings);
    setIsSaving(false);

    if (cloudRes.success) {
      setHasChanges(false);
      showToast('Alterações salvas e sincronizadas na nuvem com sucesso!');
    } else {
      showToast(`Salvo localmente. Erro na nuvem: ${cloudRes.error || 'Falha de conexão'}`);
    }
  };

  const exportCasesJson = () => {
    try {
      const dataStr = JSON.stringify(cases, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cases.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Ficheiro cases.json descarregado com sucesso!');
    } catch (e) {
      console.error(e);
      showToast('Erro ao gerar ficheiro JSON.');
    }
  };

  const exportCasesTs = () => {
    try {
      const code = `import { CaseItem } from '../types';\n\nexport const CASES: CaseItem[] = ${JSON.stringify(cases, null, 2)};\n`;
      const blob = new Blob([code], { type: 'text/typescript;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cases.ts';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Ficheiro cases.ts pronto para substituir em src/data/cases.ts!');
    } catch (e) {
      console.error(e);
      showToast('Erro ao gerar ficheiro TypeScript.');
    }
  };

  const resetToOriginal = async () => {
    if (window.confirm('Tem certeza de que deseja restaurar a ordem e os textos originais do portfólio (incluindo a seção Sobre) e sincronizar na nuvem?')) {
      setIsSaving(true);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_SOBRE_KEY);
      setCases(ORIGINAL_CASES);
      setSobre(ORIGINAL_SOBRE_DATA);
      setHasChanges(false);

      const cloudRes = await saveCloudPortfolio(ORIGINAL_CASES, ORIGINAL_SOBRE_DATA);
      setIsSaving(false);
      if (cloudRes.success) {
        showToast('Portfólio restaurado e publicado online com sucesso!');
      } else {
        showToast('Portfólio restaurado no cache local.');
      }
    }
  };

  return (
    <CmsContext.Provider
      value={{
        isEditMode,
        setIsEditMode,
        toggleEditMode,
        iniciarModoEdicao,
        triggerAdminEasterEgg,
        changePassword,
        cases,
        sobre,
        gridLadoA: gridSettings.gridLadoA,
        gridLadoB: gridSettings.gridLadoB,
        gridBonus: gridSettings.gridBonus,
        setGridLadoA,
        setGridLadoB,
        setGridBonus,
        gridColumns: gridSettings.gridLadoA,
        setGridColumns,
        hasChanges,
        isSaving,
        isCloudLoaded,
        updateCaseField,
        updateCaseGridSpan,
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
        updateSobreTypography,
        addSobreSegment,
        removeSobreSegment,
        saveChanges,
        resetToOriginal,
        exportModalOpen,
        setExportModalOpen,
        isAddModalOpen,
        setIsAddModalOpen,
        addNewCase,
        activeNotification,
        showToast,
        exportCasesJson,
        exportCasesTs,
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
