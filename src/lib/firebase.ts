import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { CaseItem } from '../types';
import { SobreData } from '../data/sobre';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with configured database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const CASES_DOC_ID = 'cases';
const SOBRE_DOC_ID = 'sobre';
const COLLECTION_NAME = 'portfolio_content';
const EDITOR_SIGNATURE = 'criadoRJ_verified';

export interface CloudPortfolioData {
  cases: CaseItem[] | null;
  sobre: SobreData | null;
  lastUpdated?: string;
}

/**
 * Validates connection to Firestore from the client as required by Firebase architecture
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, CASES_DOC_ID);
    await getDocFromServer(docRef);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline fallback activated.');
    }
    return false;
  }
}

/**
 * Loads published portfolio data (cases and about narrative) from Firestore
 */
export async function fetchCloudPortfolio(): Promise<CloudPortfolioData> {
  try {
    const casesRef = doc(db, COLLECTION_NAME, CASES_DOC_ID);
    const sobreRef = doc(db, COLLECTION_NAME, SOBRE_DOC_ID);

    const [casesSnap, sobreSnap] = await Promise.all([
      getDoc(casesRef),
      getDoc(sobreRef),
    ]);

    let loadedCases: CaseItem[] | null = null;
    let loadedSobre: SobreData | null = null;
    let lastUpdated: string | undefined = undefined;

    if (casesSnap.exists()) {
      const data = casesSnap.data();
      if (data && typeof data.content === 'string') {
        const parsed = JSON.parse(data.content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedCases = parsed;
          lastUpdated = data.updatedAt;
        }
      }
    }

    if (sobreSnap.exists()) {
      const data = sobreSnap.data();
      if (data && typeof data.content === 'string') {
        const parsed = JSON.parse(data.content);
        if (parsed && typeof parsed === 'object') {
          loadedSobre = parsed;
        }
      }
    }

    return {
      cases: loadedCases,
      sobre: loadedSobre,
      lastUpdated,
    };
  } catch (error) {
    console.warn('Erro ao carregar dados do Firestore (usando fallback local):', error);
    return {
      cases: null,
      sobre: null,
    };
  }
}

/**
 * Saves published portfolio data to cloud Firestore with editor verification
 */
export async function saveCloudPortfolio(
  cases: CaseItem[],
  sobre: SobreData
): Promise<{ success: boolean; error?: string }> {
  try {
    const casesRef = doc(db, COLLECTION_NAME, CASES_DOC_ID);
    const sobreRef = doc(db, COLLECTION_NAME, SOBRE_DOC_ID);
    const timestamp = new Date().toISOString();

    await Promise.all([
      setDoc(casesRef, {
        content: JSON.stringify(cases),
        updatedAt: timestamp,
        version: '1.0',
        editorSignature: EDITOR_SIGNATURE,
      }),
      setDoc(sobreRef, {
        content: JSON.stringify(sobre),
        updatedAt: timestamp,
        version: '1.0',
        editorSignature: EDITOR_SIGNATURE,
      }),
    ]);

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao salvar no Firestore:', error);
    return {
      success: false,
      error: error?.message || 'Falha ao gravar dados na nuvem',
    };
  }
}
