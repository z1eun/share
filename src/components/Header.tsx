import React from 'react';
import { Settings, Lock, Unlock, Maximize, Minimize, Search, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/defaultApps.ts';

interface HeaderProps {
  isAdmin: boolean;
  onOpenAdminAuth: () => void;
  onExitAdmin: () => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  totalAppsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  isAdmin,
  onOpenAdminAuth,
  onExitAdmin,
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  isFullscreen,
  onToggleFullscreen
}) => {
  return (
    <header className="w-full pt-8 pb-6 px-4 flex flex-col items-center text-center">
      {/* Top utility row: Fullscreen & Admin Mode entry */}
      <div className="w-full max-w-5xl flex items-center justify-end mb-4 px-2">
        {/* Right: Fullscreen & Admin toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? "전체화면 종료" : "전자칠판 전체화면"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-[#493342] text-xs font-semibold border border-[#F6D3DE] shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-3.5 h-3.5" />
                <span className="hidden md:inline">화면 복원</span>
              </>
            ) : (
              <>
                <Maximize className="w-3.5 h-3.5" />
                <span className="hidden md:inline">칠판 전체화면</span>
              </>
            )}
          </button>

          {isAdmin ? (
            <button
              onClick={onExitAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#493342] hover:bg-[#382633] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5 text-pink-300" />
              <span>관리자 종료</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminAuth}
              title="관리자 설정"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-[#493342] text-xs font-semibold border border-[#F6D3DE] shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#59465F]" />
              <span className="hidden sm:inline">관리자 모드</span>
            </button>
          )}
        </div>
      </div>

      {/* Borderless Heart Icon */}
      <div className="mb-2 select-none">
        <span className="text-4xl sm:text-5xl leading-none inline-block transform hover:scale-110 transition-transform duration-200">
          💖
        </span>
      </div>

      {/* Main Title according to PRD */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#493342] tracking-tight mb-2 select-none">
        바이브코딩 활용 놀이앱 모음
      </h1>

      {/* Sub Caption according to PRD */}
      <p className="text-xs sm:text-sm text-[#59465F] font-medium tracking-normal mb-6 select-none opacity-90 max-w-xl">
        제작: 대전성천초등학교병설유치원 교사 / 무단배포를 금지합니다
      </p>

      {/* Search and Category Filter Deck */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-3">
        {/* Search Input Bar */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#59465F]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="놀이앱 이름 또는 주제 검색..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 border border-[#F6D3DE] text-sm text-[#493342] placeholder-[#59465F]/50 focus:outline-none focus:ring-2 focus:ring-[#F6D3DE] focus:bg-white shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#59465F]/60 hover:text-[#493342] p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-1">
          {['전체', ...categories].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#493342] text-white shadow-xs scale-102'
                    : 'bg-white/80 hover:bg-white text-[#59465F] border border-[#F6D3DE]/70 hover:border-[#F6D3DE]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
