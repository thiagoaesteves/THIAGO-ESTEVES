import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { X, Cloud, Key, Database, RefreshCw, CheckCircle, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import { createNewJsonBin, fetchFromCloud, saveToCloud } from '../services/cloudStorage';

export const CmsCloudModal: React.FC = () => {
  const {
    cloudModalOpen,
    setCloudModalOpen,
    cloudConfig,
    updateCloudConfig,
    isSyncingCloud,
    cases,
    sobre,
    setCases,
    setSobre,
  } = useCms();

  const [provider, setProvider] = useState<'jsonbin' | 'custom'>(cloudConfig.provider || 'jsonbin');
  const [binId, setBinId] = useState(cloudConfig.jsonbinBinId || '');
  const [apiKey, setApiKey] = useState(cloudConfig.jsonbinApiKey || '');
  const [customUrl, setCustomUrl] = useState(cloudConfig.customEndpointUrl || '');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!cloudModalOpen) return null;

  const handleSaveConfig = () => {
    const updated = {
      ...cloudConfig,
      provider,
      jsonbinBinId: binId.trim(),
      jsonbinApiKey: apiKey.trim(),
      customEndpointUrl: customUrl.trim(),
    };
    updateCloudConfig(updated);
    setStatusMessage({ type: 'success', text: 'Configurações salvas no seu navegador com sucesso!' });
  };

  const handleCreateBin = async () => {
    if (!apiKey.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Insira sua Master Key do JSONBin.io para criar uma base automaticamente.',
      });
      return;
    }

    setIsProcessing(true);
    setStatusMessage({ type: 'info', text: 'Criando base de dados pública no JSONBin.io...' });
    try {
      const result = await createNewJsonBin(apiKey.trim(), { cases, sobre });
      setBinId(result.binId);
      const updated = {
        ...cloudConfig,
        provider: 'jsonbin',
        jsonbinBinId: result.binId,
        jsonbinApiKey: apiKey.trim(),
      };
      updateCloudConfig(updated);
      setStatusMessage({
        type: 'success',
        text: `Base criada e sincronizada com sucesso! ID: ${result.binId}. Agora o site já atualiza globalmente no Netlify.`,
      });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Erro ao criar base no JSONBin.io.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestAndPush = async () => {
    if (provider === 'jsonbin' && (!binId.trim() || !apiKey.trim())) {
      setStatusMessage({
        type: 'error',
        text: 'Preencha o Bin ID e a Master Key para enviar dados.',
      });
      return;
    }

    setIsProcessing(true);
    setStatusMessage({ type: 'info', text: 'Enviando dados do portfólio para a nuvem...' });
    try {
      const cfg = {
        ...cloudConfig,
        provider,
        jsonbinBinId: binId.trim(),
        jsonbinApiKey: apiKey.trim(),
        customEndpointUrl: customUrl.trim(),
      };
      updateCloudConfig(cfg);
      const result = await saveToCloud({ cases, sobre }, cfg);
      if (result.success) {
        setStatusMessage({
          type: 'success',
          text: 'Sucesso! Todos os dados e fotos foram publicados na nuvem e já estão visíveis globalmente.',
        });
      } else {
        setStatusMessage({ type: 'error', text: result.message });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Erro ao enviar dados para a nuvem.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePullFromCloud = async () => {
    if (provider === 'jsonbin' && !binId.trim()) {
      setStatusMessage({ type: 'error', text: 'Preencha o Bin ID para buscar dados da nuvem.' });
      return;
    }

    setIsProcessing(true);
    setStatusMessage({ type: 'info', text: 'Buscando versão mais recente na nuvem...' });
    try {
      const cfg = {
        ...cloudConfig,
        provider,
        jsonbinBinId: binId.trim(),
        jsonbinApiKey: apiKey.trim(),
        customEndpointUrl: customUrl.trim(),
      };
      const cloudData = await fetchFromCloud(cfg);
      if (cloudData && Array.isArray(cloudData.cases)) {
        setCases(cloudData.cases);
        if (cloudData.sobre) setSobre(cloudData.sobre);
        setStatusMessage({
          type: 'success',
          text: `Dados baixados com sucesso! ${cloudData.cases.length} cases carregados da nuvem.`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Nenhum dado válido retornado da nuvem. Verifique o Bin ID.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Erro ao buscar da nuvem.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={() => setCloudModalOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0F1222] text-[#F6F7F2] rounded-2xl border border-white/20 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Cloud className="w-6 h-6 text-[#2340FF] dark:text-[#D4FF3A]" />
              <h3 className="font-disp font-extrabold text-2xl text-white">
                Persistência Global na Nuvem
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#AFC0FF] font-mono-code">
              Publique suas alterações para qualquer visitante em qualquer dispositivo (Netlify).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCloudModalOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Provider Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setProvider('jsonbin')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold transition-all cursor-pointer ${
              provider === 'jsonbin'
                ? 'bg-[#2340FF] text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> JSONBin.io (Recomendado)
          </button>
          <button
            type="button"
            onClick={() => setProvider('custom')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold transition-all cursor-pointer ${
              provider === 'custom'
                ? 'bg-[#2340FF] text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            API REST Personalizada
          </button>
        </div>

        {/* JSONBin.io Fields */}
        {provider === 'jsonbin' && (
          <div className="space-y-4">
            <div className="bg-[#2340FF]/10 border border-[#2340FF]/30 p-3.5 rounded-xl space-y-2 text-xs font-mono-code text-[#AFC0FF]">
              <div className="flex items-center justify-between text-white font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4FF3A]" /> Como funciona o JSONBin.io (Gratuito)
                </span>
                <a
                  href="https://jsonbin.io/app/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#D4FF3A] hover:underline"
                >
                  Criar conta / Obter Master Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p>
                1. Crie uma conta gratuita no <strong>jsonbin.io</strong> e copie sua <strong>Master Key</strong> (aba API Keys).
              </p>
              <p>
                2. Cole a chave abaixo e clique em <strong>"Criar Base Automaticamente"</strong>. O sistema configurará tudo para você!
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono-code text-white/80 block mb-1 font-semibold">
                  JSONBin Master Key (Chave Secreta para escrita):
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Key className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="$2a$10$..."
                      className="w-full pl-9 pr-3 py-2 text-xs font-mono-code rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#2340FF]"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={isProcessing || !apiKey.trim()}
                    onClick={handleCreateBin}
                    className="px-3 py-2 rounded-lg text-xs font-mono-code font-bold bg-[#D4FF3A] hover:bg-[#c2ed2c] text-[#0F1222] transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap shadow-sm"
                    title="Cria o Bin público no JSONBin.io e salva os dados atuais nele"
                  >
                    Criar Base Automática
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono-code text-white/80 block mb-1 font-semibold">
                  Bin ID (Identificador da base de dados):
                </label>
                <input
                  type="text"
                  value={binId}
                  onChange={(e) => setBinId(e.target.value)}
                  placeholder="ex: 674a2b9..."
                  className="w-full px-3 py-2 text-xs font-mono-code rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#2340FF]"
                />
                <span className="text-[11px] text-white/40 font-mono-code mt-1 block">
                  Dica Netlify: Você também pode definir as variáveis de ambiente <code className="text-[#D4FF3A]">VITE_JSONBIN_BIN_ID</code> e <code className="text-[#D4FF3A]">VITE_JSONBIN_API_KEY</code> no painel do Netlify.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Custom API */}
        {provider === 'custom' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-mono-code text-white/80 block mb-1 font-semibold">
                URL do Endpoint JSON (ex: Pantry Cloud, npoint ou servidor próprio):
              </label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs font-mono-code rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#2340FF]"
              />
            </div>
          </div>
        )}

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-mono-code ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-red-500/20 border border-red-500/40 text-red-300'
                : 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
            }`}
          >
            {statusMessage.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
            {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
            {statusMessage.type === 'info' && <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isProcessing || isSyncingCloud}
              onClick={handleTestAndPush}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono-code font-bold bg-[#2340FF] hover:bg-[#1B34D6] text-white shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Cloud className="w-3.5 h-3.5" /> Enviar Dados para a Nuvem
            </button>
            <button
              type="button"
              disabled={isProcessing || isSyncingCloud}
              onClick={handlePullFromCloud}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono-code font-bold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer disabled:opacity-50"
              title="Baixar a versão mais recente salva na nuvem"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} /> Sincronizar da Nuvem
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveConfig}
              className="px-3.5 py-2 rounded-lg text-xs font-mono-code font-bold bg-white/10 hover:bg-white/20 text-[#D4FF3A] border border-white/20 cursor-pointer"
            >
              Salvar Configurações
            </button>
            <button
              type="button"
              onClick={() => setCloudModalOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-mono-code text-white/60 hover:text-white cursor-pointer"
            >
              Concluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
