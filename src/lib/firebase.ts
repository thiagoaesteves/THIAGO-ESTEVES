import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  initializeFirestore, 
  getFirestore, 
  doc, 
  getDoc, 
  getDocFromServer,
  setDoc,
  Firestore 
} from "firebase/firestore";
import { fetchJsonBin, saveJsonBin } from "./jsonbin";

// Configuração oficial do projeto Firebase no Google AI Studio
export const firebaseConfig = {
  projectId: "gen-lang-client-0423855874",
  appId: "1:11081994761:web:3bfb6452764b1e0dec5ed8",
  apiKey: "AIzaSyCM-syKpAFXDfFjnjf62aZgaxgWqzDQ68s",
  authDomain: "gen-lang-client-0423855874.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-thiagoesteves-9fb46c9e-ff07-461c-b108-042cb69fb0e6",
  storageBucket: "gen-lang-client-0423855874.firebasestorage.app",
  messagingSenderId: "11081994761"
};

// Inicialização segura da aplicação Firebase
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const DATABASE_ID = firebaseConfig.firestoreDatabaseId;

// Inicializa a instância do Firestore vinculada à base de dados personalizada (DATABASE_ID).
let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true,
    },
    DATABASE_ID
  );
} catch {
  firestoreInstance = getFirestore(app, DATABASE_ID);
}

export const db: Firestore = firestoreInstance;

export interface SectionGridSettings {
  gridLadoA: 1 | 2 | 3;
  gridLadoB: 1 | 2 | 3;
  gridBonus: 1 | 2 | 3;
}

// Referências aos documentos do Firestore na coleção 'portfolio_content'
export const PORTFOLIO_DOC_REF = doc(db, "portfolio_content", "cases");
const DOC_LADO_A_REF = doc(db, "portfolio_content", "cases_lado_a");
const DOC_LADO_B_REF = doc(db, "portfolio_content", "cases_lado_b");
const DOC_BONUS_REF = doc(db, "portfolio_content", "cases_bonus");
const DOC_META_REF = doc(db, "portfolio_content", "meta");

/**
 * Remove qualquer campo com valor undefined de objetos e arrays
 * para impedir erros de "Unsupported field value: undefined" no Firestore.
 */
export function cleanForFirestore<T>(data: T): T {
  if (data === undefined || data === null) return data;
  return JSON.parse(JSON.stringify(data));
}

/**
 * Busca os dados mais recentes do portfólio na nuvem.
 * Consulta de forma resiliente tanto a API do Servidor (/api/portfolio),
 * o Google Firestore e o JsonBin (quando configurado), consolidando a versão mais recente.
 */
export async function fetchCloudPortfolio(): Promise<{
  cases?: any[];
  sobre?: any;
  servicos?: any;
  gridSettings?: SectionGridSettings;
  updatedAt?: string;
}> {
  let serverData: any = null;
  let firestoreData: any = null;
  let jsonBinData: any = null;

  // 1. Consulta a API do Servidor (/api/portfolio)
  try {
    const res = await fetch('/api/portfolio');
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        serverData = json.data;
      }
    }
  } catch (err) {
    console.warn('Aviso ao consultar /api/portfolio:', err);
  }

  // 2. Consulta o Firestore
  try {
    const [docA, docB, docBonus, docMeta] = await Promise.all([
      getDoc(DOC_LADO_A_REF).catch(() => null),
      getDoc(DOC_LADO_B_REF).catch(() => null),
      getDoc(DOC_BONUS_REF).catch(() => null),
      getDoc(DOC_META_REF).catch(() => null),
    ]);

    const hasPartitionedData =
      (docA && docA.exists()) ||
      (docB && docB.exists()) ||
      (docBonus && docBonus.exists()) ||
      (docMeta && docMeta.exists());

    if (hasPartitionedData) {
      const casesA = docA && docA.exists() ? docA.data().items || [] : [];
      const casesB = docB && docB.exists() ? docB.data().items || [] : [];
      const casesBonus = docBonus && docBonus.exists() ? docBonus.data().items || [] : [];
      const metaData = docMeta && docMeta.exists() ? docMeta.data() : {};
      const combinedCases = [...casesA, ...casesB, ...casesBonus];

      firestoreData = {
        cases: combinedCases.length > 0 ? combinedCases : undefined,
        sobre: metaData.sobre || undefined,
        servicos: metaData.servicos || undefined,
        gridSettings: metaData.gridSettings || undefined,
        updatedAt: metaData.updatedAt || undefined,
      };
    } else {
      const snap = await getDoc(PORTFOLIO_DOC_REF).catch(() => null);
      if (snap && snap.exists()) {
        const data = snap.data();
        firestoreData = {
          cases: Array.isArray(data.cases) ? data.cases : undefined,
          sobre: data.sobre || undefined,
          servicos: data.servicos || undefined,
          gridSettings: data.gridSettings || undefined,
          updatedAt: data.updatedAt || undefined,
        };
      }
    }
  } catch (error) {
    console.warn('Aviso ao buscar dados do Firestore:', error);
  }

  // 3. Consulta JsonBin (se configurado)
  try {
    jsonBinData = await fetchJsonBin();
  } catch (err) {
    console.warn('Aviso ao buscar dados do JsonBin:', err);
  }

  // Compara os timestamps para usar a fonte mais recente
  const candidates = [serverData, firestoreData, jsonBinData].filter(Boolean);
  if (candidates.length === 0) return {};

  candidates.sort((a, b) => {
    const tA = new Date(a.updatedAt || 0).getTime();
    const tB = new Date(b.updatedAt || 0).getTime();
    return tB - tA;
  });

  const bestCandidate = candidates[0];

  return {
    cases: Array.isArray(bestCandidate.cases) ? bestCandidate.cases : undefined,
    sobre: bestCandidate.sobre || undefined,
    servicos: bestCandidate.servicos || undefined,
    gridSettings: bestCandidate.gridSettings || undefined,
    updatedAt: bestCandidate.updatedAt || undefined,
  };
}

