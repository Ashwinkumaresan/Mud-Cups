import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { ActiveOrder, UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  onNewSession: () => void;
  onJoinSession: (newSessionId: string) => void;
  user: UserProfile | null;
  activeOrders: ActiveOrder[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  sessionId,
  onNewSession,
  onJoinSession,
  user,
  activeOrders
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'invite' | 'join'>('invite');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [inputJoinSession, setInputJoinSession] = useState('');
  const [joinError, setJoinError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannerStatus, setScannerStatus] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const sessionUrl = `${window.location.origin}${window.location.pathname}?session=${sessionId}`;

  // Generate QR code data URL whenever sessionId changes or modal opens
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(
      sessionUrl,
      {
        width: 280,
        margin: 2,
        color: {
          dark: '#1B4D3E',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && isMounted && url) {
          setQrDataUrl(url);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, [sessionId, sessionUrl, isOpen]);

  // Clean up media stream when component unmounts or tab changes
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleStartCamera = async () => {
    setScannerStatus('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsScanning(true);
      setScannerStatus('Camera active. Position QR Code in frame.');
    } catch (err) {
      setScannerStatus('Camera access denied or unequipped. Use manual entry or test scan below.');
      setIsScanning(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sessionUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `mudcups-session-₹{sessionId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processJoinInput = (rawVal: string) => {
    const trimmed = rawVal.trim();
    if (!trimmed) {
      setJoinError('Please enter a valid Session ID or Link');
      return;
    }

    let extractedId = trimmed;
    // Check if input is a URL containing ?session=
    if (trimmed.includes('session=')) {
      try {
        const urlObj = new URL(trimmed);
        const param = urlObj.searchParams.get('session');
        if (param) {
          extractedId = param;
        }
      } catch {
        const match = trimmed.match(/session=([A-Za-z0-9-]+)/);
        if (match && match[1]) {
          extractedId = match[1];
        }
      }
    }

    if (extractedId.length < 3) {
      setJoinError('Session ID seems too short');
      return;
    }

    stopCamera();
    onJoinSession(extractedId);
    onClose();
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processJoinInput(inputJoinSession);
  };

  const handleSimulateQRScan = () => {
    // Generate a random demo session or join a simulated shared session
    const demoId = 'SESS-JOIN-' + Math.floor(1000 + Math.random() * 9000);
    processJoinInput(demoId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded max-w-md w-full shadow-2xl relative border border-gray-100 flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header with Title & Close */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1B4D3E] text-2xl">
              group_add
            </span>
            <div>
              <h2 className="text-base font-extrabold text-gray-900 leading-tight">
                Invite & Join Session
              </h2>
              <p className="text-[11px] text-gray-500">
                Share your cart & order session across devices
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 bg-gray-50/80 p-1.5 gap-1.5">
          <button
            onClick={() => {
              stopCamera();
              setActiveTab('invite');
            }}
            className={`flex-1 py-2 rounded font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'invite'
                ? 'bg-white text-[#1B4D3E] shadow-xs border border-gray-200/80'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span className="material-symbols-outlined text-base">qr_code_2</span>
            Invite Friends
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-2 rounded font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'join'
                ? 'bg-white text-[#1B4D3E] shadow-xs border border-gray-200/80'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span className="material-symbols-outlined text-base">qr_code_scanner</span>
            Join Session
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-grow">
          {/* TAB 1: INVITE */}
          {activeTab === 'invite' && (
            <div className="space-y-6 animate-fadeIn">
              {/* QR Code display box */}
              <div className="bg-gray-50 p-6 rounded border border-[#1B4D3E]/20 flex flex-col items-center text-center relative overflow-hidden">
                <div className="bg-white p-3 rounded shadow-md border border-[#1B4D3E]/10 mb-3">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR Code for session ${sessionId}`}
                      className="w-48 h-48 object-contain rounded"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                      Generating QR Code...
                    </div>
                  )}
                </div>

                <span className="inline-block bg-[#1B4D3E] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                  Active Session QR
                </span>
                <p className="text-xs text-gray-600 font-medium">
                  Scan with mobile camera to mirror this session instantly.
                </p>
              </div>

              {/* Session ID & Link Copy fields */}
              <div className="space-y-3">
                {/* Session ID Box */}
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Session ID
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded border border-gray-200">
                    <span className="material-symbols-outlined text-[#1B4D3E] text-lg">
                      fingerprint
                    </span>
                    <span className="font-mono text-xs font-black text-gray-900 flex-grow tracking-wide">
                      {sessionId}
                    </span>
                    <button
                      onClick={handleCopyId}
                      className="bg-white hover:bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs font-bold border border-gray-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {copiedId ? 'check' : 'content_copy'}
                      </span>
                      <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
                    </button>
                  </div>
                </div>

                {/* Direct Link Box */}
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Shareable Link
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded border border-gray-200">
                    <span className="material-symbols-outlined text-gray-400 text-lg">
                      link
                    </span>
                    <input
                      type="text"
                      readOnly
                      value={sessionUrl}
                      className="bg-transparent text-xs text-gray-600 flex-grow outline-none truncate font-mono"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="bg-[#1B4D3E] hover:bg-[#123329] text-white px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {copiedLink ? 'check' : 'share'}
                      </span>
                      <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Download QR & New Session */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleDownloadQR}
                  className="bg-gray-900 hover:bg-black text-white py-2.5 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  Download QR
                </button>

                <button
                  onClick={onNewSession}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">autorenew</span>
                  New Session ID
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: JOIN */}
          {activeTab === 'join' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Option 1: QR Scanner */}
              <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#1B4D3E] text-lg">
                      photo_camera
                    </span>
                    Camera / QR Scanner
                  </h3>
                  {isScanning && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      Scanning
                    </span>
                  )}
                </div>

                <div className="relative bg-black rounded overflow-hidden aspect-video flex items-center justify-center border border-gray-800">
                  {isScanning ? (
                    <>
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        playsInline
                      />
                      <div className="absolute inset-0 border-2 border-dashed border-[#1B4D3E]/70 rounded m-6 pointer-events-none animate-pulse flex items-center justify-center">
                        <span className="text-[10px] text-white bg-black/60 px-2 py-1 rounded">
                          Center QR Code
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center space-y-2">
                      <span className="material-symbols-outlined text-4xl text-gray-500">
                        qr_code_scanner
                      </span>
                      <p className="text-xs text-gray-400">
                        Use your webcam or mobile camera to scan a session QR code
                      </p>
                    </div>
                  )}
                </div>

                {scannerStatus && (
                  <p className="text-[11px] text-gray-600 bg-white p-2 rounded border border-gray-200 text-center">
                    {scannerStatus}
                  </p>
                )}

                <div className="flex gap-2">
                  {!isScanning ? (
                    <button
                      onClick={handleStartCamera}
                      className="flex-1 bg-[#1B4D3E] hover:bg-[#123329] text-white py-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">videocam</span>
                      Start Camera Scanner
                    </button>
                  ) : (
                    <button
                      onClick={stopCamera}
                      className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">videocam_off</span>
                      Stop Camera
                    </button>
                  )}

                  <button
                    onClick={handleSimulateQRScan}
                    className="bg-white hover:bg-gray-100 text-gray-800 px-3 py-2 rounded text-xs font-bold border border-gray-200 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                    title="Simulate scanning a demo session"
                  >
                    <span className="material-symbols-outlined text-base text-[#1B4D3E]">
                      bolt
                    </span>
                    Test Scan
                  </button>
                </div>
              </div>

              {/* Option 2: Manual Session Entry */}
              <form onSubmit={handleJoinSubmit} className="space-y-3">
                <label className="text-xs font-bold text-gray-800 block">
                  Or Manually Enter Session ID or Link
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputJoinSession}
                    onChange={(e) => {
                      setInputJoinSession(e.target.value);
                      setJoinError('');
                    }}
                    placeholder="e.g. SESS-A7F2-9K1L or paste full link"
                    className="w-full text-xs border border-gray-300 rounded p-3 pr-20 focus:outline-none focus:border-[#1B4D3E] font-mono bg-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#1B4D3E] hover:bg-[#123329] text-white px-3 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Join</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>

                {joinError && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {joinError}
                  </p>
                )}
              </form>
            </div>
          )}

          {/* Active Orders info under current session */}
          {activeOrders.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                Active Orders in this Session
              </h4>
              <div className="space-y-2">
                {activeOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="p-3 bg-gray-50 rounded border border-gray-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-gray-900">
                        Order #{order.orderId}
                      </div>
                      <div className="text-xs text-emerald-600 font-semibold">
                        {order.status === 'placed' ? 'Kitchen Preparing' : 'Out for Delivery'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

