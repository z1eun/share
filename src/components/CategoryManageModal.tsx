import React, { useState } from 'react';
import { X, Tag, Plus, Edit2, Trash2, Check, RotateCcw, AlertCircle } from 'lucide-react';
import { PlayApp } from '../types.ts';

interface CategoryManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  apps: PlayApp[];
  onAddCategory: (name: string) => Promise<void>;
  onUpdateCategory: (oldName: string, newName: string) => Promise<void>;
  onDeleteCategory: (name: string) => Promise<void>;
  onResetCategories: () => Promise<void>;
}

export const CategoryManageModal: React.FC<CategoryManageModalProps> = ({
  isOpen,
  onClose,
  categories,
  apps,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onResetCategories
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const getAppCount = (catName: string) => {
    return apps.filter((a) => a.category === catName).length;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = newCatName.trim();
    if (!trimmed) {
      setError('추가할 분류 이름을 입력해주세요.');
      return;
    }
    if (categories.includes(trimmed)) {
      setError('이미 존재하는 분류 이름입니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddCategory(trimmed);
      setNewCatName('');
    } catch {
      setError('분류 추가 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (index: number, currentName: string) => {
    setEditingIndex(index);
    setEditName(currentName);
    setError('');
  };

  const handleSaveEdit = async (oldName: string) => {
    setError('');
    const trimmed = editName.trim();
    if (!trimmed) {
      setError('분류 이름을 입력해주세요.');
      return;
    }
    if (trimmed !== oldName && categories.includes(trimmed)) {
      setError('이미 동일한 이름의 분류가 존재합니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdateCategory(oldName, trimmed);
      setEditingIndex(null);
      setEditName('');
    } catch {
      setError('분류 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (catName: string) => {
    if (categories.length <= 1) {
      alert('최소 1개 이상의 분류는 유지되어야 합니다.');
      return;
    }

    const count = getAppCount(catName);
    const confirmMsg =
      count > 0
        ? `'${catName}' 분류를 삭제하시겠습니까?\n현재 이 분류를 사용하는 놀이앱 ${count}개는 '기타' 분류로 자동 이동됩니다.`
        : `'${catName}' 분류를 삭제하시겠습니까?`;

    if (window.confirm(confirmMsg)) {
      setIsSubmitting(true);
      try {
        await onDeleteCategory(catName);
      } catch {
        setError('분류 삭제 중 오류가 발생했습니다.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = async () => {
    if (
      window.confirm(
        '분류 목록을 초기 기본값(생활습관·정리, 활동·게임, 신체·놀이, 사회성·친구, 음악·표현, 기타)으로 되돌리시겠습니까?'
      )
    ) {
      setIsSubmitting(true);
      try {
        await onResetCategories();
      } catch {
        setError('초기화 중 오류가 발생했습니다.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl relative border-2 border-[#F6D3DE] my-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-[#59465F]/60 hover:text-[#493342] hover:bg-[#F6D3DE]/30 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF3F6] border border-[#F6D3DE] flex items-center justify-center text-pink-500 shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#493342]">
              놀이 분류(카테고리) 관리
            </h2>
            <p className="text-xs text-[#59465F]">
              교실 활동에 맞게 분류 이름을 수정하거나 새로 추가/삭제할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Add New Category Form */}
        <form onSubmit={handleAdd} className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => {
                setNewCatName(e.target.value);
                if (error) setError('');
              }}
              placeholder="새 분류 이름 입력 (예: 만들기·미술, 수학·두뇌)"
              className="w-full px-3.5 py-2 rounded-xl border border-[#F6D3DE] bg-[#FFFBFD] text-xs sm:text-sm text-[#493342] focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !newCatName.trim()}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#493342] hover:bg-[#382633] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-40 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>추가</span>
          </button>
        </form>

        {error && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Category List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[160px] max-h-[300px]">
          {categories.map((cat, idx) => {
            const isEditing = editingIndex === idx;
            const count = getAppCount(cat);

            return (
              <div
                key={cat + idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFBFD] border border-[#F6D3DE]/70 hover:border-[#F6D3DE] transition-all"
              >
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1 mr-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-pink-400 text-xs font-semibold text-[#493342] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(cat)}
                      disabled={isSubmitting}
                      className="p-1.5 rounded-lg bg-pink-500 text-white hover:bg-pink-600 cursor-pointer"
                      title="저장"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      className="p-1.5 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
                      title="취소"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="w-2 h-2 rounded-full bg-pink-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-[#493342] truncate">
                      {cat}
                    </span>
                    <span className="text-[11px] text-[#59465F]/70 font-normal shrink-0">
                      ({count}개 앱)
                    </span>
                  </div>
                )}

                {!isEditing && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(idx, cat)}
                      title="이름 수정"
                      className="p-1.5 rounded-lg text-[#59465F]/70 hover:text-[#493342] hover:bg-[#F6D3DE]/40 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat)}
                      title="분류 삭제"
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="mt-4 pt-3 border-t border-[#F6D3DE]/50 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-[#59465F]/70 hover:text-[#493342] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>기본 분류로 초기화</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#493342] hover:bg-[#382633] text-white font-semibold transition-all cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
