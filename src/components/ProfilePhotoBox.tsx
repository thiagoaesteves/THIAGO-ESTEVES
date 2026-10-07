import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  Loader2,
  ZoomIn,
  Move,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  Cloud,
  X,
  AlertCircle
} from 'lucide-react';
import {
  ProfileMetadata,
  ProfileFilterPreset,
  DEFAULT_PROFILE_METADATA,
  uploadProfileToStorage,
  saveProfileMetadata,
  subscribeProfileMetadata,
  getProfileFilterCss,
  getProfileTransformCss,
} from '../lib/profileFirebase';

interface ProfilePhotoBoxProps {
  isEditMode: boolean;
  cleanName: string;
  cleanRole: string;
  cleanBadge: string;
  defaultPhotoUrl: string;
  onPhotoUpdated?: (url: string) => void;
  renderTextLayer?: React.ReactNode;
}

export const ProfilePhotoBox: React.FC<ProfilePhotoBoxProps> = ({
  isEditMode,
  cleanName,
  cleanRole,
  cleanBadge,
  defaultPhotoUrl,
  onPhotoUpdated,
  renderTextLayer,
}) => {
  // Estado local sincronizado em tempo real com o Firestore (onSnapshot)
  const [profile, setProfile] = useState<ProfileMetadata>(() => ({
    ...DEFAULT_PROFILE_METADATA,
    image_url: defaultPhotoUrl || DEFAULT_PROFILE_METADATA.image_url,
  }));

  // Painel de controle no modo edição
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSource, setUploadSource] = useState<'storage' | 'fallback_base64' | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'frame' | 'filters' | 'upload'>('frame');

  // Controle de arrastar com mouse/toque dentro do box
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initPosX: number; initPosY: number }>({
    startX: 0,
    startY: 0,
    initPosX: 0,
    initPosY: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. SINCRONIZAÇÃO EM TEMPO REAL COM FIRESTORE (onSnapshot)
  // O listener onSnapshot apenas atualiza a interface local quando houver alteração remota,
  // SEM reescrever dados de volta para o banco de dados nem disparar commitChanges.
  useEffect(() => {
    const unsubscribe = subscribeProfileMetadata(
      (remoteData) => {
        setProfile((prev) => ({
          ...prev,
          ...remoteData,
          image_url: remoteData.image_url || prev.image_url || defaultPhotoUrl,
        }));
        // Importante: NÃO chamar onPhotoUpdated aqui dentro para evitar loops de reescrita contínua.
      },
      (err) => {
        console.warn('Aviso ao sincronizar perfil em tempo real via onSnapshot:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [defaultPhotoUrl]);

  // Atualização de campos individuais APENAS no estado local em tempo real (SEM salvar automaticamente)
  const handleProfileChange = useCallback((updates: Partial<ProfileMetadata>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  // Upload para o Firebase Storage com tratamento robusto de erros e liberação garantida do loading
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccessMessage(null);

    try {
      const result = await uploadProfileToStorage(file);
      setUploadSource(result.source);

      // Atualiza apenas o estado local para pré-visualização imediata (NÃO salva no Firestore até o clique)
      setProfile((prev) => ({
        ...prev,
        image_url: result.url,
      }));
      setHasUnsavedChanges(true);

      const msg =
        result.source === 'storage'
          ? 'Foto carregada com sucesso via Firebase Storage! Clique em "Salvar Alterações" para fixar na nuvem.'
          : 'Foto carregada com sucesso! Clique em "Salvar Alterações" para fixar na nuvem.';
      setUploadSuccessMessage(msg);
    } catch (err: any) {
      const errorMessage = err?.message || 'Falha ao processar o upload da imagem.';
      console.error('Erro no upload da foto:', err);
      setUploadError(errorMessage);
    } finally {
      // Obrigatoriamente desativa o estado de carregamento para nunca travar a interface
      setIsUploading(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  // Salvar EXCLUSIVAMENTE mediante ação intencional do usuário no botão "Salvar Alterações"
  const handleManualSave = async () => {
    setSaveStatus('saving');
    try {
      const res = await saveProfileMetadata(profile);
      if (res.success) {
        setSaveStatus('saved');
        setHasUnsavedChanges(false);

        // Notifica o callback do portfólio apenas quando o usuário salva explicitamente
        if (onPhotoUpdated && profile.image_url) {
          onPhotoUpdated(profile.image_url);
        }

        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        console.error('Erro ao salvar no Firestore:', res.error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3500);
      }
    } catch (err) {
      console.error('Erro crítico ao salvar no Firestore:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3500);
    }
  };

  // Resetar enquadramento e filtros para o padrão (apenas no estado local)
  const handleResetFraming = () => {
    handleProfileChange({
      zoom: 1.45,
      posX: 0,
      posY: 0,
    });
  };

  const handleResetFilters = () => {
    handleProfileChange({
      brightness: 100,
      saturation: 100,
      filter_preset: 'none' as ProfileFilterPreset,
    });
  };

  // HANDLERS DE ARRASTAR / ALINHAR COM MOUSE (Apenas alteram estado local, sem auto-save)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initPosX: profile.posX,
      initPosY: profile.posY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isEditMode) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    const rect = containerRef.current?.getBoundingClientRect();
    const width = rect?.width || 300;
    const height = rect?.height || 375;

    const pctX = (dx / width) * 100;
    const pctY = (dy / height) * 100;

    const newPosX = Math.max(-60, Math.min(60, Math.round(dragStartRef.current.initPosX + pctX)));
    const newPosY = Math.max(-60, Math.min(60, Math.round(dragStartRef.current.initPosY + pctY)));

    setProfile((prev) => ({ ...prev, posX: newPosX, posY: newPosY }));
    setHasUnsavedChanges(true);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // HANDLERS TOUCH PARA DISPOSITIVOS MÓVEIS (Apenas alteram estado local, sem auto-save)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isEditMode || e.touches.length === 0) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initPosX: profile.posX,
      initPosY: profile.posY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isEditMode || e.touches.length === 0) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.startX;
    const dy = touch.clientY - dragStartRef.current.startY;

    const rect = containerRef.current?.getBoundingClientRect();
    const width = rect?.width || 300;
    const height = rect?.height || 375;

    const pctX = (dx / width) * 100;
    const pctY = (dy / height) * 100;

    const newPosX = Math.max(-60, Math.min(60, Math.round(dragStartRef.current.initPosX + pctX)));
    const newPosY = Math.max(-60, Math.min(60, Math.round(dragStartRef.current.initPosY + pctY)));

    setProfile((prev) => ({ ...prev, posX: newPosX, posY: newPosY }));
    setHasUnsavedChanges(true);
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Estilos visuais dinâmicos calculados
  const filterStyle = getProfileFilterCss(
    profile.filter_preset,
    profile.brightness,
    profile.saturation
  );
  const transformStyle = getProfileTransformCss(profile.zoom, profile.posX, profile.posY);

  const displayPhotoUrl = profile.image_url || defaultPhotoUrl || DEFAULT_PROFILE_METADATA.image_url;

  return (
    <div className="relative flex flex-col items-center lg:items-start select-none">
      {/* Barra de Ações Rápidas no Modo Edição */}
      {isEditMode && (
        <div className="mb-2 flex items-center justify-between w-full max-w-[310px] gap-2">
          <button
            type="button"
            onClick={() => setIsEditorOpen(!isEditorOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono-code font-bold transition-all shadow-md cursor-pointer ${
              isEditorOpen
                ? 'bg-[#D4FF3A] text-[#0F1222]'
                : 'bg-black/85 text-[#D4FF3A] border border-[#D4FF3A]/40 hover:bg-black'
            }`}
          >
            <Sliders className="w-3 h-3" />
            {isEditorOpen ? 'Fechar Ajustes' : 'Ajustar Foto & Filtros'}
          </button>

          {/* Botão Explícito de Salvar Alterações */}
          <button
            type="button"
            onClick={handleManualSave}
            disabled={saveStatus === 'saving'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono-code font-bold transition-all shadow-md cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-[#2340FF] text-white hover:bg-[#1a32cc] border border-[#D4FF3A] animate-pulse'
                : 'bg-black/80 text-white/90 border border-white/20 hover:bg-black'
            }`}
          >
            {saveStatus === 'saving' ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-[#D4FF3A]" />
                <span>Salvando...</span>
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <Check className="w-3 h-3 text-[#D4FF3A]" />
                <span>Salvo!</span>
              </>
            ) : saveStatus === 'error' ? (
              <>
                <AlertCircle className="w-3 h-3 text-red-400" />
                <span className="text-red-400">Erro</span>
              </>
            ) : (
              <>
                <Cloud className="w-3 h-3 text-[#D4FF3A]" />
                <span>Salvar Alterações</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* BOX PRINCIPAL DA FOTO DE PERFIL */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-[240px] sm:w-[265px] lg:w-[295px] xl:w-[310px] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-white/20 bg-[#0F1222] group flex flex-col ${
          isEditMode ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
        }`}
      >
        {/* IMAGEM COM TRANSFORMAÇÕES E FILTROS APLICADOS EM TEMPO REAL */}
        <img
          src={displayPhotoUrl}
          alt={`${cleanName} · ${cleanRole}`}
          style={{
            transform: transformStyle,
            filter: filterStyle,
            transformOrigin: 'center center',
          }}
          className="w-full h-full object-cover absolute inset-0 pointer-events-none transition-filter duration-150"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Indicador visual de arraste no modo edição */}
        {isEditMode && isDragging && (
          <div className="absolute inset-0 bg-black/20 pointer-events-none flex items-center justify-center z-15">
            <span className="bg-black/85 text-[#D4FF3A] font-mono-code text-[10px] px-2 py-1 rounded-md border border-[#D4FF3A]/40 shadow-lg flex items-center gap-1">
              <Move className="w-3 h-3" /> X: {profile.posX}% · Y: {profile.posY}%
            </span>
          </div>
        )}

        {/* =========================================================================
            CAMADA OBRIGATÓRIA PRESERVADA: Gradiente & Textos Sobrepostos
            Mantendo 100% intacta a tipografia, classes, estilo e hierarquia originais
            ========================================================================= */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

        <div className="mt-auto relative z-10 p-3.5 sm:p-4 lg:p-4.5 flex flex-col items-start text-left w-full pointer-events-auto">
          {renderTextLayer ? (
            renderTextLayer
          ) : (
            <>
              {isEditMode ? (
                <div className="space-y-1 w-full bg-black/60 p-2 rounded-lg border border-white/20 mb-1">
                  <input
                    type="text"
                    value={cleanName}
                    readOnly
                    className="font-disp font-extrabold text-sm text-white bg-black/50 border border-white/30 rounded px-1.5 py-0.5 w-full cursor-not-allowed"
                    placeholder="Nome..."
                  />
                  <input
                    type="text"
                    value={cleanRole}
                    readOnly
                    className="font-serif-it text-xs text-[#AFC0FF] bg-black/50 border border-white/30 rounded px-1.5 py-0.5 w-full cursor-not-allowed"
                    placeholder="Cargo..."
                  />
                </div>
              ) : (
                <>
                  <h3 className="font-disp font-extrabold text-lg sm:text-xl lg:text-[22px] xl:text-[24px] text-white tracking-tight leading-tight">
                    {cleanName}
                  </h3>
                  <p className="font-serif-it text-xs sm:text-sm lg:text-[14px] xl:text-[15px] text-[#AFC0FF] italic leading-snug mt-0.5">
                    {cleanRole}
                  </p>
                </>
              )}
              <span className="font-mono-code text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-wider text-[#D4FF3A] font-semibold block leading-normal mt-1.5 select-none">
                {cleanBadge}
              </span>
            </>
          )}
        </div>
      </div>

      {/* =========================================================================
          PAINEL FLUTUANTE DE EDIÇÃO INTERATIVA DA FOTO (EM TEMPO REAL)
          ========================================================================= */}
      {isEditMode && isEditorOpen && (
        <div className="mt-3 w-full max-w-[310px] bg-black/95 backdrop-blur-xl border border-[#D4FF3A]/40 rounded-xl p-3 shadow-2xl z-30 font-mono-code text-white animate-in fade-in zoom-in-95 duration-200">
          {/* Cabeçalho do Painel */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
            <div className="flex items-center gap-1.5 text-[#D4FF3A] font-bold text-[11px] uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Ajustes da Foto
            </div>
            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="text-white/60 hover:text-white transition-colors cursor-pointer p-0.5"
              aria-label="Fechar painel de ajustes"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Abas de Navegação */}
          <div className="grid grid-cols-3 gap-1 p-0.5 bg-white/5 rounded-lg mb-2.5 text-[9px] font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('frame')}
              className={`py-1 rounded cursor-pointer transition-all ${
                activeTab === 'frame'
                  ? 'bg-[#D4FF3A] text-[#0F1222]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Enquadrar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('filters')}
              className={`py-1 rounded cursor-pointer transition-all ${
                activeTab === 'filters'
                  ? 'bg-[#D4FF3A] text-[#0F1222]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Filtros
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`py-1 rounded cursor-pointer transition-all ${
                activeTab === 'upload'
                  ? 'bg-[#D4FF3A] text-[#0F1222]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Carregar
            </button>
          </div>

          {/* CONTEÚDO DA ABA 1: ENQUADRAMENTO (ZOOM & POSIÇÃO X/Y) */}
          {activeTab === 'frame' && (
            <div className="space-y-3">
              {/* Zoom (Escala) */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-[#D4FF3A] flex items-center gap-1">
                    <ZoomIn className="w-3 h-3" /> Zoom (Escala):
                  </span>
                  <span className="text-white font-bold">{profile.zoom.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={profile.zoom}
                  onChange={(e) => handleProfileChange({ zoom: parseFloat(e.target.value) })}
                  className="w-full accent-[#D4FF3A] cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
                />
                <div className="flex items-center justify-between gap-1 mt-1 text-[8px] text-white/60">
                  <button
                    type="button"
                    onClick={() => handleProfileChange({ zoom: 1 })}
                    className="hover:text-[#D4FF3A] cursor-pointer"
                  >
                    1.0x
                  </button>
                  <button
                    type="button"
                    onClick={() => handleProfileChange({ zoom: 1.25 })}
                    className="hover:text-[#D4FF3A] cursor-pointer"
                  >
                    1.25x
                  </button>
                  <button
                    type="button"
                    onClick={() => handleProfileChange({ zoom: 1.45 })}
                    className="hover:text-[#D4FF3A] cursor-pointer"
                  >
                    1.45x
                  </button>
                  <button
                    type="button"
                    onClick={() => handleProfileChange({ zoom: 2 })}
                    className="hover:text-[#D4FF3A] cursor-pointer"
                  >
                    2.0x
                  </button>
                </div>
              </div>

              {/* Posição Horizontal (X) */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-white/80">Alinhar Horizontal (X):</span>
                  <span className="text-white font-bold">{profile.posX}%</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  value={profile.posX}
                  onChange={(e) => handleProfileChange({ posX: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#D4FF3A] cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
                />
              </div>

              {/* Posição Vertical (Y) */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-white/80">Alinhar Vertical (Y):</span>
                  <span className="text-white font-bold">{profile.posY}%</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  value={profile.posY}
                  onChange={(e) => handleProfileChange({ posY: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#D4FF3A] cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[8px] text-white/50 italic">
                  Arraste diretamente sobre a foto.
                </span>
                <button
                  type="button"
                  onClick={handleResetFraming}
                  className="flex items-center gap-1 text-[9px] text-white/70 hover:text-[#D4FF3A] cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Centralizar
                </button>
              </div>
            </div>
          )}

          {/* CONTEÚDO DA ABA 2: FILTROS ESTÉTICOS (P&B, SÉPIA, BRILHO, SATURAÇÃO) */}
          {activeTab === 'filters' && (
            <div className="space-y-3">
              {/* Presets de Filtros */}
              <div>
                <label className="text-[10px] text-[#D4FF3A] block mb-1.5 font-bold">
                  Estilo / Preset:
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(
                    [
                      { id: 'none', label: 'Original' },
                      { id: 'bw', label: 'P&B Editorial' },
                      { id: 'sepia', label: 'Sépia' },
                      { id: 'vintage', label: 'Vintage' },
                      { id: 'contrast', label: 'Contraste' },
                    ] as const
                  ).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleProfileChange({ filter_preset: preset.id })}
                      className={`px-1.5 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                        profile.filter_preset === preset.id
                          ? 'bg-[#D4FF3A] text-[#0F1222]'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brilho */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-white/80">Brilho:</span>
                  <span className="text-white font-bold">{profile.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="2"
                  value={profile.brightness}
                  onChange={(e) => handleProfileChange({ brightness: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#D4FF3A] cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
                />
              </div>

              {/* Saturação */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-white/80">Saturação:</span>
                  <span className="text-white font-bold">{profile.saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={profile.saturation}
                  onChange={(e) => handleProfileChange({ saturation: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#D4FF3A] cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
                />
              </div>

              <div className="flex items-center justify-end pt-1">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[9px] text-white/70 hover:text-[#D4FF3A] cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Restaurar Cores
                </button>
              </div>
            </div>
          )}

          {/* CONTEÚDO DA ABA 3: UPLOAD NOVO (FIREBASE STORAGE COM TIMEOUT & TRY/CATCH ROBUSTO) */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[#D4FF3A] block mb-1 font-bold flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Upload de Nova Foto:
                </label>
                <p className="text-[8px] text-white/70 mb-2 leading-tight">
                  Envie uma nova imagem. As alterações só serão salvas no Firebase quando você clicar em "Salvar Alterações".
                </p>

                <label
                  className={`flex flex-col items-center justify-center p-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    isUploading
                      ? 'border-[#D4FF3A] bg-[#D4FF3A]/10 opacity-75'
                      : 'border-white/30 hover:border-[#D4FF3A] bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-1.5 text-center py-1">
                      <Loader2 className="w-5 h-5 text-[#D4FF3A] animate-spin" />
                      <span className="text-[9px] text-[#D4FF3A] font-bold">
                        Enviando para Firebase Storage...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-center py-1">
                      <Upload className="w-4 h-4 text-[#D4FF3A]" />
                      <span className="text-[9px] text-white font-bold">
                        Clique para selecionar arquivo
                      </span>
                      <span className="text-[8px] text-white/50">PNG, JPG, WEBP até 10MB</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {uploadError && (
                  <div className="mt-2 text-[8px] text-red-400 bg-red-950/40 border border-red-500/30 p-2 rounded-lg flex items-start gap-1.5">
                    <AlertCircle className="w-3 h-3 shrink-0 text-red-400 mt-0.5" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {uploadSuccessMessage && (
                  <div className="mt-2 text-[8px] text-[#D4FF3A] bg-[#D4FF3A]/10 border border-[#D4FF3A]/30 p-2 rounded-lg flex items-start gap-1.5">
                    <Check className="w-3 h-3 shrink-0 text-[#D4FF3A] mt-0.5" />
                    <span>{uploadSuccessMessage}</span>
                  </div>
                )}

                {uploadSource && !uploadError && !uploadSuccessMessage && (
                  <div className="mt-2 text-[8px] text-white/60 flex items-center gap-1">
                    <Check className="w-2.5 h-2.5 text-[#D4FF3A]" />
                    {uploadSource === 'storage'
                      ? 'Imagem hospedada no Firebase Storage'
                      : 'Imagem em armazenamento seguro'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rodapé com botão explícito OBRIGATÓRIO de "Salvar Alterações" */}
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
            <span className="text-[8px] text-white/50">
              {hasUnsavedChanges ? 'Alterações pendentes' : 'Tudo salvo'}
            </span>
            <button
              type="button"
              onClick={handleManualSave}
              disabled={saveStatus === 'saving'}
              className="px-3 py-1.5 bg-[#2340FF] hover:bg-[#1a32cc] text-white text-[9px] font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-[#D4FF3A]" />
                  <span>Salvando...</span>
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check className="w-3 h-3 text-[#D4FF3A]" />
                  <span>Salvo!</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3 h-3 text-[#D4FF3A]" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoBox;