/**
 * Salva e sincroniza os dados do portfólio na nuvem em tempo real.
 * Envia simultaneamente para:
 * 1. O backend da aplicação (/api/portfolio)
 * 2. O Firebase Firestore (com higienização de tipos para evitar rejeição)
 * 3. O JsonBin (se configurado via VITE_JSONBIN_BIN_ID)
 */
export async function saveCloudPortfolio(
  cases?: any[],
  sobre?: any,
  gridSettings?: any,
  servicos?: any
): Promise<{ success: boolean; error?: string }> {
  const allCases = Array.isArray(cases) ? cases : [];
  const timestamp = new Date().toISOString();

  const payloadToSave = {
    cases: allCases,
    sobre: sobre || {},
    servicos: servicos || {},
    gridSettings: gridSettings || {},
    updatedAt: timestamp,
    version: '3.0',
    editorSignature: 'thiago-cms',
  };

  let atLeastOneSuccess = false;
  let lastError: any = null;

  // 1. Salva na API do Servidor (/api/portfolio)
  try {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadToSave),
    });
    if (res.ok) {
      atLeastOneSuccess = true;
    }
  } catch (err) {
    console.warn('Aviso ao sincronizar com /api/portfolio:', err);
    lastError = err;
  }

  // 2. Salva no Google Firestore (com higienização profunda contra undefined)
  try {
    const cleanPayload = cleanForFirestore(payloadToSave);
    const casesA = allCases.filter((c: any) => c.lado === 'A');
    const casesB = allCases.filter((c: any) => c.lado === 'B');
    const casesBonus = allCases.filter((c: any) => c.lado === 'bonus');

    // Tenta primeiro salvar no documento unificado se couber no limite de tamanho
    const jsonLen = JSON.stringify(cleanPayload).length;
    if (jsonLen < 850000) {
      await setDoc(PORTFOLIO_DOC_REF, cleanPayload);
      atLeastOneSuccess = true;
    } else {
      // Caso exceda, salva particionado por seção
      await Promise.all([
        setDoc(DOC_LADO_A_REF, cleanForFirestore({ items: casesA, updatedAt: timestamp })),
        setDoc(DOC_LADO_B_REF, cleanForFirestore({ items: casesB, updatedAt: timestamp })),
        setDoc(DOC_BONUS_REF, cleanForFirestore({ items: casesBonus, updatedAt: timestamp })),
        setDoc(
          DOC_META_REF,
          cleanForFirestore({
            sobre: sobre || {},
            gridSettings: gridSettings || {},
            servicos: servicos || {},
            version: '3.0',
            editorSignature: 'thiago-cms',
            updatedAt: timestamp,
          })
        ),
      ]);
      atLeastOneSuccess = true;
    }
  } catch (error: any) {
    console.warn('Aviso ao sincronizar com Firestore:', error?.message || error);
    lastError = error;
  }

  // 3. Salva no JsonBin (se configurado)
  try {
    const jsonBinOk = await saveJsonBin(payloadToSave);
    if (jsonBinOk) {
      atLeastOneSuccess = true;
    }
  } catch (err) {
    console.warn('Aviso ao salvar no JsonBin:', err);
  }

  if (atLeastOneSuccess) {
    return { success: true };
  }

  return { success: false, error: lastError?.message || String(lastError) };
}

/**
 * Testa a conexão com os serviços de nuvem.
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) return true;
  } catch {}

  try {
    await getDocFromServer(DOC_META_REF);
    return true;
  } catch {
    try {
      await getDoc(DOC_META_REF);
      return true;
    } catch {
      return false;
    }
  }
}

export default app;

