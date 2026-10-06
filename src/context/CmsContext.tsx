import React, { createContext, useContext, useState } from 'react';
import { CaseItem, GridSpanType } from '../types';

interface CmsContextType {
  cases: CaseItem[];
  isEditMode: boolean;
  toggleEditMode: () => void;
  addCase: (newProject: CaseItem) => void;
  deleteCase: (slug: string) => void;
  updateCaseField: (slug: string, field: string, value: any) => void;
  updateCaseGridSpan: (slug: string, span: GridSpanType) => void;
  reorderCases: (draggedSlug: string, targetSlug: string) => void;
  moveCaseOrder: (slug: string, direction: 'up' | 'down') => void;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  
  const [cases, setCases] = useState<CaseItem[]>(() => {
    const saved = localStorage.getItem('portfolio_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar cases do localStorage', e);
      }
    }
    return [];
  });

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  // Função para Adicionar Novo Projeto
  const addCase = (newProject: CaseItem) => {
    setCases((prevCases) => {
      const updated = [newProject, ...prevCases];
      localStorage.setItem('portfolio_projects', JSON.stringify(updated));
      return updated;
    });
  };

  // Função para Excluir Projeto pelo Slug
  const deleteCase = (slug: string) => {
    setCases((prevCases) => {
      const updated = prevCases.filter((c) => c.slug !== slug);
      localStorage.setItem('portfolio_projects', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCaseField = (slug: string, field: string, value: any) => {
    setCases((prevCases) => {
      const updated = prevCases.map((c) => (c.slug === slug ? { ...c, [field]: value } : c));
      localStorage.setItem('portfolio_projects', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCaseGridSpan = (slug: string, span: GridSpanType) => {
    updateCaseField(slug, 'gridSpan', span);
  };

  const reorderCases = (draggedSlug: string, targetSlug: string) => {
    setCases((prevCases) => {
      const list = [...prevCases];
      const draggedIndex = list.findIndex((c) => c.slug === draggedSlug);
      const targetIndex = list.findIndex((c) => c.slug === targetSlug);
      if (draggedIndex < 0 || targetIndex < 0) return prevCases;

      const [removed] = list.splice(draggedIndex, 1);
      list.splice(targetIndex, 0, removed);
      localStorage.setItem('portfolio_projects', JSON.stringify(list));
      return list;
    });
  };

  const moveCaseOrder = (slug: string, direction: 'up' | 'down') => {
    setCases((prevCases) => {
      const list = [...prevCases];
      const index = list.findIndex((c) => c.slug === slug);
      if (index < 0) return prevCases;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prevCases;

      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;

      localStorage.setItem('portfolio_projects', JSON.stringify(list));
      return list;
    });
  };

  return (
    <CmsContext.Provider
      value={{
        cases,
        isEditMode,
        toggleEditMode,
        addCase,
        deleteCase,
        updateCaseField,
        updateCaseGridSpan,
        reorderCases,
        moveCaseOrder,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms deve ser usado dentro de um CmsProvider');
  }
  return context;
};