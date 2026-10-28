import React, { useState } from 'react';
import { PlayApp } from '../types.ts';
import { ExternalLink, Edit2, Trash2, ArrowUp, ArrowDown, QrCode, Copy, Check } from 'lucide-react';

interface AppCardProps {
  app: PlayApp;
  isAdmin: boolean;
  onEdit: (app: PlayApp) => void;
  onDelete: (app: PlayApp) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  onOpenQr: (app: PlayApp) => void;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  isAdmin,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  onOpenQr
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(app.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isImageUrl = (val: string) => {
    return val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:image/');
  };

  return (
    <div
      className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-[22px] bg-white transition-all duration-200 cursor-pointer select-none"
      style={{
        border: '1.5px solid #F6D3DE',
        boxShadow: '0 4px 16px -2px rgba(89, 70, 95, 0.06)'
      }}
      onClick={() => {
        window.open(app.url, '_blank', 'noopener,noreferrer');
      }}
    >
      {/* Hover elevation effect applied via Tailwind inline style helper */}
      <style>{`
        .group:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgba(89, 70, 95, 0.12), 0 6px 12px -2px rgba(89, 70, 95, 0.08);
          border-color: #F0B8C8;
        }
      `}</style>

      {/* Admin Quick Action Floating Bar */}
      {isAdmin && (
        <div
          className="absolute -top-3.5 right-4 z-20 flex items-center gap-1 bg-[#493342] text-white px-2 py-1 rounded-xl shadow-md text-xs font-semibold"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Order Reorder buttons */}
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            title="위로 이동"
            className="p-1 hover:text-pink-300 disabled:opacity-30 disabled:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            title="아래로 이동"
            className="p-1 hover:text-pink-300 disabled:opacity-30 disabled:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-3 bg-white/20 mx-0.5" />

          {/* Edit */}
          <button
            onClick={() => onEdit(app)}
            title="앱 정보 수정"
            className="p-1 hover:text-pink-300 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(app)}
            title="앱 삭제"
            className="p-1 hover:text-rose-300 transition-colors cursor-pointer text-rose-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Meta info row: Category and Utility buttons */}
      <div className="flex items-center justify-between mb-3 text-xs text-[#59465F]/80">
        <span className="font-semibold text-[11px] tracking-wide text-[#59465F]/90">
          {app.category || '놀이'}
        </span>

        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQr(app);
            }}
            title="태블릿용 QR코드"
            className="p-1 rounded-lg hover:bg-[#F6D3DE]/40 text-[#59465F] transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopyLink}
            title="링크 복사"
            className="p-1 rounded-lg hover:bg-[#F6D3DE]/40 text-[#59465F] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Center Hero Icon */}
      <div className="flex flex-col items-center text-center my-2">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#FFF6F9] border border-[#F6D3DE]/60 flex items-center justify-center mb-3 shadow-inner group-hover:scale-105 transition-transform duration-200">
          {isImageUrl(app.icon) ? (
            <img
              src={app.icon}
              alt={app.title}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-18 sm:h-18 object-contain rounded-2xl"
              onError={(e) => {
                // Fallback to cute star emoji if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <span className="text-4xl sm:text-5xl leading-none select-none">
              {app.icon || '🎈'}
            </span>
          )}
        </div>

        {/* App Title */}
        <h3 className="text-lg sm:text-xl font-bold text-[#493342] tracking-tight group-hover:text-[#301c2a] transition-colors line-clamp-1">
          {app.title}
        </h3>

        {/* Optional short description */}
        {app.description ? (
          <p className="mt-1 text-xs text-[#59465F] line-clamp-2 font-normal leading-relaxed opacity-90 px-1">
            {app.description}
          </p>
        ) : (
          <p className="mt-1 text-xs text-[#59465F]/50 font-normal">
            클릭하여 바로 시작
          </p>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-4 pt-3 border-t border-[#F6D3DE]/40 flex items-center justify-between text-xs text-[#59465F]">
        <span className="text-[11px] text-[#59465F]/60 truncate max-w-[170px]" title={app.url}>
          {new URL(app.url.startsWith('http') ? app.url : `https://${app.url}`).hostname}
        </span>

        <span className="inline-flex items-center gap-1 font-semibold text-[#493342] group-hover:translate-x-0.5 transition-transform">
          놀이 열기
          <ExternalLink className="w-3 h-3 text-[#59465F]" />
        </span>
      </div>
    </div>
  );
};
