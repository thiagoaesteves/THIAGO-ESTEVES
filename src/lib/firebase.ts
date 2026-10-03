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

// Funções mock exigidas pelo ecossistema para evitar erros de importação
export async function fetchCloudPortfolio() {
  return { cases: [] };
}

export async function saveCloudPortfolio() {
  return true;
}

export async function testFirestoreConnection() {
  return true;
}

export default app;