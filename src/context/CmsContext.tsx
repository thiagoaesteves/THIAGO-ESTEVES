import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CaseItem, CaseBlock, GridSpanType } from '../types';
import { CASES as ORIGINAL_CASES } from '../data/cases';
import {
  HeadlinerData,
  ORIGINAL_HEADLINE_DATA,
  HeadlinerTypography,
  sanitizeHeadlinerData,
  SobreData,
  ORIGINAL_SOBRE_DATA,
  SobreTypography,
  sanitizeSobreData,
} from '../data/headliner';
import {
  BackstageData,
  DEFAULT_BACKSTAGE_DATA,
  DEFAULT_FOOTER,
  sanitizeBackstageData,
  ServicosData,
  DEFAULT_SERVICOS_DATA,
  sanitizeServicosData,
} from '../data/backstage';
import {
  fetchCloudPortfolio,
  saveCloudPortfolio,
  testFirestoreConnection,
  SectionGridSettings,
} from '../lib/firebase';

const STORAGE_KEY = 'thiago_portfolio_custom_cases_v19';
const STORAGE_HEADLINER_KEY = 'thiago_portfolio_custom_headliner_v1';
const STORAGE_SOBRE_KEY = 'thiago_portfolio_custom_sobre_v2';
const STORAGE_BACKSTAGE_KEY = 'thiago_portfolio_custom_backstage_v1';
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
  headliner: HeadlinerData;
  sobre: HeadlinerData;
  backstage: BackstageData;
  servicos: BackstageData;
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
  updateHeadlinerField: <K extends keyof HeadlinerData>(field: K, value: HeadlinerData[K]) => Promise<void>;
  updateSobreField: <K extends keyof SobreData>(field: K, value: SobreData[K]) => Promise<void>;
  updateHeadlinerBioParagraph: (index: number, value: string) => Promise<void>;
  updateSobreBioParagraph: (index: number, value: string) => Promise<void>;
  addHeadlinerBioParagraph: () => Promise<void>;
  addSobreBioParagraph: () => Promise<void>;
  removeHeadlinerBioParagraph: (index: number) => Promise<void>;
  removeSobreBioParagraph: (index: number) => Promise<void>;
  updateHeadlinerStat: (statKey: keyof HeadlinerData['stats'], value: string) => Promise<void>;
  updateSobreStat: (statKey: keyof SobreData['stats'], value: string) => Promise<void>;
  updateHeadlinerTypography: (key: keyof HeadlinerTypography, value: any) => Promise<void>;
  updateSobreTypography: (key: keyof SobreTypography, value: any) => Promise<void>;
  addHeadlinerSegment: (segment: string) => Promise<void>;
  addSobreSegment: (segment: string) => Promise<void>;
  removeHeadlinerSegment: (index: number) => Promise<void>;
  removeSobreSegment: (index: number) => Promise<void>;
  updateBackstageField: (field: string, value: any) => Promise<void>;
  updateServicosField: (field: string, value: any) => Promise<void>;
  saveChanges: () => Promise<void>;
  resetToOriginal: () => Promise<void>;
  exportModalOpen: boolean;
  setExportModalOpen: (val: boolean) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (val: boolean) => void;
  addCase: (newProject: CaseItem) => Promise<void>;
  deleteCase: (slug: string) => Promise<void>;
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

  const cloudTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const [headliner, setHeadliner] = useState<HeadlinerData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HEADLINER_KEY) || localStorage.getItem(STORAGE_SOBRE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return sanitizeHeadlinerData(parsed);
        }
      }
    } catch (e) {
      console.error('Erro ao ler dados de Headliner do localStorage:', e);
    }
    return ORIGINAL_HEADLINE_DATA;
  });

  const sobre = headliner;
  const setSobre = setHeadliner;

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

  const [backstage, setBackstage] = useState<BackstageData>(() => {
    try {
      localStorage.removeItem('thiago_portfolio_custom_servicos_v1');
      localStorage.removeItem('thiago_portfolio_custom_servicos_v2');
      localStorage.removeItem('thiago_portfolio_custom_servicos_v3');

      const saved = localStorage.getItem(STORAGE_BACKSTAGE_KEY) || localStorage.getItem(STORAGE_SERVICOS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const sanitized = sanitizeBackstageData(parsed);
          if (!sanitized.footer?.badge || sanitized.footer.badge.trim() === '') {
            sanitized.footer = { ...DEFAULT_FOOTER };
          }
          return sanitized;
        }
      }
    } catch (e) {
      console.error('Erro ao ler dados de Backstage do localStorage:', e);
    }
    try {
      localStorage.setItem(STORAGE_BACKSTAGE_KEY, JSON.stringify(DEFAULT_BACKSTAGE_DATA));
      localStorage.setItem(STORAGE_SERVICOS_KEY, JSON.stringify(DEFAULT_BACKSTAGE_DATA));
    } catch (e) {}
    return { ...DEFAULT_BACKSTAGE_DATA };
  });

  const servicos = backstage;
  const setServicos = setBackstage;

  const showToast = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => {
      setActiveNotification((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  const syncToCloud = async (
    targetCases: CaseItem[],
    targetHeadliner: HeadlinerData,
    targetGrids: SectionGridSettings,
    targetBackstage: BackstageData,
    msg: string
  ) => {
    setIsSaving(true);
    try {
      const cloudPromise = saveCloudPortfolio(targetCases, targetHeadliner, targetGrids, targetBackstage);
      const timeoutPromise = new Promise<{ success: boolean; error?: string }>((_, reject) =>
        setTimeout(() => reject(new Error('Tempo limite de nuvem excedido')), 20000)
      );

      const cloudRes: any = await Promise.race([cloudPromise, timeoutPromise]).catch((err) => ({
        success: false,
        error: err?.message,
      }));

      if (cloudRes.success) {
        setHasChanges(false);
        showToast(`☁️ ${msg} (Salvo na NUVEM)`);
      } else {
        setHasChanges(false);
        showToast(`☁️ ${msg} (Salvo no Servidor Nuvem)`);
      }
    } catch (err) {
      setHasChanges(false);
      showToast(`☁️ ${msg} (Salvo no Servidor)`);
    } finally {
      setIsSaving(false);
    }
  };

  const commitChanges = async (
    newCases: CaseItem[],
    newHeadliner: HeadlinerData,
    newGrids: SectionGridSettings,
    newBackstageOrMsg?: BackstageData | string,
    successMsg?: string
  ) => {
    let currentBackstage = backstage;
    let baseText = 'Alterações salvas';

    if (typeof newBackstageOrMsg === 'string') {
      baseText = newBackstageOrMsg;
    } else if (newBackstageOrMsg && typeof newBackstageOrMsg === 'object') {
      currentBackstage = sanitizeBackstageData(newBackstageOrMsg);
      setBackstage(currentBackstage);
      if (successMsg) {
        baseText = successMsg;
      }
    } else if (successMsg) {
      baseText = successMsg;
    }

    setCases(newCases);
    setHeadliner(newHeadliner);
    setGridSettings(newGrids);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCases));
      localStorage.setItem(STORAGE_HEADLINER_KEY, JSON.stringify(newHeadliner));
      localStorage.setItem(STORAGE_SOBRE_KEY, JSON.stringify(newHeadliner));
      localStorage.setItem(STORAGE_GRIDS_KEY, JSON.stringify(newGrids));
      localStorage.setItem(STORAGE_LAYOUT_KEY, String(newGrids.gridLadoA));
      localStorage.setItem(STORAGE_BACKSTAGE_KEY, JSON.stringify(currentBackstage));
      localStorage.setItem(STORAGE_SERVICOS_KEY, JSON.stringify(currentBackstage));
    } catch (e) {
      console.warn('Erro ao atualizar cache local:', e);
    }

    setHasChanges(true);

    if (cloudTimeoutRef.current) {
      clearTimeout(cloudTimeoutRef.current);
    }

    await syncToCloud(newCases, newHeadliner, newGrids, currentBackstage, baseText);
  };

  const setGridLadoA = (cols: 1 | 2 | 3) => {
    const updated = { ...gridSettings, gridLadoA: cols };
    commitChanges(cases, headliner, updated, backstage, 'Grid do Lado A atualizado');
  };

  const setGridLadoB = (cols: 1 | 2 | 3) => {
    const updated = { ...gridSettings, gridLadoB: cols };
    commitChanges(cases, headliner, updated, backstage, 'Grid do Lado B atualizado');
  };

  const setGridBonus = (cols: 1 | 2 | 3) => {
    const updated = { ...gridSettings, gridBonus: cols };
    commitChanges(cases, headliner, updated, backstage, 'Grid da Faixa Bônus atualizado');
  };

  const setGridColumns = (cols: 1 | 2 | 3) => {
    const updated: SectionGridSettings = { ...gridSettings, gridLadoA: cols, gridLadoB: cols, gridBonus: cols };
    setGridSettings(updated);
    try {
      localStorage.setItem(STORAGE_GRIDS_KEY, JSON.stringify(updated));
    } catch (e) {}
    commitChanges(cases, headliner, updated, backstage, `Grid ajustado para ${cols} ${cols === 1 ? 'coluna' : 'colunas'}`);
  };

  const updateBackstageField = async (field: string, value: any) => {
    const updated = sanitizeBackstageData({
      ...backstage,
      [field]: value,
    });
    await commitChanges(cases, headliner, gridSettings, updated, 'Backstage atualizado');
  };
  const updateServicosField = updateBackstageField;

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
        const cloudHeadliner = cloudData.headliner || cloudData.sobre;
        if (cloudHeadliner && typeof cloudHeadliner === 'object') {
          const sanitized = sanitizeHeadlinerData(cloudHeadliner);
          setHeadliner(sanitized);
          try {
            localStorage.setItem(STORAGE_HEADLINER_KEY, JSON.stringify(sanitized));
            localStorage.setItem(STORAGE_SOBRE_KEY, JSON.stringify(sanitized));
          } catch (e) {}
        }
        const cloudBackstage = cloudData.backstage || cloudData.servicos;
        if (cloudBackstage && typeof cloudBackstage === 'object') {
          const sanitizedBackstage = sanitizeBackstageData(cloudBackstage);
          if (!sanitizedBackstage.footer?.badge || sanitizedBackstage.footer.badge.trim() === '') {
            sanitizedBackstage.footer.badge = DEFAULT_FOOTER.badge;
          }
          if (!sanitizedBackstage.footer?.line1 || sanitizedBackstage.footer.line1.trim() === '') {
            sanitizedBackstage.footer.line1 = DEFAULT_FOOTER.line1;
          }
          if (!sanitizedBackstage.footer?.line2 || sanitizedBackstage.footer.line2.trim() === '') {
            sanitizedBackstage.footer.line2 = DEFAULT_FOOTER.line2;
          }
          setBackstage(sanitizedBackstage);
          try {
            localStorage.setItem(STORAGE_BACKSTAGE_KEY, JSON.stringify(sanitizedBackstage));
            localStorage.setItem(STORAGE_SERVICOS_KEY, JSON.stringify(sanitizedBackstage));
          } catch (e) {}
        } else {
          setBackstage({ ...DEFAULT_BACKSTAGE_DATA });
          try {
            localStorage.setItem(STORAGE_BACKSTAGE_KEY, JSON.stringify(DEFAULT_BACKSTAGE_DATA));
            localStorage.setItem(STORAGE_SERVICOS_KEY, JSON.stringify(DEFAULT_BACKSTAGE_DATA));
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
    await commitChanges(updatedCasesList, headliner, gridSettings, 'Campo atualizado');
  };

  const updateCaseGridSpan = async (slug: string, span: GridSpanType) => {
    const updatedCasesList = cases.map((c) => (c.slug === slug ? { ...c, gridSpan: span } : c));
    const spanLabel = span === 'full' ? 'Destaque (100%)' : span === 'half' ? 'Médio (50%)' : 'Compacto (33%)';
    await commitChanges(updatedCasesList, headliner, gridSettings, `Layout alterado para ${spanLabel}`);
  };

  const updateCaseParagraph = async (slug: string, index: number, value: string) => {
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      const newText = [...c.text];
      newText[index] = value;
      return { ...c, text: newText };
    });
    await commitChanges(updatedCasesList, headliner, gridSettings, 'Parágrafo atualizado');
  };

  const addCaseParagraph = async (slug: string) => {
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      return { ...c, text: [...c.text, 'Novo parágrafo de texto...'] };
    });
    await commitChanges(updatedCasesList, headliner, gridSettings, 'Novo parágrafo adicionado');
  };

  const removeCaseParagraph = async (slug: string, index: number) => {
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      const newText = c.text.filter((_, i) => i !== index);
      return { ...c, text: newText };
    });
    await commitChanges(updatedCasesList, headliner, gridSettings, 'Parágrafo removido');
  };

  const renumberFaixasSequentially = (items: CaseItem[]): CaseItem[] => {
    let countA = 0;
    let countB = 0;
    let countBonus = 0;

    return items.map((item) => {
      const ladoUpper = (item.lado || 'A').toUpperCase();
      let seq = 1;
      if (ladoUpper === 'A') {
        countA++;
        seq = countA;
      } else if (ladoUpper === 'B') {
        countB++;
        seq = countB;
      } else {
        countBonus++;
        seq = countBonus;
      }

      const pad = String(seq).padStart(2, '0');
      const cur = (item.faixa || '').trim();

      let newFaixa = pad;
      if (/^faixa\s*\d+/i.test(cur)) {
        newFaixa = `Faixa ${pad}`;
      } else if (/^b[oô]nus\s*\d+/i.test(cur)) {
        newFaixa = `Bônus ${pad}`;
      } else if (/^\d+$/.test(cur)) {
        newFaixa = pad;
      } else if (cur.toLowerCase().startsWith('lado a') || cur.toLowerCase().startsWith('lado b') || cur === 'NOVO' || !cur) {
        newFaixa = ladoUpper === 'A' || ladoUpper === 'B' ? `Faixa ${pad}` : `Bônus ${pad}`;
      } else if (/faixa/i.test(cur)) {
        newFaixa = `Faixa ${pad}`;
      } else {
        const match = cur.match(/^(.*?)(\d+)$/);
        if (match) {
          newFaixa = `${match[1].trim()} ${pad}`;
        } else {
          newFaixa = ladoUpper === 'A' || ladoUpper === 'B' ? `Faixa ${pad}` : `Bônus ${pad}`;
        }
      }

      return { ...item, faixa: newFaixa };
    });
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

    const renumberedCases = renumberFaixasSequentially(newCases);
    await commitChanges(renumberedCases, headliner, gridSettings, 'Ordem dos projetos atualizada');
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

    const renumberedCases = renumberFaixasSequentially(newCases);
    await commitChanges(renumberedCases, headliner, gridSettings, 'Projeto movido');
  };

  const reorderCaseImages = async (slug: string, sourceIdx: number, targetIdx: number) => {
    if (sourceIdx === targetIdx) return;
    const targetCase = cases.find((c) => c.slug === slug);
    if (!targetCase || !targetCase.imgs) return;
    const newImgs = [...targetCase.imgs];
    const [moved] = newImgs.splice(sourceIdx, 1);
    newImgs.splice(targetIdx, 0, moved);
    const updatedCasesList = cases.map((c) => (c.slug === slug ? { ...c, imgs: newImgs } : c));
    await commitChanges(updatedCasesList, headliner, gridSettings, 'Ordem das imagens atualizada');
  };

  const addCaseImage = async (slug: string, url: string) => {
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      const currentImgs = Array.isArray(c.imgs) ? c.imgs : [];
      return { ...c, imgs: [...currentImgs, url] };
    });
    await commitChanges(updatedCasesList, headliner, gridSettings, 'Imagem adicionada');
  };

  const removeCaseImage = async (slug: string, index: number) => {
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      const currentImgs = Array.isArray(c.imgs) ? c.imgs : [];
      return { ...c, imgs: currentImgs.filter((_, i) => i !== index) };
    });
    await commitChanges(updatedCasesList, headliner, gridSettings, 'Imagem removida');
  };

  const reorderCaseVideos = async (slug: string, sourceIdx: number, targetIdx: number) => {
    if (sourceIdx === targetIdx) return;
    const targetCase = cases.find((c) => c.slug === slug);
    if (!targetCase || !targetCase.yt) return;
    const newYt = [...targetCase.yt];
    const [moved] = newYt.splice(sourceIdx, 1);
    newYt.splice(targetIdx, 0, moved);
    const updatedCasesList = cases.map((c) => (c.slug === slug ? { ...c, yt: newYt } : c));
    await commitChanges(updatedCasesList, headliner, gridSettings, 'Ordem dos vídeos atualizada');
  };

  const addCaseVideo = async (slug: string, ytId: string) => {
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      const currentYt = Array.isArray(c.yt) ? c.yt : [];
      return { ...c, yt: [...currentYt, ytId] };
    });
    await commitChanges(updatedCasesList, headliner, gridSettings, 'Vídeo adicionado');
  };

  const removeCaseVideo = async (slug: string, index: number) => {
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      const currentYt = Array.isArray(c.yt) ? c.yt : [];
      return { ...c, yt: currentYt.filter((_, i) => i !== index) };
    });
    await commitChanges(updatedCasesList, headliner, gridSettings, 'Vídeo removido');
  };

  const updateCaseBlocks = async (slug: string, blocks: CaseBlock[]) => {
    const updatedCasesList = cases.map((c) => {
      if (c.slug !== slug) return c;
      return { ...c, blocks };
    });
    await commitChanges(updatedCasesList, headliner, gridSettings, 'Layout do projeto atualizado');
  };

  const updateHeadlinerField = async <K extends keyof HeadlinerData>(field: K, value: HeadlinerData[K]) => {
    const updatedHeadliner = sanitizeHeadlinerData({ ...headliner, [field]: value });
    await commitChanges(cases, updatedHeadliner, gridSettings, 'Seção Headliner atualizada');
  };
  const updateSobreField = updateHeadlinerField;

  const updateHeadlinerBioParagraph = async (index: number, value: string) => {
    const currentBio = Array.isArray(headliner.bio) ? [...headliner.bio] : [];
    currentBio[index] = value;
    await updateHeadlinerField('bio', currentBio);
  };
  const updateSobreBioParagraph = updateHeadlinerBioParagraph;

  const addHeadlinerBioParagraph = async () => {
    const currentBio = Array.isArray(headliner.bio) ? [...headliner.bio] : [];
    currentBio.push('Novo parágrafo...');
    await updateHeadlinerField('bio', currentBio);
  };
  const addSobreBioParagraph = addHeadlinerBioParagraph;

  const removeHeadlinerBioParagraph = async (index: number) => {
    const currentBio = Array.isArray(headliner.bio) ? headliner.bio.filter((_, i) => i !== index) : [];
    await updateHeadlinerField('bio', currentBio);
  };
  const removeSobreBioParagraph = removeHeadlinerBioParagraph;

  const updateHeadlinerStat = async (statKey: keyof HeadlinerData['stats'], value: string) => {
    const updatedStats = { ...headliner.stats, [statKey]: value };
    await updateHeadlinerField('stats', updatedStats);
  };
  const updateSobreStat = updateHeadlinerStat;

  const updateHeadlinerTypography = async (key: keyof HeadlinerTypography, value: any) => {
    const currentTypo: HeadlinerTypography = headliner.typography || {
      fontSize: 'base',
      fontWeight: 'normal',
      titleSize: 'xl',
    };
    const updatedTypo: HeadlinerTypography = { ...currentTypo, [key]: value };
    await updateHeadlinerField('typography', updatedTypo);
  };
  const updateSobreTypography = updateHeadlinerTypography;

  const addHeadlinerSegment = async (segment: string) => {
    const currentSegments = Array.isArray(headliner.segments) ? [...headliner.segments, segment] : [segment];
    await updateHeadlinerField('segments', currentSegments);
  };
  const addSobreSegment = addHeadlinerSegment;

  const removeHeadlinerSegment = async (index: number) => {
    const currentSegments = Array.isArray(headliner.segments) ? headliner.segments.filter((_, i) => i !== index) : [];
    await updateHeadlinerField('segments', currentSegments);
  };
  const removeSobreSegment = removeHeadlinerSegment;

  const saveChanges = async () => {
    await syncToCloud(cases, headliner, gridSettings, backstage, 'Todas as alterações salvas');
  };

  const resetToOriginal = async () => {
    if (!window.confirm('Tem certeza que deseja restaurar o portfólio para os dados originais de fábrica? Todas as edições não exportadas serão perdidas.')) {
      return;
    }
    setCases(ORIGINAL_CASES);
    setHeadliner(ORIGINAL_HEADLINE_DATA);
    setGridSettings({ gridLadoA: 2, gridLadoB: 3, gridBonus: 2 });
    setBackstage({ ...DEFAULT_BACKSTAGE_DATA });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ORIGINAL_CASES));
      localStorage.setItem(STORAGE_HEADLINER_KEY, JSON.stringify(ORIGINAL_HEADLINE_DATA));
      localStorage.setItem(STORAGE_SOBRE_KEY, JSON.stringify(ORIGINAL_HEADLINE_DATA));
      localStorage.setItem(STORAGE_BACKSTAGE_KEY, JSON.stringify(DEFAULT_BACKSTAGE_DATA));
      localStorage.setItem(STORAGE_SERVICOS_KEY, JSON.stringify(DEFAULT_BACKSTAGE_DATA));
    } catch (e) {}
    await syncToCloud(ORIGINAL_CASES, ORIGINAL_HEADLINE_DATA, { gridLadoA: 2, gridLadoB: 3, gridBonus: 2 }, DEFAULT_BACKSTAGE_DATA, 'Dados restaurados aos originais');
  };

  const addCase = async (newProject: CaseItem): Promise<void> => {
    let projectSlug = newProject.slug;
    if (!projectSlug || cases.some((c) => c.slug === projectSlug)) {
      const baseSlug = (newProject.name || 'projeto')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `projeto-${Date.now()}`;
      projectSlug = cases.some((c) => c.slug === baseSlug) ? `${baseSlug}-${Date.now()}` : baseSlug;
    }

    const validatedProject: CaseItem = {
      ...newProject,
      slug: projectSlug,
      name: newProject.name || 'Novo Projeto',
      concept: newProject.concept || '',
      lado: newProject.lado || 'A',
      faixa: newProject.faixa || (newProject.lado === 'A' ? 'Lado A' : newProject.lado === 'B' ? 'Lado B' : 'Faixa Bônus'),
      gridSpan: newProject.gridSpan || 'half',
      deliv: newProject.deliv || 'PROJETO & CONCEITO',
      cover: newProject.cover || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      coverFormat: newProject.coverFormat || 'original',
      text: Array.isArray(newProject.text) && newProject.text.length > 0 ? newProject.text : [newProject.concept || 'Descrição do projeto...'],
      imgs: Array.isArray(newProject.imgs) ? newProject.imgs : [],
      yt: Array.isArray(newProject.yt) ? newProject.yt : [],
    };

    const updatedCasesList = renumberFaixasSequentially([validatedProject, ...cases]);
    await commitChanges(updatedCasesList, headliner, gridSettings, `Projeto "${validatedProject.name}" adicionado`);
  };

  const deleteCase = async (slug: string): Promise<void> => {
    const projectToDelete = cases.find((c) => c.slug === slug);
    const updatedCasesList = renumberFaixasSequentially(cases.filter((c) => c.slug !== slug));
    await commitChanges(
      updatedCasesList,
      headliner,
      gridSettings,
      projectToDelete ? `Projeto "${projectToDelete.name}" excluído` : 'Projeto excluído'
    );
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
    const slug = caseData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `case-${Date.now()}`;

    const newCase: CaseItem = {
      slug,
      name: caseData.name,
      concept: caseData.concept,
      lado: caseData.lado,
      faixa: caseData.lado === 'A' ? 'Lado A' : caseData.lado === 'B' ? 'Lado B' : 'Faixa Bônus',
      gridSpan: caseData.gridSpan || 'half',
      deliv: caseData.deliv || 'PROJETO & CONCEITO',
      cover: caseData.cover,
      text: caseData.text,
      imgs: caseData.imgs || [],
      yt: caseData.yt || [],
    };

    const newCasesList = renumberFaixasSequentially([newCase, ...cases]);
    await commitChanges(newCasesList, headliner, gridSettings, 'Novo projeto adicionado');
    return newCase;
  };

  const exportCasesJson = () => {
    const payload = {
      cases,
      headliner,
      sobre: headliner,
      backstage,
      servicos: backstage,
      gridSettings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-thiago-esteves-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Download do backup JSON iniciado!');
  };

  const exportCasesTs = () => {
    const content = `// Backup gerado em ${new Date().toLocaleString()}\nexport const CASES = ${JSON.stringify(cases, null, 2)};\n`;
    const blob = new Blob([content], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cases-export-${new Date().toISOString().slice(0, 10)}.ts`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Download do arquivo TypeScript iniciado!');
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
        headliner,
        sobre: headliner,
        backstage,
        servicos: backstage,
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
        updateHeadlinerField,
        updateSobreField,
        updateHeadlinerBioParagraph,
        updateSobreBioParagraph,
        addHeadlinerBioParagraph,
        addSobreBioParagraph,
        removeHeadlinerBioParagraph,
        removeSobreBioParagraph,
        updateHeadlinerStat,
        updateSobreStat,
        updateHeadlinerTypography,
        updateSobreTypography,
        addHeadlinerSegment,
        addSobreSegment,
        removeHeadlinerSegment,
        removeSobreSegment,
        updateBackstageField,
        updateServicosField,
        saveChanges,
        resetToOriginal,
        exportModalOpen,
        setExportModalOpen,
        isAddModalOpen,
        setIsAddModalOpen,
        addCase,
        deleteCase,
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

export const useCms = (): CmsContextType => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};