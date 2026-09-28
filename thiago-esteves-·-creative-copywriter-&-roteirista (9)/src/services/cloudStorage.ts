import { CaseItem, SobreData } from '../types';

export interface CloudConfig {
  provider: 'jsonbin' | 'custom';
  jsonbinBinId: string;
  jsonbinApiKey: string;
  customEndpointUrl: string;
  customApiKey?: string;
  autoSync: boolean;
}

export interface CloudPayload {
  cases: CaseItem[];
  sobre: SobreData;
  updatedAt?: string;
  version?: number;
}

const CONFIG_STORAGE_KEY = 'cms_cloud_config';

export function getStoredCloudConfig(): CloudConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        provider: parsed.provider || 'jsonbin',
        jsonbinBinId: parsed.jsonbinBinId || import.meta.env.VITE_JSONBIN_BIN_ID || '',
        jsonbinApiKey: parsed.jsonbinApiKey || import.meta.env.VITE_JSONBIN_API_KEY || '',
        customEndpointUrl: parsed.customEndpointUrl || '',
        customApiKey: parsed.customApiKey || '',
        autoSync: parsed.autoSync !== false,
      };
    }
  } catch (err) {
    console.error('Erro ao ler configuração da nuvem do localStorage:', err);
  }

  return {
    provider: 'jsonbin',
    jsonbinBinId: (import.meta.env.VITE_JSONBIN_BIN_ID as string) || '',
    jsonbinApiKey: (import.meta.env.VITE_JSONBIN_API_KEY as string) || '',
    customEndpointUrl: '',
    customApiKey: '',
    autoSync: true,
  };
}

export function saveStoredCloudConfig(config: CloudConfig): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Erro ao salvar configuração da nuvem:', err);
  }
}

export function isCloudConfigured(config: CloudConfig = getStoredCloudConfig()): boolean {
  if (config.provider === 'jsonbin') {
    return Boolean(config.jsonbinBinId && config.jsonbinBinId.trim());
  }
  if (config.provider === 'custom') {
    return Boolean(config.customEndpointUrl && config.customEndpointUrl.trim());
  }
  return false;
}

/**
 * Creates a brand new bin in JSONBin.io automatically using the user's API Key
 */
