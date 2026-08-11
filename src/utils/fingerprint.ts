/**
 * Device Fingerprinting Utility
 * Collects hardware and software signals to generate a unique device hash.
 */

// 1. Canvas Hash
const getCanvasHash = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';

    canvas.width = 200;
    canvas.height = 50;

    // Draw text with shadow
    ctx.textBaseline = 'top';
    ctx.font = '14px "Arial"';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);

    ctx.fillStyle = '#069';
    ctx.fillText('MudCups, <canvas> 1.0', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('MudCups, <canvas> 1.0', 4, 17);

    return canvas.toDataURL();
  } catch (e) {
    return 'canvas-error';
  }
};

// 2. WebGL Hash
const getWebGLHash = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'no-webgl';

    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo ? (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : '';
    const renderer = debugInfo ? (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    
    return `${vendor}~${renderer}`;
  } catch (e) {
    return 'webgl-error';
  }
};

// 3. Audio API Hash
const getAudioHash = async (): Promise<string> => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return 'no-audio';
    
    const context = new OfflineAudioContext(1, 44100, 44100);
    const oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(10000, context.currentTime);

    const compressor = context.createDynamicsCompressor();
    ['threshold', 'knee', 'ratio', 'reduction', 'attack', 'release'].forEach((prop) => {
      if (compressor[prop as keyof DynamicsCompressorNode] !== undefined && typeof (compressor[prop as keyof DynamicsCompressorNode] as AudioParam).setValueAtTime === 'function') {
         (compressor[prop as keyof DynamicsCompressorNode] as AudioParam).setValueAtTime(
             prop === 'threshold' ? -50 : prop === 'knee' ? 40 : prop === 'ratio' ? 12 : prop === 'attack' ? 0 : 0.25, 
             context.currentTime
         );
      }
    });

    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);

    const buffer = await context.startRendering();
    let hash = 0;
    for (let i = 0; i < buffer.length; i++) {
      hash += Math.abs(buffer.getChannelData(0)[i]);
    }
    return hash.toString();
  } catch (e) {
    return 'audio-error';
  }
};

// 4. Hardware & Environment
const getHardwareEnv = () => {
  return {
    cores: navigator.hardwareConcurrency || 'unknown',
    memory: (navigator as any).deviceMemory || 'unknown',
    screenRes: `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    languages: navigator.languages ? navigator.languages.join(',') : navigator.language,
    platform: navigator.platform || 'unknown',
  };
};

// 5. Basic Fonts Detection
const getFonts = (): string => {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = ['Arial', 'Helvetica', 'Times New Roman', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'];
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 'no-font-detect';

  const testString = "mmmmmmmmmmlli";
  const defaultWidths: Record<string, number> = {};
  
  baseFonts.forEach(baseFont => {
    context.font = `72px ${baseFont}`;
    defaultWidths[baseFont] = context.measureText(testString).width;
  });

  const availableFonts: string[] = [];
  
  testFonts.forEach(testFont => {
    let detected = false;
    baseFonts.forEach(baseFont => {
      context.font = `72px "${testFont}", ${baseFont}`;
      if (context.measureText(testString).width !== defaultWidths[baseFont]) {
        detected = true;
      }
    });
    if (detected) availableFonts.push(testFont);
  });

  return availableFonts.join(',');
};

// Hash function (SHA-256)
const hashString = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const generateFrontendFingerprint = async (): Promise<{ hash: string, signals: any }> => {
  const canvasHash = getCanvasHash();
  const webGLHash = getWebGLHash();
  const audioHash = await getAudioHash();
  const hardware = getHardwareEnv();
  const fonts = getFonts();
  
  const storageEstimate = navigator.storage && navigator.storage.estimate 
    ? await navigator.storage.estimate() 
    : { quota: 'unknown' };

  const signals = {
    canvasHash,
    webGLHash,
    audioHash,
    ...hardware,
    fonts,
    storageQuota: storageEstimate.quota,
  };

  const rawString = JSON.stringify(signals);
  const hash = await hashString(rawString);

  // Store in cookie for session management
  document.cookie = `Device-Fingerprint=${hash}; path=/; max-age=${5 * 60 * 60}`; // 5 hours

  return { hash, signals };
};
