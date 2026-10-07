/**
 * ============================================================================
 * BLOCO DE CONFIGURAÇÃO DO FIREBASE (INSIRA SUAS CREDENCIAIS AQUI SE DESEJAR)
 * ============================================================================
 * Esta aplicação utiliza a SDK modular do Firebase (v9+ compatível com Vite e CDN).
 * Para conectar o seu próprio projeto Firebase com Firestore e Storage:
 * Substitua os valores abaixo pelas credenciais obtidas no Console Firebase:
 * https://console.firebase.google.com/
 *
 * Exemplo equivalente com CDN pura em HTML/JS:
 * <script type="module">
 *   import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
 *   import { getFirestore, doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
 *   import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
 * </script>
 */
export const FIREBASE_CREDENTIALS = {
  apiKey: "AIzaSyCM-syKpAFXDfFjnjf62aZgaxgWqzDQ68s",
  authDomain: "gen-lang-client-0423855874.firebaseapp.com",
  projectId: "gen-lang-client-0423855874",
  storageBucket: "gen-lang-client-0423855874.firebasestorage.app",
  messagingSenderId: "11081994761",
  appId: "1:11081994761:web:3bfb6452764b1e0dec5ed8",
  firestoreDatabaseId: "ai-studio-thiagoesteves-9fb46c9e-ff07-461c-b108-042cb69fb0e6",
};

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db, storage, cleanForFirestore } from './firebase';
import { convertFileToBase64 } from '../utils/imageUpload';
import defaultProfilePhoto from '../assets/profile-photo.webp';

export type ProfileFilterPreset = 'none' | 'bw' | 'sepia' | 'vintage' | 'contrast';

export interface ProfileMetadata {
  image_url: string;
  zoom: number;
  posX: number;
  posY: number;
  brightness: number;
  saturation: number;
  filter_preset: ProfileFilterPreset;
  updatedAt?: string;
}

export const DEFAULT_PROFILE_METADATA: ProfileMetadata = {
  image_url: defaultProfilePhoto || '/assets/profile-photo.webp',
  zoom: 1.45,
  posX: 0,
  posY: 0,
  brightness: 100,
  saturation: 100,
  filter_preset: 'none',
};

const PROFILE_DOC_REF = doc(db, 'config', 'profile');
const STORAGE_LOCAL_PROFILE_KEY = 'thiago_portfolio_profile_meta_v1';

/**
 * Calcula a string de filtro CSS com base no preset e parâmetros
 */
export function getProfileFilterCss(
  filter_preset: ProfileFilterPreset,
  brightness: number = 100,
  saturation: number = 100
): string {
  let presetEffect = '';
  switch (filter_preset) {
    case 'bw':
      presetEffect = 'grayscale(100%)';
      break;
    case 'sepia':
      presetEffect = 'sepia(80%)';
      break;
    case 'vintage':
      presetEffect = 'sepia(40%) contrast(115%)';
      break;
    case 'contrast':
      presetEffect = 'contrast(130%)';
      break;
    default:
      presetEffect = '';
      break;
  }
  return `brightness(${brightness}%) saturate(${saturation}%) ${presetEffect}`.trim();
}

/**
 * Calcula a transformação CSS de escala (zoom) e translação (posição X e Y)
 */
export function getProfileTransformCss(
  zoom: number = 1,
  posX: number = 0,
  posY: number = 0
): string {
  return `scale(${zoom}) translate(${posX}%, ${posY}%)`;
}

/**
 * Faz upload do arquivo para o Firebase Storage e gera uma URL pública.
 * Possui timeout e bloco try/catch robusto contra falhas de rede e permissão,
 * com fallback seguro para garantir que a interface nunca fique travada.
 */