export async function createNewJsonBin(
  apiKey: string,
  initialData: CloudPayload
): Promise<{ binId: string }> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    throw new Error('A Master Key do JSONBin.io é obrigatória para criar uma nova base.');
  }

  const response = await fetch('https://api.jsonbin.io/v3/b', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': cleanKey,
      'X-Bin-Name': 'portfolio-thiago-esteves',
      'X-Bin-Private': 'false', // public read, master key write (allows visitors on Netlify to read without key)
    },
    body: JSON.stringify({
      cases: initialData.cases,
      sobre: initialData.sobre,
      updatedAt: new Date().toISOString(),
      version: 1,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao criar Bin no JSONBin.io (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  const binId = json.metadata?.id || json.id;
  if (!binId) {
    throw new Error('JSONBin.io não retornou o ID da base criada.');
  }

  return { binId };
}

/**
 * Carrega os dados atualizados da base de dados na nuvem (JSONBin.io ou API personalizada)
 */
export async function fetchFromCloud(
  config: CloudConfig = getStoredCloudConfig()
): Promise<CloudPayload | null> {
  if (!isCloudConfigured(config)) {
    return null;
  }

  try {
    if (config.provider === 'jsonbin') {
      const binId = config.jsonbinBinId.trim();
      const apiKey = config.jsonbinApiKey.trim();
      const url = `https://api.jsonbin.io/v3/b/${binId}/latest?meta=false`;

      const headers: Record<string, string> = {};
      if (apiKey) {
        headers['X-Master-Key'] = apiKey;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        // If meta=false isn't supported or fails, retry standard endpoint
        const retryUrl = `https://api.jsonbin.io/v3/b/${binId}/latest`;
        const retryRes = await fetch(retryUrl, { method: 'GET', headers });
        if (!retryRes.ok) {
          throw new Error(`Erro ao buscar dados do JSONBin.io (status ${retryRes.status})`);
        }
        const retryJson = await retryRes.json();
        const record = retryJson.record || retryJson;
        if (record && (Array.isArray(record.cases) || record.sobre)) {
          return {
            cases: Array.isArray(record.cases) ? record.cases : [],
            sobre: record.sobre || ({} as SobreData),
            updatedAt: record.updatedAt,
          };
        }
        return null;
      }

      const data = await response.json();
      const record = data.record || data;
      if (record && (Array.isArray(record.cases) || record.sobre)) {
        return {
          cases: Array.isArray(record.cases) ? record.cases : [],
          sobre: record.sobre || ({} as SobreData),
          updatedAt: record.updatedAt,
        };
      }
      return null;
    }

    if (config.provider === 'custom') {
      const url = config.customEndpointUrl.trim();
      const headers: Record<string, string> = {
        Accept: 'application/json',
      };
      if (config.customApiKey?.trim()) {
        headers['Authorization'] = `Bearer ${config.customApiKey.trim()}`;
        headers['X-API-Key'] = config.customApiKey.trim();
      }

      const response = await fetch(url, { method: 'GET', headers });
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados da API nuvem (status ${response.status})`);
      }
      const data = await response.json();
      const record = data.record || data.data || data;
      if (record && (Array.isArray(record.cases) || record.sobre)) {
        return {
          cases: Array.isArray(record.cases) ? record.cases : [],
          sobre: record.sobre || ({} as SobreData),
          updatedAt: record.updatedAt,
        };
      }
    }
  } catch (err) {
    console.warn('Aviso: Não foi possível sincronizar com a nuvem no momento:', err);
  }

  return null;
}

/**
 * Salva as alterações na base de dados na nuvem (JSONBin.io ou API personalizada)
 */
export async function saveToCloud(
  payload: CloudPayload,
  config: CloudConfig = getStoredCloudConfig()
): Promise<{ success: boolean; message: string }> {
  if (!isCloudConfigured(config)) {
    return {
      success: false,
      message: 'Base de dados na nuvem ainda não configurada.',
    };
  }

  const cleanPayload = {
    cases: payload.cases,
    sobre: payload.sobre,
    updatedAt: new Date().toISOString(),
    version: 1,
  };

  try {
    if (config.provider === 'jsonbin') {
      const binId = config.jsonbinBinId.trim();
      const apiKey = config.jsonbinApiKey.trim();

      if (!apiKey) {
        return {
          success: false,
          message: 'A chave Master Key do JSONBin.io é necessária para salvar alterações na nuvem.',
        };
      }

      const url = `https://api.jsonbin.io/v3/b/${binId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': apiKey,
        },
        body: JSON.stringify(cleanPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Falha ao salvar no JSONBin.io (${response.status}): ${errorText}`);
      }

      return {
        success: true,
        message: 'Dados publicados globalmente na nuvem com sucesso! O Netlify e todos os visitantes já verão as alterações.',
      };
    }

    if (config.provider === 'custom') {
      const url = config.customEndpointUrl.trim();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (config.customApiKey?.trim()) {
        headers['Authorization'] = `Bearer ${config.customApiKey.trim()}`;
        headers['X-API-Key'] = config.customApiKey.trim();
      }

      // Try PUT first, fallback to POST
      let response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(cleanPayload),
      });

      if (!response.ok && response.status === 405) {
        response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(cleanPayload),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Falha ao salvar na API personalizada (${response.status}): ${errorText}`);
      }

      return {
        success: true,
        message: 'Dados enviados para a nuvem com sucesso!',
      };
    }
  } catch (err: any) {
    console.error('Erro ao salvar na nuvem:', err);
    return {
      success: false,
      message: err.message || 'Erro inesperado ao salvar na nuvem.',
    };
  }

  return {
    success: false,
    message: 'Nenhum provedor de nuvem configurado.',
  };
}
