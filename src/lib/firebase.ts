import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração padrão integrada
const firebaseConfig = {
  apiKey: "mock-api-key-for-development",
  authDomain: "portfolio-app.firebaseapp.com",
  projectId: "portfolio-app",
  storageBucket: "portfolio-app.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000"
};

// Inicialização segura do Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

export interface SectionGridSettings {
  gridLadoA: 1 | 2 | 3;
  gridLadoB: 1 | 2 | 3;
  gridBonus: 1 | 2 | 3;
}

// Funções para sincronização do portfólio
export async function fetchCloudPortfolio(): Promise<{
  cases?: any[];
  sobre?: any;
  gridSettings?: SectionGridSettings;
  gridColumns?: number;
}> {
  return { cases: [] };
}

export async function saveCloudPortfolio(
  cases?: any,
  sobre?: any,
  gridSettings?: any
): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

export async function testFirestoreConnection(
  cases?: any,
  sobre?: any,
  gridSettings?: any
): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

export default app;