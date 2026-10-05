import React, { createContext, useContext, useState, useEffect } from 'react';
import { CaseItem, CaseBlock, GridSpanType } from '../types';
import { CASES as ORIGINAL_CASES } from '../data/cases';
import { SobreData, ORIGINAL_SOBRE_DATA, SobreTypography } from '../data/sobre';
import {
  ServicosData,
  DEFAULT_SERVICOS_DATA,
  DEFAULT_FOOTER,
  DEFAULT_MANIFESTO,
  sanitizeServicosData,
} from '../data/servicos';
import {
  fetchCloudPortfolio,
  saveCloudPortfolio,
  testFirestoreConnection,
  SectionGridSettings,
} from '../lib/firebase';

// Storage keys for resilient local fallback cache
const STORAGE_KEY = 'thiago_portfolio_custom_cases_v19';
const STORAGE_SOBRE_KEY = 'thiago_portfolio_custom_sobre_v2';
const STORAGE_SERVICOS_KEY = 'thiago_portfolio_custom_servicos_v4';
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
  servicos: ServicosData;
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
  updateCaseField: (slug: string, field: keyof CaseItem, value: any) => Promise<void>;
  updateCaseGridSpan: (slug: string, span: GridSpanType) => Promise<void>;
  updateCaseParagraph: (slug: string, index: number, value: string) => Promise<void>;
  addCaseParagraph: (slug: string) => Promise<void>;
  removeCaseParagraph: (slug: string, index: number) => Promise<void>;
  reorderCases: (draggedSlug: string, targetSlug: string) => Promise<void>;
  moveCaseOrder: (slug: string, direction: 'up' | 'down') => Promise<void>;
  reorderCaseImages: (slug: string, sourceIdx: number, targetIdx: number) => Promise<void>;
  addCaseImage: (slug: string, url: string) => Promise<void>;
  removeCaseImage: (slug: string, index: number) => Promise<void>;
  reorderCaseVideos: (slug: string, sourceIdx: number, targetIdx: number) => Promise<void>;
  addCaseVideo: (slug: string, ytId: string) => Promise<void>;
  removeCaseVideo: (slug: string, index: number) => Promise<void>;
  updateCaseBlocks: (slug: string, blocks: CaseBlock[]) => Promise<void>;
  updateSobreField: <K extends keyof SobreData>(field: K, value: SobreData[K]) => Promise<void>;
  updateSobreBioParagraph: (index: number, value: string) => Promise<void>;
  addSobreBioParagraph: () => Promise<void>;
  removeSobreBioParagraph: (index: number) => Promise<void>;
  updateSobreStat: (statKey: keyof SobreData['stats'], value: string) => Promise<void>;
  updateSobreTypography: (key: keyof SobreTypography, value: any) => Promise<void>;
  addSobreSegment: (segment: string) => Promise<void>;
  removeSobreSegment: (index: number) => Promise<void>;
  updateServicosField: (field: string, value: any) => Promise<void>;
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

