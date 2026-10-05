import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCM-syKpAFXDfFjnjf62aZgaxgWqzDQ68s",
  authDomain: "ai-studio-thiagoesteves-9fb46c9e-ff07-461c-b108-042469fb0e6.firebaseapp.com",
  projectId: "ai-studio-thiagoesteves-9fb46c9e-ff07-461c-b108-042469fb0e6",
  storageBucket: "ai-studio-thiagoesteves-9fb46c9e-ff07-461c-b108-042469fb0e6.firebasestorage.app",
  messagingSenderId: "11081994761",
  appId: "1:11081994761:web:3bfb6452764b1e0dec5ed8"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Liga à base de dados padrão do Project ID correto
export const db = getFirestore(app);

export interface SectionGridSettings {
  gridLadoA: 1 | 2 | 3;
  gridLadoB: 1 | 2 | 3;
  gridBonus: 1 | 2 | 3;
}

const PORTFOLIO_DOC_REF = doc(db, "portfolio_content", "cases");

export async function fetchCloudPortfolio(): Promise<{
  cases?: any[];
  sobre?: any;
  gridSettings?: SectionGridSettings;
}> {
  try {
    const snap = await getDoc(PORTFOLIO_DOC_REF);
    if (snap.exists()) {
      const data = snap.data();
      return {
        cases: data.cases || [],
        sobre: data.sobre || undefined,
        gridSettings: data.gridSettings || undefined,
      };
    }
    return {};
  } catch (error) {
    console.error("Erro ao buscar da nuvem:", error);
    return {};
  }
}

export async function saveCloudPortfolio(
  cases?: any,
  sobre?: any,
  gridSettings?: any
): Promise<{ success: boolean; error?: string }> {
  try {
    await setDoc(PORTFOLIO_DOC_REF, {
      cases: cases || [],
      sobre: sobre || {},
      gridSettings: gridSettings || {},
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao salvar na nuvem:", error);
    return { success: false, error: error.message };
  }
}

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDoc(PORTFOLIO_DOC_REF);
    return true;
  } catch (error) {
    console.error("Erro ao testar ligação ao Firestore:", error);
    return false;
  }
}

export default app;