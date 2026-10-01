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
const LAYOUT_DOC_ID = 'layout';
const COLLECTION_NAME = 'portfolio_content';
const EDITOR_SIGNATURE = 'criadoRJ_verified';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: true,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

export interface CloudPortfolioData {
  cases: CaseItem[] | null;
  sobre: SobreData | null;
  gridColumns?: 1 | 2 | 3;
  lastUpdated?: string;
}

/**
 * Validates connection to Firestore from the client as required by Firebase architecture
 */
export async function testFirestoreConnection(): Promise<boolean> {
  const path = `${COLLECTION_NAME}/${CASES_DOC_ID}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, CASES_DOC_ID);
    await getDocFromServer(docRef);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline fallback activated.');
    }
    handleFirestoreError(error, OperationType.GET, path);
    return false;
  }
}

/**
 * Loads published portfolio data (cases, about narrative and layout settings) from Firestore
 */
export async function fetchCloudPortfolio(): Promise<CloudPortfolioData> {
  const casesPath = `${COLLECTION_NAME}/${CASES_DOC_ID}`;
  const sobrePath = `${COLLECTION_NAME}/${SOBRE_DOC_ID}`;
  const layoutPath = `${COLLECTION_NAME}/${LAYOUT_DOC_ID}`;

  try {
    const casesRef = doc(db, COLLECTION_NAME, CASES_DOC_ID);
    const sobreRef = doc(db, COLLECTION_NAME, SOBRE_DOC_ID);
    const layoutRef = doc(db, COLLECTION_NAME, LAYOUT_DOC_ID);

    const [casesSnap, sobreSnap, layoutSnap] = await Promise.all([
      getDoc(casesRef),
      getDoc(sobreRef),
      getDoc(layoutRef),
    ]);

    let loadedCases: CaseItem[] | null = null;
    let loadedSobre: SobreData | null = null;
    let loadedGridColumns: 1 | 2 | 3 | undefined = undefined;
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

    if (layoutSnap.exists()) {
      const data = layoutSnap.data();
      if (data && typeof data.content === 'string') {
        try {
          const parsed = JSON.parse(data.content);
          if (parsed && (parsed.gridColumns === 1 || parsed.gridColumns === 2 || parsed.gridColumns === 3)) {
            loadedGridColumns = parsed.gridColumns;
          }
        } catch (e) {
          // ignore parsing error
        }
      }
    }

    return {
      cases: loadedCases,
      sobre: loadedSobre,
      gridColumns: loadedGridColumns,
      lastUpdated,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${casesPath}, ${sobrePath}, ${layoutPath}`);
    return {
      cases: null,
      sobre: null,
    };
  }
}

/**
 * Saves published portfolio data and layout preferences to cloud Firestore
 */
export async function saveCloudPortfolio(
  cases: CaseItem[],
  sobre: SobreData,
  gridColumns: 1 | 2 | 3 = 2
): Promise<{ success: boolean; error?: string }> {
  const writePath = `${COLLECTION_NAME}/[cases, sobre, layout]`;
  try {
    const casesRef = doc(db, COLLECTION_NAME, CASES_DOC_ID);
    const sobreRef = doc(db, COLLECTION_NAME, SOBRE_DOC_ID);
    const layoutRef = doc(db, COLLECTION_NAME, LAYOUT_DOC_ID);
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
      setDoc(layoutRef, {
        content: JSON.stringify({ gridColumns }),
        updatedAt: timestamp,
        version: '1.0',
        editorSignature: EDITOR_SIGNATURE,
      }),
    ]);

    return { success: true };
  } catch (error: any) {
    const errInfo = handleFirestoreError(error, OperationType.WRITE, writePath);
    return {
      success: false,
      error: errInfo.error || 'Falha ao gravar dados na nuvem',
    };
  }
}
