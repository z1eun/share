import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, KeyRound } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  verifyPassword: (pwd: string) => Promise<boolean>;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  verifyPassword
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const valid = await verifyPassword(password);
      if (valid) {
        setPassword('');
        setError('');
        onSuccess();
      } else {
        setError('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
      }
    } catch {
      setError('인증 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setPassword('1234');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl relative border-2 border-[#F6D3DE]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-[#59465F]/60 hover:text-[#493342] hover:bg-[#F6D3DE]/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF3F6] border border-[#F6D3DE] flex items-center justify-center mb-2.5 text-[#493342]">
            <KeyRound className="w-6 h-6 text-pink-500" />
          </div>
          <h2 className="text-xl font-bold text-[#493342]">교사용 관리자 인증</h2>
          <p className="text-xs text-[#59465F] mt-1">
            놀이앱 등록 및 관리를 위해 비밀번호를 입력해주세요.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#493342] mb-1.5">
              관리자 비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
                placeholder="비밀번호 입력..."
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#F6D3DE] bg-[#FFFBFD] text-sm text-[#493342] focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#59465F]/60 hover:text-[#493342]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium">
                {error}
              </p>
            )}
          </div>

          {/* Quick Tip / 1234 preset filler */}
          <div className="p-2.5 rounded-xl bg-[#FFF6F9] border border-[#F6D3DE]/60 text-[11px] text-[#59465F] flex items-center justify-between">
            <span>초기 설정 비밀번호: <strong className="text-[#493342]">1234</strong></span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-pink-600 font-semibold hover:underline cursor-pointer"
            >
              자동 입력
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#59465F] hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-[#493342] hover:bg-[#382633] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
            >
              {isLoading ? '확인 중...' : '인증 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
