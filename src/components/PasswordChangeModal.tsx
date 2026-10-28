import React, { useState } from 'react';
import { X, KeyRound, Check } from 'lucide-react';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: (oldPwd: string, newPwd: string) => Promise<{ success: boolean; message: string }>;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
  onChangePassword
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!oldPassword || !newPassword) {
      setError('모든 비밀번호 항목을 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호와 확인이 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 2) {
      setError('새 비밀번호는 2자리 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onChangePassword(oldPassword, newPassword);
      if (result.success) {
        setSuccess('비밀번호가 성공적으로 변경되었습니다!');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(result.message || '현재 비밀번호가 일치하지 않습니다.');
      }
    } catch {
      setError('변경 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative border-2 border-[#F6D3DE]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF3F6] border border-[#F6D3DE] flex items-center justify-center mb-2 text-pink-500">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#493342]">관리자 비밀번호 변경</h3>
          <p className="text-xs text-[#59465F]">
            새로운 교사용 관리자 비밀번호를 설정합니다.
          </p>
        </div>

        {success ? (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#493342]">{success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#493342] mb-1">
                현재 비밀번호
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="현재 비밀번호 (기본: 1234)"
                className="w-full px-3.5 py-2 rounded-xl border border-[#F6D3DE] bg-[#FFFBFD] text-xs text-[#493342] focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#493342] mb-1">
                새 비밀번호
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새로운 비밀번호 입력"
                className="w-full px-3.5 py-2 rounded-xl border border-[#F6D3DE] bg-[#FFFBFD] text-xs text-[#493342] focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#493342] mb-1">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새로운 비밀번호 재입력"
                className="w-full px-3.5 py-2 rounded-xl border border-[#F6D3DE] bg-[#FFFBFD] text-xs text-[#493342] focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-500 font-medium">{error}</p>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-[#59465F] hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 rounded-xl bg-[#493342] hover:bg-[#382633] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                {isLoading ? '변경 중...' : '비밀번호 저장'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
