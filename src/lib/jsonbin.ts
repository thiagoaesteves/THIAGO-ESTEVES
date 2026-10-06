export interface JsonBinConfig {
  apiKey?: string;
  binId?: string;
}

export const getJsonBinConfig = (): JsonBinConfig => {
  const envKey = (import.meta as any).env?.VITE_JSONBIN_API_KEY;
  const envBin = (import.meta as any).env?.VITE_JSONBIN_BIN_ID;
  const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('jsonbin_api_key') : null;
  const localBin = typeof localStorage !== 'undefined' ? localStorage.getItem('jsonbin_bin_id') : null;

  return {
    apiKey: (envKey || localKey || '').trim(),
    binId: (envBin || localBin || '').trim(),
  };
};

export async function fetchJsonBin(): Promise<any | null> {
  const { apiKey, binId } = getJsonBinConfig();
  if (!binId) return null;

  try {
    const headers: Record<string, string> = {};
    if (apiKey) headers['X-Master-Key'] = apiKey;

    const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      headers,
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.record || json;
  } catch (err) {
    console.warn('Aviso ao consultar JsonBin:', err);
    return null;
  }
}

export async function saveJsonBin(data: any): Promise<boolean> {
  const { apiKey, binId } = getJsonBinConfig();
  if (!binId || !apiKey) return false;

  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': apiKey,
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.warn('Aviso ao salvar no JsonBin:', err);
    return false;
  }
}
