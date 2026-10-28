import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Copy, Check, Smartphone } from 'lucide-react';
import { PlayApp } from '../types.ts';
import QRCode from 'qrcode';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: PlayApp | null;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose, app }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (app && isOpen) {
      QRCode.toDataURL(app.url, {
        width: 260,
        margin: 2,
        color: {
          dark: '#493342',
          light: '#FFFFFF'
        }
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR', err));
    }
  }, [app, isOpen]);

  if (!isOpen || !app) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(app.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative border-2 border-[#F6D3DE] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF3F6] border border-[#F6D3DE] text-[11px] font-semibold text-[#493342] mb-2">
            <Smartphone className="w-3.5 h-3.5 text-pink-500" />
            <span>태블릿 & 스마트폰 접속용 QR</span>
          </div>
          <h3 className="text-lg font-bold text-[#493342]">
            {app.title}
          </h3>
          <p className="text-xs text-[#59465F] mt-0.5">
            어린이 패드 카메라로 QR을 스캔하면 바로 열립니다.
          </p>
        </div>

        {/* QR Canvas Container */}
        <div className="my-3 p-3 bg-[#FFFBFD] rounded-2xl border border-[#F6D3DE] inline-block shadow-inner">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt={`${app.title} QR`} className="w-48 h-48 mx-auto rounded-xl" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-xs text-gray-400">
              QR 생성 중...
            </div>
          )}
        </div>

        {/* App link preview & actions */}
        <div className="mt-2 space-y-2">
          <p className="text-[11px] font-mono text-[#59465F]/80 truncate px-2" title={app.url}>
            {app.url}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2 rounded-xl border border-[#F6D3DE] bg-[#FFFBFD] hover:bg-[#FFF3F6] text-xs font-semibold text-[#493342] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사 완료' : '주소 복사'}</span>
            </button>
            <button
              onClick={() => window.open(app.url, '_blank', 'noopener,noreferrer')}
              className="flex-1 py-2 rounded-xl bg-[#493342] hover:bg-[#382633] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>바로 열기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
