import React, { useState, useEffect } from 'react';
import { PlayApp } from '../types.ts';
import { CATEGORIES } from '../data/defaultApps.ts';
import { X, Sparkles, Image as ImageIcon, Smile, ExternalLink } from 'lucide-react';

interface AppEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appData: Partial<PlayApp>) => void;
  editingApp?: PlayApp | null;
  categories: string[];
}

const PRESET_EMOJIS = [
  // 인기 놀이 아이콘
  '🧹', '🎁', '🍗', '🖤', '🧑‍🦱', '⏰',
  '🎯', '⭐', '🎲', '🎈', '🎵', '🐸',
  '🚀', '🎨', '🌈', '🍎', '🧩', '🎪',
  '🥁', '🏆', '🥇', '🧸', '🤖', '📚',
  '🔔', '🖍️', '🏃', '🤸', '🌻', '🐶',
  // 유치원 맞춤 귀여운 이모지 (추가)
  '🐣', '🌸', '🚌', '🍭', '🦖', '🐛',
  '🍓', '🍦', '🌞', '⚽', '🪀', '🐱',
  '🐰', '🍉', '🐥', '🌟', '👑', '🥨'
];

export const AppEditModal: React.FC<AppEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingApp,
  categories
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('🎈');
  const [category, setCategory] = useState(categories[0] || '기타');
  const [description, setDescription] = useState('');
  const [iconMode, setIconMode] = useState<'emoji' | 'image'>('emoji');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});

  useEffect(() => {
    if (editingApp) {
      setTitle(editingApp.title || '');
      setUrl(editingApp.url || '');
      setCategory(editingApp.category || '생활습관·정리');
      setDescription(editingApp.description || '');

      const isImg = (editingApp.icon || '').startsWith('http');
      if (isImg) {
        setIconMode('image');
        setImageUrl(editingApp.icon);
        setIcon('');
      } else {
        setIconMode('emoji');
        setIcon(editingApp.icon || '🎈');
        setImageUrl('');
      }
    } else {
      // Defaults for new app
      setTitle('');
      setUrl('https://');
      setIcon('🎈');
      setCategory('활동·게임');
      setDescription('');
      setIconMode('emoji');
      setImageUrl('');
    }
    setErrors({});
  }, [editingApp, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { title?: string; url?: string } = {};

    if (!title.trim()) {
      newErrors.title = '놀이앱 제목을 입력해주세요.';
    } else if (title.trim().length > 30) {
      newErrors.title = '제목은 최대 30자 이내로 입력해주세요.';
    }

    if (!url.trim() || url === 'https://') {
      newErrors.url = '연결 링크(URL)를 입력해주세요.';
    } else {
      let testUrl = url.trim();
      if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
        testUrl = 'https://' + testUrl;
      }
      try {
        new URL(testUrl);
      } catch {
        newErrors.url = '올바른 웹 주소 형식이어야 합니다 (예: https://example.com)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const finalIcon = iconMode === 'image' && imageUrl.trim()
      ? imageUrl.trim()
      : (icon.trim() || '🎈');

    onSave({
      title: title.trim(),
      url: formattedUrl,
      icon: finalIcon,
      category,
      description: description.trim(),
      isCustomImage: iconMode === 'image'
    });
  };

  const activeDisplayIcon = iconMode === 'image' && imageUrl.trim() ? imageUrl.trim() : (icon || '🎈');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl relative border-2 border-[#F6D3DE] my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-[#59465F]/60 hover:text-[#493342] hover:bg-[#F6D3DE]/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-xl bg-[#FFF3F6] border border-[#F6D3DE] flex items-center justify-center text-pink-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#493342]">
              {editingApp ? '놀이앱 정보 수정' : '새 놀이앱 등록'}
            </h2>
            <p className="text-xs text-[#59465F]">
              교실에서 바로 실행할 수 있는 웹 놀이앱 정보를 입력하세요.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#493342] mb-1">
              앱 제목 <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              placeholder="예: 정리 O,X 퀴즈, 뽑기 룰렛"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6D3DE] bg-[#FFFBFD] text-sm text-[#493342] focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-semibold text-[#493342] mb-1">
              연결 링크(URL) <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errors.url) setErrors({ ...errors, url: undefined });
              }}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6D3DE] bg-[#FFFBFD] text-sm text-[#493342] focus:outline-none focus:ring-2 focus:ring-pink-300 font-mono text-xs"
            />
            {errors.url && <p className="mt-1 text-xs text-rose-500">{errors.url}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-[#493342] mb-1">
              카테고리 분류
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6D3DE] bg-[#FFFBFD] text-sm text-[#493342] focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Icon Selector (Emoji or Image URL) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#493342]">
                대표 아이콘 선택
              </label>
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setIconMode('emoji')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
                    iconMode === 'emoji' ? 'bg-[#493342] text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Smile className="w-3 h-3" />
                  <span>이모지</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIconMode('image')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
                    iconMode === 'image' ? 'bg-[#493342] text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>이미지 URL</span>
                </button>
              </div>
            </div>

            {iconMode === 'emoji' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    maxLength={4}
                    placeholder="이모지 직접 입력"
                    className="w-20 text-center py-2 rounded-xl border border-[#F6D3DE] bg-[#FFFBFD] text-xl"
                  />
                  <span className="text-xs text-[#59465F]/80">아래 추천 이모지를 클릭해도 적용됩니다.</span>
                </div>
                {/* Preset Emoji Grid */}
                <div className="grid grid-cols-10 gap-1 p-2 rounded-xl bg-[#FFF9FB] border border-[#F6D3DE]/60 max-h-24 overflow-y-auto">
                  {PRESET_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`h-8 rounded-lg text-lg flex items-center justify-center transition-transform hover:scale-120 ${
                        icon === emoji ? 'bg-[#F6D3DE] scale-110' : 'hover:bg-white'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... (아이콘 이미지 URL)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6D3DE] bg-[#FFFBFD] text-sm text-[#493342] focus:outline-none focus:ring-2 focus:ring-pink-300 font-mono text-xs"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#493342] mb-1">
              앱 설명 (선택사항)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="수업에서 아이들과 함께 즐길 수 있는 방법을 간단히 적어보세요."
              className="w-full px-3.5 py-2 rounded-xl border border-[#F6D3DE] bg-[#FFFBFD] text-xs text-[#493342] focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
            />
          </div>

          {/* Live Preview Box */}
          <div className="p-3.5 rounded-2xl bg-[#E5DDDE]/50 border border-[#F6D3DE] flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#F6D3DE] flex items-center justify-center shadow-xs shrink-0">
              {iconMode === 'image' && imageUrl.trim() ? (
                <img src={imageUrl} alt="preview" className="w-12 h-12 object-contain rounded-xl" onError={(e) => (e.currentTarget.src = '')} />
              ) : (
                <span className="text-3xl">{icon || '🎈'}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold text-[#59465F]/80">{category}</span>
              <h4 className="text-sm font-bold text-[#493342] truncate">
                {title || '새 놀이앱 제목'}
              </h4>
              <p className="text-[11px] text-[#59465F] truncate">
                {description || '놀이앱 설명이 이곳에 표시됩니다.'}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#59465F] hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#493342] hover:bg-[#382633] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              {editingApp ? '수정 내용 저장' : '새 놀이앱 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
