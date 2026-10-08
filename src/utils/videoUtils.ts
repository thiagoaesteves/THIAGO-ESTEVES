/**
 * Video Utilities for parsing, detecting and formatting YouTube and Vimeo videos.
 * Ensures consistent high-quality thumbnail previews and fluid interactive players.
 */

// Helper to extract the src URL if user pastes a full HTML <iframe> embed code
export const extractIframeSrc = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  if (trimmed.includes('<iframe') && trimmed.includes('src=')) {
    const match = trimmed.match(/src=["']([^"']+)["']/i) || trimmed.match(/src=([^ >]+)/i);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return trimmed;
};

// Check if a given string represents a YouTube video (URL or raw ID)
export const isYouTubeVideo = (input: string): boolean => {
  if (!input || typeof input !== 'string') return false;
  const clean = extractIframeSrc(input).trim();
  if (
    clean.includes('youtube.com') ||
    clean.includes('youtu.be') ||
    clean.includes('youtube-nocookie.com')
  ) {
    return true;
  }
  // Standard 11-character YouTube video ID (alphanumeric with - and _)
  // Ensure it doesn't look like a standard filename or path
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean) && !clean.includes('.') && !clean.includes('/')) {
    return true;
  }
  return false;
};

// Extract the 11-character YouTube video ID from any format
export const getYouTubeVideoId = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  const clean = extractIframeSrc(input).trim();

  // 1. Comprehensive regex matching all standard YouTube URLs
  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = clean.match(regExp);
  if (match && match[1]) {
    return match[1];
  }

  // 2. Direct 11-character alphanumeric ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }

  // 3. Fallback manual search
  if (clean.includes('v=')) {
    const candidate = clean.split('v=')[1]?.split('&')[0]?.split('?')[0]?.split('#')[0];
    if (candidate && candidate.length === 11) return candidate;
  }
  if (clean.includes('youtu.be/')) {
    const candidate = clean.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0]?.split('#')[0];
    if (candidate && candidate.length === 11) return candidate;
  }
  if (clean.includes('embed/')) {
    const candidate = clean.split('embed/')[1]?.split('?')[0]?.split('&')[0]?.split('#')[0];
    if (candidate && candidate.length === 11) return candidate;
  }
  if (clean.includes('shorts/')) {
    const candidate = clean.split('shorts/')[1]?.split('?')[0]?.split('&')[0]?.split('#')[0];
    if (candidate && candidate.length === 11) return candidate;
  }

  // 4. Return sanitized string if it matches length
  const sanitized = clean.replace(/[^a-zA-Z0-9_-]/g, '');
  if (sanitized.length === 11) return sanitized;

  return clean.trim();
};

// Returns high quality official YouTube thumbnail with standard fallback
export const getYouTubeThumbnail = (videoId: string, quality: 'maxres' | 'hq' = 'maxres'): string => {
  if (!videoId) return '';
  const cleanId = getYouTubeVideoId(videoId);
  if (!cleanId) return '';
  if (quality === 'hq') {
    return `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg`;
};

// Check if a given string represents a Vimeo video
export const isVimeoVideo = (val: string): boolean => {
  if (!val || typeof val !== 'string') return false;
  const clean = extractIframeSrc(val).trim();
  return clean.startsWith('vimeo:') || clean.includes('vimeo.com') || clean.includes('player.vimeo.com');
};

// Extract Vimeo video ID
export const getVimeoVideoId = (val: string): string => {
  if (!val || typeof val !== 'string') return '';
  const clean = extractIframeSrc(val).trim();
  if (clean.startsWith('vimeo:')) return clean.replace('vimeo:', '').trim();
  const match = clean.match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+))/);
  if (match && match[1]) return match[1];
  if (/^\d+$/.test(clean.trim())) return clean.trim();
  return clean.trim();
};

// Returns Vimeo thumbnail
export const getVimeoThumbnail = (vimeoId: string): string => {
  if (!vimeoId) return '';
  const cleanId = getVimeoVideoId(vimeoId);
  return `https://vumbnail.com/${cleanId}.jpg`;
};
