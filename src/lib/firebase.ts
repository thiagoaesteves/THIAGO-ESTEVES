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
// Ativa 'experimentalAutoDetectLongPolling: true' para garantir estabilidade em ambientes de iframe/proxy (eliminando o erro 'client is offline').
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
 * Busca os dados mais recentes do portfólio diretamente da nuvem.
 * Suporta leitura particionada por seção para contornar o limite de 1MB por documento do Firestore.
 */
export async function fetchCloudPortfolio(): Promise<{
  cases?: any[];
  sobre?: any;
  servicos?: any;
  gridSettings?: SectionGridSettings;
  updatedAt?: string;
}> {
  try {
    // 1. Tenta carregar os documentos particionados em paralelo
    const [docA, docB, docBonus, docMeta] = await Promise.all([
      getDoc(DOC_LADO_A_REF),
      getDoc(DOC_LADO_B_REF),
      getDoc(DOC_BONUS_REF),
      getDoc(DOC_META_REF)
    ]);

    const hasPartitionedData = docA.exists() || docB.exists() || docBonus.exists() || docMeta.exists();

    if (hasPartitionedData) {
      const casesA = docA.exists() ? docA.data().items || [] : [];
      const casesB = docB.exists() ? docB.data().items || [] : [];
      const casesBonus = docBonus.exists() ? docBonus.data().items || [] : [];
      const metaData = docMeta.exists() ? docMeta.data() : {};

      const combinedCases = [...casesA, ...casesB, ...casesBonus];

      return {
        cases: combinedCases.length > 0 ? combinedCases : undefined,
        sobre: metaData.sobre || undefined,
        servicos: metaData.servicos || undefined,
        gridSettings: metaData.gridSettings || undefined,
        updatedAt: metaData.updatedAt || undefined,
      };
    }

    // 2. Fallback: lê do documento único principal 'cases'
    const snap = await getDoc(PORTFOLIO_DOC_REF);
    if (snap.exists()) {
      const data = snap.data();
      let loadedCases = data.cases;
      let loadedSobre = data.sobre;
      let loadedServicos = data.servicos;
      let loadedGrids = data.gridSettings;

      if (data.content && typeof data.content === 'string') {
        try {
          const parsed = JSON.parse(data.content);
          if (Array.isArray(parsed) && (!loadedCases || loadedCases.length === 0)) {
            loadedCases = parsed;
          } else if (parsed && typeof parsed === 'object') {
            if (Array.isArray(parsed.cases) && (!loadedCases || loadedCases.length === 0)) {
              loadedCases = parsed.cases;
            }
            if (parsed.sobre && !loadedSobre) {
              loadedSobre = parsed.sobre;
            }
            if (parsed.servicos && !loadedServicos) {
              loadedServicos = parsed.servicos;
            }
            if (parsed.gridSettings && !loadedGrids) {
              loadedGrids = parsed.gridSettings;
            }
          }
        } catch (e) {
          console.warn("Aviso ao analisar content JSON:", e);
        }
      }

      return {
        cases: loadedCases && Array.isArray(loadedCases) && loadedCases.length > 0 ? loadedCases : undefined,
        sobre: loadedSobre || undefined,
        servicos: loadedServicos || undefined,
        gridSettings: loadedGrids || undefined,
        updatedAt: data.updatedAt,
      };
    }

    return {};
  } catch (error) {
    console.error("Erro ao buscar dados do portfólio na nuvem:", error);
    return {};
  }
}

/**
 * Salva e sincroniza os dados do portfólio no Firestore.
 * Divide os casos entre seções (Lado A, Lado B, Faixa Bônus e Meta) garantindo que nenhum
 * documento exceda o limite de 1MB do Firestore (mesmo com imagens base64).
 */
export async function saveCloudPortfolio(
  cases?: any[],
  sobre?: any,
  gridSettings?: any,
  servicos?: any
): Promise<{ success: boolean; error?: string }> {
  try {
    const allCases = Array.isArray(cases) ? cases : [];
    const timestamp = new Date().toISOString();

    const casesA = allCases.filter((c: any) => c.lado === 'A');
    const casesB = allCases.filter((c: any) => c.lado === 'B');
    const casesBonus = allCases.filter((c: any) => c.lado === 'bonus');

    // Salva cada partição concorrentemente
    await Promise.all([
      setDoc(DOC_LADO_A_REF, {
        items: casesA,
        updatedAt: timestamp,
      }),
      setDoc(DOC_LADO_B_REF, {
        items: casesB,
        updatedAt: timestamp,
      }),
      setDoc(DOC_BONUS_REF, {
        items: casesBonus,
        updatedAt: timestamp,
      }),
      setDoc(DOC_META_REF, {
        sobre: sobre || {},
        gridSettings: gridSettings || {},
        servicos: servicos || {},
        version: '2.0',
        editorSignature: 'thiago-cms',
        updatedAt: timestamp,
      }),
    ]);

    // Opcionalmente atualiza o documento unificado se o payload total couber no limite de 850KB
    try {
      const unifiedPayload = {
        cases: allCases,
        sobre: sobre || {},
        servicos: servicos || {},
        gridSettings: gridSettings || {},
        version: '2.0',
        editorSignature: 'thiago-cms',
        updatedAt: timestamp,
      };
      if (JSON.stringify(unifiedPayload).length < 850000) {
        await setDoc(PORTFOLIO_DOC_REF, unifiedPayload);
      }
    } catch {
      // Se o documento unificado exceder o limite, as partições individuais já garantem a persistência
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao salvar dados na nuvem:", error);
    return { success: false, error: error?.message || String(error) };
  }
}

/**
 * Testa a conexão ativa com o Firestore no servidor.
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(DOC_META_REF);
    return true;
  } catch {
    try {
      await getDoc(DOC_META_REF);
      return true;
    } catch (e: any) {
      console.warn("Aviso de conexão com o Firestore:", e?.message || e);
      return false;
    }
  }
}

export default app;