const sanitizeSobreData = (data: any): SobreData => {
  const merged: SobreData = { ...ORIGINAL_SOBRE_DATA, ...(data || {}) };
  if (typeof merged.name === 'string') {
    merged.name = merged.name.replace(/\s*undefined\b/gi, '').trim() || 'Thiago Esteves';
  }
  if (typeof merged.role === 'string') {
    merged.role = merged.role.replace(/\s*undefined\b/gi, '').trim() || 'Creative Copywriter & Storyteller';
  }
  if (typeof merged.badge === 'string') {
    merged.badge = merged.badge.replace(/\s*undefined\b/gi, '').trim() || 'Based in Brazil · Available Worldwide';
  }
  return merged;
};

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isCloudLoaded, setIsCloudLoaded] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

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
          return sanitizeSobreData(parsed);
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
    } catch (e) {}
    return { gridLadoA: 2, gridLadoB: 3, gridBonus: 2 };
  });

  const [servicos, setServicos] = useState<ServicosData>(() => {
    try {
      localStorage.removeItem('thiago_portfolio_custom_servicos_v1');
      localStorage.removeItem('thiago_portfolio_custom_servicos_v2');
      localStorage.removeItem('thiago_portfolio_custom_servicos_v3');

      const saved = localStorage.getItem(STORAGE_SERVICOS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const sanitized = sanitizeServicosData(parsed);
          if (!sanitized.footer?.badge || sanitized.footer.badge.trim() === '') {
            sanitized.footer = { ...DEFAULT_FOOTER };
          }
          return sanitized;
        }
      }
    } catch (e) {
      console.error('Erro ao ler dados de Serviços do localStorage:', e);
    }
    try {
      localStorage.setItem(STORAGE_SERVICOS_KEY, JSON.stringify(DEFAULT_SERVICOS_DATA));
    } catch (e) {}
    return { ...DEFAULT_SERVICOS_DATA };
  });

  const showToast = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => {
      setActiveNotification((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  const commitChanges = async (
    newCases: CaseItem[],
    newSobre: SobreData,
    newGrids: SectionGridSettings,
    newServicosOrMsg?: ServicosData | string,
    successMsg?: string
  ) => {
    let currentServicos = servicos;
    let baseText = 'Alterações salvas';

    if (typeof newServicosOrMsg === 'string') {
      baseText = newServicosOrMsg;
    } else if (newServicosOrMsg && typeof newServicosOrMsg === 'object') {
      currentServicos = sanitizeServicosData(newServicosOrMsg);
      setServicos(currentServicos);
      if (successMsg) {
        baseText = successMsg;
      }
    } else if (successMsg) {
      baseText = successMsg;
    }

    setCases(newCases);
    setSobre(newSobre);
    setGridSettings(newGrids);

    // 1. Grava imediatamente no navegador (localStorage)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCases));
      localStorage.setItem(STORAGE_SOBRE_KEY, JSON.stringify(newSobre));
      localStorage.setItem(STORAGE_GRIDS_KEY, JSON.stringify(newGrids));
      localStorage.setItem(STORAGE_LAYOUT_KEY, String(newGrids.gridLadoA));
      localStorage.setItem(STORAGE_SERVICOS_KEY, JSON.stringify(currentServicos));
    } catch (e) {
      console.warn('Erro ao atualizar cache local:', e);
    }

    // 2. Tenta sincronizar com a nuvem com timeout de segurança (6 segundos) e finally garantido
    setIsSaving(true);
    try {
      const cloudPromise = saveCloudPortfolio(newCases, newSobre, newGrids, currentServicos);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Cloud timeout')), 6000)
      );

      const cloudRes: any = await Promise.race([cloudPromise, timeoutPromise]).catch(() => ({ success: false }));

      if (cloudRes.success) {
        setHasChanges(false);
        showToast(`☁️ ${baseText} (Salvo na NUVEM)`);
      } else {
        setHasChanges(true);
        showToast(`💻 ${baseText} (Salvo no Navegador - Nuvem Offline)`);
      }
    } catch (err) {
      setHasChanges(true);
      showToast(`💻 ${baseText} (Salvo no Navegador - Offline)`);
    } finally {
      setIsSaving(false);
    }
  };

  const setGridLadoA = (cols: 1 | 2 | 3) => {
    const updated = { ...gridSettings, gridLadoA: cols };
    commitChanges(cases, sobre, updated, servicos, 'Grid do Lado A atualizado');
  };

  const setGridLadoB = (cols: 1 | 2 | 3) => {
    const updated = { ...gridSettings, gridLadoB: cols };
    commitChanges(cases, sobre, updated, servicos, 'Grid do Lado B atualizado');
  };

  const setGridBonus = (cols: 1 | 2 | 3) => {
    const updated = { ...gridSettings, gridBonus: cols };
    commitChanges(cases, sobre, updated, servicos, 'Grid da Faixa Bônus atualizado');
  };

  const setGridColumns = (cols: 1 | 2 | 3) => {
    setGridLadoA(cols);
  };

  const updateServicosField = async (field: string, value: any) => {
    const updated = sanitizeServicosData({
      ...servicos,
      [field]: value,
    });
    await commitChanges(cases, sobre, gridSettings, updated, 'Serviços atualizados');
  };

  useEffect(() => {
    testFirestoreConnection();

    fetchCloudPortfolio()
      .then((cloudData) => {
        if (cloudData.cases && Array.isArray(cloudData.cases) && cloudData.cases.length > 0) {
          setCases(cloudData.cases);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData.cases));
          } catch (e) {}
        }
        if (cloudData.sobre && typeof cloudData.sobre === 'object') {
          const sanitized = sanitizeSobreData(cloudData.sobre);
          setSobre(sanitized);
          try {
            localStorage.setItem(STORAGE_SOBRE_KEY, JSON.stringify(sanitized));
          } catch (e) {}
        }
        if (cloudData.servicos && typeof cloudData.servicos === 'object') {
          const sanitizedServicos = sanitizeServicosData(cloudData.servicos);
          if (!sanitizedServicos.footer?.badge || sanitizedServicos.footer.badge.trim() === '') {
            sanitizedServicos.footer.badge = DEFAULT_FOOTER.badge;
          }
          if (!sanitizedServicos.footer?.line1 || sanitizedServicos.footer.line1.trim() === '') {
            sanitizedServicos.footer.line1 = DEFAULT_FOOTER.line1;
          }
          if (!sanitizedServicos.footer?.line2 || sanitizedServicos.footer.line2.trim() === '') {
            sanitizedServicos.footer.line2 = DEFAULT_FOOTER.line2;
          }
          setServicos(sanitizedServicos);
          try {
            localStorage.setItem(STORAGE_SERVICOS_KEY, JSON.stringify(sanitizedServicos));
          } catch (e) {}
        } else {
          setServicos({ ...DEFAULT_SERVICOS_DATA });
          try {
            localStorage.setItem(STORAGE_SERVICOS_KEY, JSON.stringify(DEFAULT_SERVICOS_DATA));
          } catch (e) {}
        }

        if (cloudData.gridSettings) {
          setGridSettings(cloudData.gridSettings);
          try {
            localStorage.setItem(STORAGE_GRIDS_KEY, JSON.stringify(cloudData.gridSettings));
            localStorage.setItem(STORAGE_LAYOUT_KEY, String(cloudData.gridSettings.gridLadoA));
          } catch (e) {}
        }
        setIsCloudLoaded(true);
      })
      .catch((err) => {
        console.warn('Usando dados guardados localmente:', err);
        setIsCloudLoaded(true);
      });
  }, []);

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
    if (tentativa === null) return;
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
    showToast('Senha alterada com sucesso!');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      if (isCmdOrCtrl && e.shiftKey && (e.key === 'E' || e.key === 'e' || e.code === 'KeyE')) {
        e.preventDefault();
        e.stopPropagation();
        triggerAdminEasterEgg();
      }
    };

    const checkUrlHash = () => {
      const hash = window.location.hash;
      if (hash === '#edit' || hash === '#/edit') {
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } else {
          window.location.hash = '';
        }
        triggerAdminEasterEgg();
      }
    };

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

  const updateCaseField = async (slug: string, field: keyof CaseItem, value: any) => {
    const updatedCasesList = cases.map((c) => (c.slug === slug ? { ...c, [field]: value } : c));
    await commitChanges(updatedCasesList, sobre, gridSettings, 'Campo atualizado');
  };

  const updateCaseGridSpan = async (slug: string, span: GridSpanType) => {
    const updatedCasesList = cases.map((c) => (c.slug === slug ? { ...c, gridSpan: span } : c));
    const spanLabel = span === 'full' ? 'Destaque (100%)' : span === 'half' ? 'Médio (50%)' : 'Compacto (33%)';
    await commitChanges(updatedCasesList, sobre, gridSettings, `Layout alterado para ${spanLabel}`);
  };

  const updateCaseParagraph = async (slug: string, index: number, value: string) => {
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      const newText = [...c.text];
      newText[index] = value;
      return { ...c, text: newText };
    });
    await commitChanges(updatedCasesList, sobre, gridSettings, 'Parágrafo atualizado');
  };

  const addCaseParagraph = async (slug: string) => {
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      return { ...c, text: [...c.text, 'Novo parágrafo de texto...'] };
    });
    await commitChanges(updatedCasesList, sobre, gridSettings, 'Novo parágrafo adicionado');
  };

  const removeCaseParagraph = async (slug: string, index: number) => {
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      const newText = c.text.filter((_, i) => i !== index);
      return { ...c, text: newText };
    });
    await commitChanges(updatedCasesList, sobre, gridSettings, 'Parágrafo removido');
  };

  const reorderCases = async (draggedSlug: string, targetSlug: string) => {
    if (draggedSlug === targetSlug) return;
    const fromIndex = cases.findIndex((c) => c.slug === draggedSlug);
    const toIndex = cases.findIndex((c) => c.slug === targetSlug);
    if (fromIndex === -1 || toIndex === -1) return;

    const newCases = [...cases];
    const [moved] = newCases.splice(fromIndex, 1);
    const targetItem = cases[toIndex];
    moved.lado = targetItem.lado;
    newCases.splice(toIndex, 0, moved);

    await commitChanges(newCases, sobre, gridSettings, 'Ordem dos projetos atualizada');
  };

  const moveCaseOrder = async (slug: string, direction: 'up' | 'down') => {
    const currentItem = cases.find((c) => c.slug === slug);
    if (!currentItem) return;

    const lado = currentItem.lado;
    const sectionCases = cases.filter((c) => c.lado === lado);
    const sectionIndex = sectionCases.findIndex((c) => c.slug === slug);
    if (sectionIndex === -1) return;

    const targetSectionIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    if (targetSectionIndex < 0 || targetSectionIndex >= sectionCases.length) return;

    const targetItem = sectionCases[targetSectionIndex];
    const fromGlobalIndex = cases.findIndex((c) => c.slug === slug);
    const toGlobalIndex = cases.findIndex((c) => c.slug === targetItem.slug);
    if (fromGlobalIndex === -1 || toGlobalIndex === -1) return;

    const newCases = [...cases];
    const [moved] = newCases.splice(fromGlobalIndex, 1);
    newCases.splice(toGlobalIndex, 0, moved);

    await commitChanges(newCases, sobre, gridSettings, 'Projeto movido');
  };

  const reorderCaseImages = async (slug: string, sourceIdx: number, targetIdx: number) => {
    if (sourceIdx === targetIdx) return;
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      const newImgs = [...c.imgs];
      const [moved] = newImgs.splice(sourceIdx, 1);
      newImgs.splice(targetIdx, 0, moved);
      return { ...c, imgs: newImgs };
    });
    await commitChanges(updatedCasesList, sobre, gridSettings, 'Ordem das peças/imagens atualizada');
  };

  const addCaseImage = async (slug: string, url: string) => {
    if (!url.trim()) return;
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      return { ...c, imgs: [...c.imgs, url.trim()] };
    });
    await commitChanges(updatedCasesList, sobre, gridSettings, 'Nova peça/imagem adicionada');
  };

  const removeCaseImage = async (slug: string, index: number) => {
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      const newImgs = c.imgs.filter((_, i) => i !== index);
      return { ...c, imgs: newImgs };
    });
    await commitChanges(updatedCasesList, sobre, gridSettings, 'Peça removida');
  };

  const reorderCaseVideos = async (slug: string, sourceIdx: number, targetIdx: number) => {
    if (sourceIdx === targetIdx) return;
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      const newYt = [...c.yt];
      const [moved] = newYt.splice(sourceIdx, 1);
      newYt.splice(targetIdx, 0, moved);
      return { ...c, yt: newYt };
    });
    await commitChanges(updatedCasesList, sobre, gridSettings, 'Ordem dos vídeos atualizada');
  };

  const addCaseVideo = async (slug: string, input: string) => {
    if (!input.trim()) return;
    let videoId = input.trim();
    if (videoId.includes('v=')) {
      videoId = videoId.split('v=')[1]?.split('&')[0] || videoId;
    } else if (videoId.includes('youtu.be/')) {
      videoId = videoId.split('youtu.be/')[1]?.split('?')[0] || videoId;
    }
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      return { ...c, yt: [...c.yt, videoId] };
    });
    await commitChanges(updatedCasesList, sobre, gridSettings, 'Vídeo adicionado');
  };

  const removeCaseVideo = async (slug: string, index: number) => {
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      const newYt = c.yt.filter((_, i) => i !== index);
      return { ...c, yt: newYt };
    });
    await commitChanges(updatedCasesList, sobre, gridSettings, 'Vídeo removido');
  };

  const updateCaseBlocks = async (slug: string, blocks: CaseBlock[]) => {
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      const text = blocks
        .filter((b) => b.type === 'text')
        .flatMap((b) => (b.value || '').split(/\n\s*\n/).filter((p: string) => p.trim()));
      const yt = blocks.filter((b) => b.type === 'video').map((b) => b.value);
      const imgs = blocks.filter((b) => b.type === 'image').map((b) => b.value);
      return {
        ...c,
        blocks,
        text,
        yt,
        imgs,
      };
    });
    await commitChanges(updatedCasesList, sobre, gridSettings, 'Blocos atualizados');
  };

  const updateSobreField = async <K extends keyof SobreData>(field: K, value: SobreData[K]) => {
    const updatedSobre = { ...sobre, [field]: value };
    await commitChanges(cases, updatedSobre, gridSettings, 'Seção Sobre atualizada');
  };

  const updateSobreBioParagraph = async (index: number, value: string) => {
    const newBio = [...sobre.bio];
    newBio[index] = value;
    const updatedSobre = { ...sobre, bio: newBio };
    await commitChanges(cases, updatedSobre, gridSettings, 'Biografia atualizada');
  };

  const addSobreBioParagraph = async () => {
    const updatedSobre = {
      ...sobre,
      bio: [...sobre.bio, 'Novo parágrafo da biografia. Clique para editar.'],
    };
    await commitChanges(cases, updatedSobre, gridSettings, 'Novo parágrafo da bio adicionado');
  };

  const removeSobreBioParagraph = async (index: number) => {
    const updatedSobre = {
      ...sobre,
      bio: sobre.bio.filter((_, i) => i !== index),
    };
    await commitChanges(cases, updatedSobre, gridSettings, 'Parágrafo da bio removido');
  };

  const updateSobreStat = async (statKey: keyof SobreData['stats'], value: string) => {
    const updatedSobre = {
      ...sobre,
      stats: {
        ...sobre.stats,
        [statKey]: value,
      },
    };
    await commitChanges(cases, updatedSobre, gridSettings, 'Estatística atualizada');
  };

  const updateSobreTypography = async (key: keyof SobreTypography, value: any) => {
    const updatedSobre = {
      ...sobre,
      typography: {
        ...sobre.typography,
        [key]: value,
      },
    };
    await commitChanges(cases, updatedSobre, gridSettings, 'Tipografia atualizada');
  };

  const addSobreSegment = async (segment: string) => {
    if (!segment.trim()) return;
    const updatedSobre = {
      ...sobre,
      segments: [...sobre.segments, segment.trim()],
    };
    await commitChanges(cases, updatedSobre, gridSettings, 'Segmento adicionado');
  };

  const removeSobreSegment = async (index: number) => {
    const updatedSobre = {
      ...sobre,
      segments: sobre.segments.filter((_, i) => i !== index),
    };
    await commitChanges(cases, updatedSobre, gridSettings, 'Segmento removido');
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
    await commitChanges(newCasesList, sobre, gridSettings, `Projeto "${newCaseItem.name}" adicionado`);

    return newCaseItem;
  };

  const saveChanges = async () => {
    await commitChanges(cases, sobre, gridSettings, servicos, 'Alterações sincronizadas');
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
    if (window.confirm('Tem certeza de que deseja restaurar a ordem e os textos originais do portfólio?')) {
      setIsSaving(true);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_SOBRE_KEY);
      localStorage.removeItem(STORAGE_SERVICOS_KEY);
      localStorage.removeItem(STORAGE_GRIDS_KEY);
      setCases(ORIGINAL_CASES);
      setSobre(ORIGINAL_SOBRE_DATA);
      setServicos(DEFAULT_SERVICOS_DATA);
      setHasChanges(false);

      try {
        const cloudPromise = saveCloudPortfolio(ORIGINAL_CASES, ORIGINAL_SOBRE_DATA, gridSettings, DEFAULT_SERVICOS_DATA);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 6000)
        );
        const cloudRes: any = await Promise.race([cloudPromise, timeoutPromise]).catch(() => ({ success: false }));

        if (cloudRes.success) {
          showToast('☁️ Portfólio restaurado com sucesso na NUVEM!');
        } else {
          showToast('💻 Portfólio restaurado no Navegador (Nuvem Offline).');
        }
      } catch (e) {
        showToast('💻 Portfólio restaurado no Navegador (Offline).');
      } finally {
        setIsSaving(false);
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
        servicos,
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
        updateServicosField,
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

export default CmsContext;