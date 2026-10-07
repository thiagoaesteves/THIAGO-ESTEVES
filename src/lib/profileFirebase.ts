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
import { onSnapshot, setDoc, doc, getDoc, getDocFromServer } from 'firebase/firestore';
import { db, storage, cleanForFirestore, PROFILE_DOC_REF } from './firebase';
import { convertFileToBase64 } from '../utils/imageUpload';
import defaultProfilePhoto from '../assets/profile-photo.webp';

export type ProfileFilterPreset = 'none' | 'bw' | 'sepia' | 'vintage' | 'contrast';
export type ProfileFitMode = 'contain' | 'cover';

export interface ProfileMetadata {
  image_url: string;
  zoom: number;
  posX: number;
  posY: number;
  brightness: number;
  saturation: number;
  filter_preset: ProfileFilterPreset;
  fit_mode?: ProfileFitMode;
  updatedAt?: string;
}

export const DEFAULT_PROFILE_METADATA: ProfileMetadata = {
  image_url: defaultProfilePhoto || '/assets/profile-photo.webp',
  zoom: 1.0,
  posX: 0,
  posY: 0,
  brightness: 100,
  saturation: 100,
  filter_preset: 'none',
  fit_mode: 'contain',
};

// Caminho estrito e unificado para o documento no Firestore: config/profile
export { PROFILE_DOC_REF };
export const STORAGE_LOCAL_PROFILE_KEY = 'thiago_portfolio_profile_meta_v1';

/**
 * Normaliza os dados brutos recebidos do Firestore em um ProfileMetadata válido
 */
export function sanitizeProfileData(raw: any): ProfileMetadata {
  return {
    image_url: typeof raw?.image_url === 'string' && raw.image_url.trim() ? raw.image_url : DEFAULT_PROFILE_METADATA.image_url,
    zoom: typeof raw?.zoom === 'number' && !isNaN(raw.zoom) ? raw.zoom : 1.0,
    posX: typeof raw?.posX === 'number' && !isNaN(raw.posX) ? raw.posX : 0,
    posY: typeof raw?.posY === 'number' && !isNaN(raw.posY) ? raw.posY : 0,
    brightness: typeof raw?.brightness === 'number' && !isNaN(raw.brightness) ? raw.brightness : 100,
    saturation: typeof raw?.saturation === 'number' && !isNaN(raw.saturation) ? raw.saturation : 100,
    filter_preset: (raw?.filter_preset as ProfileFilterPreset) || 'none',
    fit_mode: (raw?.fit_mode as ProfileFitMode) || 'contain',
    updatedAt: raw?.updatedAt || undefined,
  };
}

/**
 * Busca direta e prioritária no documento config/profile do Firestore.
 * Garante hidratação imediata ao carregar em novas abas ou novos navegadores.
 */
export async function fetchProfileMetadata(): Promise<ProfileMetadata | null> {
  try {
    let snap = await getDocFromServer(PROFILE_DOC_REF).catch(() => null);
    if (!snap || !snap.exists()) {
      snap = await getDoc(PROFILE_DOC_REF).catch(() => null);
    }

    if (snap && snap.exists()) {
      const raw = snap.data();
      if (raw) {
        const profileData = sanitizeProfileData(raw);

        // Atualiza o cache local com os dados oficiais recém-obtidos da nuvem
        try {
          localStorage.setItem(STORAGE_LOCAL_PROFILE_KEY, JSON.stringify(profileData));
        } catch (storageErr) {
          console.warn('Aviso ao sincronizar localStorage com profile do Firestore:', storageErr);
        }

        return profileData;
      }
    }
  } catch (firestoreErr: any) {
    console.error(
      '[Firestore config/profile] Erro ao buscar documento no servidor Firestore:',
      firestoreErr?.message || firestoreErr
    );
  }
  return null;
}

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
 * Salva os metadados da imagem exclusivamente no documento config/profile do Firestore
 * com tratamento explícito de erros (permissões, conexão, regras de segurança).
 */
export async function saveProfileMetadata(
  data: Partial<ProfileMetadata>
): Promise<{ success: boolean; error?: string; code?: string }> {
  try {
    if (!data.image_url || typeof data.image_url !== 'string') {
      throw new Error('URL da imagem inválida ou vazia.');
    }

    const payload = cleanForFirestore({
      image_url: data.image_url,
      zoom: typeof data.zoom === 'number' && !isNaN(data.zoom) ? data.zoom : 1.0,
      posX: typeof data.posX === 'number' && !isNaN(data.posX) ? data.posX : 0,
      posY: typeof data.posY === 'number' && !isNaN(data.posY) ? data.posY : 0,
      brightness: typeof data.brightness === 'number' && !isNaN(data.brightness) ? data.brightness : 100,
      saturation: typeof data.saturation === 'number' && !isNaN(data.saturation) ? data.saturation : 100,
      filter_preset: data.filter_preset || 'none',
      fit_mode: data.fit_mode || 'contain',
      updatedAt: new Date().toISOString(),
    });

    // Salva diretamente no documento unificado config/profile do Firestore
    await setDoc(PROFILE_DOC_REF, payload, { merge: true });

    // Atualiza o cache local somente após a confirmação de escrita na nuvem
    try {
      localStorage.setItem(STORAGE_LOCAL_PROFILE_KEY, JSON.stringify(payload));
    } catch (localErr) {
      console.warn('Aviso ao persistir cache local de perfil após salvar no Firestore:', localErr);
    }

    return { success: true };
  } catch (error: any) {
    const errorCode = error?.code || 'unknown';
    const rawMessage = error?.message || String(error);
    console.error(`[Firestore config/profile] Erro ao salvar (código: ${errorCode}):`, error);

    let userFriendlyMessage = 'Erro ao salvar alterações no Firebase Firestore.';
    if (errorCode === 'permission-denied') {
      userFriendlyMessage =
        'Permissão negada no Firestore: verifique as regras de segurança para o documento "config/profile".';
    } else if (errorCode === 'unavailable') {
      userFriendlyMessage =
        'Serviço do Firestore indisponível. Verifique sua conexão com a internet.';
    } else if (errorCode === 'resource-exhausted') {
      userFriendlyMessage = 'Limite de cota do Firestore atingido temporariamente.';
    } else if (rawMessage) {
      userFriendlyMessage = `Erro no Firestore: ${rawMessage}`;
    }

    return {
      success: false,
      code: errorCode,
      error: userFriendlyMessage,
    };
  }
}

/**
 * Listener em tempo real (onSnapshot) para sincronização instantânea em qualquer navegador.
 * Garante que dados remotos substituam imediatamente o estado local e atualizem o cache.
 */
export function subscribeProfileMetadata(
  callback: (data: ProfileMetadata) => void,
  onError?: (err: any) => void
): () => void {
  // Inicialização a partir do cache local se existir (para exibição inicial rápida)
  try {
    const cached = localStorage.getItem(STORAGE_LOCAL_PROFILE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.image_url) {
        callback(sanitizeProfileData(parsed));
      }
    }
  } catch {}

  // Listener ativo do Firestore diretamente em config/profile
  const unsubscribe = onSnapshot(
    PROFILE_DOC_REF,
    (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.data();
        if (raw) {
          const profileData = sanitizeProfileData(raw);

          // Atualiza imediatamente o localStorage para anular dados locais defasados
          try {
            localStorage.setItem(STORAGE_LOCAL_PROFILE_KEY, JSON.stringify(profileData));
          } catch {}

          callback(profileData);
        }
      }
    },
    (error) => {
      console.error('[Firestore config/profile] Erro no listener em tempo real onSnapshot:', error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}