export async function uploadProfileToStorage(file: File): Promise<{
  url: string;
  source: 'storage' | 'fallback_base64';
}> {
  try {
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `profiles/${timestamp}_${cleanFileName}`;
    const fileRef = ref(storage, storagePath);

    // Timeout de 6 segundos para evitar que a requisição fique travada indefinidamente caso o Storage esteja inacessível
    const uploadWithTimeout = new Promise<string>(async (resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Tempo limite excedido ao comunicar com Firebase Storage.'));
      }, 6000);

      try {
        const snapshot = await uploadBytes(fileRef, file, {
          contentType: file.type || 'image/jpeg',
        });
        const downloadUrl = await getDownloadURL(snapshot.ref);
        clearTimeout(timer);
        resolve(downloadUrl);
      } catch (uploadErr) {
        clearTimeout(timer);
        reject(uploadErr);
      }
    });

    const downloadUrl = await uploadWithTimeout;
    return { url: downloadUrl, source: 'storage' };
  } catch (storageError: any) {
    console.error(
      'Falha ou restrição no Firebase Storage (uploadBytes/getDownloadURL):',
      storageError?.message || storageError
    );
    try {
      const base64 = await convertFileToBase64(file);
      return { url: base64, source: 'fallback_base64' };
    } catch (fallbackError: any) {
      console.error('Falha ao processar imagem em modo de segurança:', fallbackError);
      throw new Error('Não foi possível processar o arquivo selecionado.');
    }
  }
}

/**
 * Salva os metadados da imagem no documento config/profile do Firestore
 */
export async function saveProfileMetadata(
  data: Partial<ProfileMetadata>
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = cleanForFirestore({
      image_url: data.image_url,
      zoom: typeof data.zoom === 'number' ? data.zoom : 1,
      posX: typeof data.posX === 'number' ? data.posX : 0,
      posY: typeof data.posY === 'number' ? data.posY : 0,
      brightness: typeof data.brightness === 'number' ? data.brightness : 100,
      saturation: typeof data.saturation === 'number' ? data.saturation : 100,
      filter_preset: data.filter_preset || 'none',
      updatedAt: new Date().toISOString(),
    });

    // Salva no Firestore
    await setDoc(PROFILE_DOC_REF, payload, { merge: true });

    // Salva em cache local para render imediato
    try {
      localStorage.setItem(STORAGE_LOCAL_PROFILE_KEY, JSON.stringify(payload));
    } catch {}

    return { success: true };
  } catch (error: any) {
    console.warn('Erro ao salvar no Firestore config/profile:', error);
    return { success: false, error: error?.message || String(error) };
  }
}

/**
 * Listener em tempo real (onSnapshot) para sincronização instantânea em qualquer navegador
 */
export function subscribeProfileMetadata(
  callback: (data: ProfileMetadata) => void,
  onError?: (err: any) => void
): () => void {
  // Inicialização a partir do cache local se existir
  try {
    const cached = localStorage.getItem(STORAGE_LOCAL_PROFILE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.image_url) {
        callback({
          ...DEFAULT_PROFILE_METADATA,
          ...parsed,
        });
      }
    }
  } catch {}

  // Listener ativo do Firestore
  const unsubscribe = onSnapshot(
    PROFILE_DOC_REF,
    (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.data();
        if (raw) {
          const profileData: ProfileMetadata = {
            image_url: raw.image_url || DEFAULT_PROFILE_METADATA.image_url,
            zoom: typeof raw.zoom === 'number' ? raw.zoom : 1,
            posX: typeof raw.posX === 'number' ? raw.posX : 0,
            posY: typeof raw.posY === 'number' ? raw.posY : 0,
            brightness: typeof raw.brightness === 'number' ? raw.brightness : 100,
            saturation: typeof raw.saturation === 'number' ? raw.saturation : 100,
            filter_preset: (raw.filter_preset as ProfileFilterPreset) || 'none',
            updatedAt: raw.updatedAt,
          };

          try {
            localStorage.setItem(STORAGE_LOCAL_PROFILE_KEY, JSON.stringify(profileData));
          } catch {}

          callback(profileData);
        }
      }
    },
    (error) => {
      console.warn('Aviso no listener do Firestore para config/profile:', error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}
