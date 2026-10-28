import React, { useRef } from 'react';
import { PlusCircle, Key, RotateCcw, Download, Upload, LogOut, ShieldCheck, Tag } from 'lucide-react';
import { PlayApp } from '../types.ts';

interface AdminBarProps {
  onAddNew: () => void;
  onManageCategories: () => void;
  onChangePassword: () => void;
  onResetDefault: () => void;
  onExit: () => void;
  apps: PlayApp[];
  onImportApps: (imported: PlayApp[]) => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  onAddNew,
  onManageCategories,
  onChangePassword,
  onResetDefault,
  onExit,
  apps,
  onImportApps
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(apps, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vibe_play_apps_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportApps(parsed);
        } else {
          alert('올바른 JSON 데이터 형식이 아닙니다.');
        }
      } catch {
        alert('JSON 파일을 읽는데 실패했습니다.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full bg-[#493342] text-white py-2.5 px-4 sticky top-0 z-40 shadow-md">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Mode Status */}
        <div className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>관리자 모드 활성화</span>
          <span className="opacity-60 hidden md:inline">|</span>
          <span className="opacity-80 hidden md:inline font-normal">카드 수정·삭제 및 순서 이동이 가능합니다</span>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add New App */}
          <button
            onClick={onAddNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>새 놀이앱 등록</span>
          </button>

          {/* Manage Categories */}
          <button
            onClick={onManageCategories}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
            title="놀이 분류(카테고리) 추가/수정/삭제"
          >
            <Tag className="w-3.5 h-3.5 text-pink-300" />
            <span>분류 관리</span>
          </button>

          {/* Change Password */}
          <button
            onClick={onChangePassword}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="관리자 비밀번호 변경"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">비번 변경</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="현재 등록된 앱 목록 JSON 백업"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">백업</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="JSON 파일에서 앱 목록 가져오기"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">가져오기</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />

          {/* Reset Default */}
          <button
            onClick={onResetDefault}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-rose-200 hover:text-white transition-colors cursor-pointer"
            title="기본 6개 예제 앱으로 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">초기화</span>
          </button>

          {/* Exit Admin */}
          <button
            onClick={onExit}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>종료</span>
          </button>
        </div>
      </div>
    </div>
  );
};
