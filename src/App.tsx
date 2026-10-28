/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { PlayApp } from './types.ts';
import { storageService } from './services/storage.ts';
import { Header } from './components/Header.tsx';
import { AppCard } from './components/AppCard.tsx';
import { AdminBar } from './components/AdminBar.tsx';
import { AdminAuthModal } from './components/AdminAuthModal.tsx';
import { AppEditModal } from './components/AppEditModal.tsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.tsx';
import { QrModal } from './components/QrModal.tsx';
import { PasswordChangeModal } from './components/PasswordChangeModal.tsx';
import { CategoryManageModal } from './components/CategoryManageModal.tsx';
import { PlusCircle, RotateCcw, Sparkles } from 'lucide-react';

export default function App() {
  const [apps, setApps] = useState<PlayApp[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<PlayApp | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingApp, setDeletingApp] = useState<PlayApp | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrApp, setQrApp] = useState<PlayApp | null>(null);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  // Initial Load
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [loadedApps, loadedCats] = await Promise.all([
          storageService.getApps(),
          storageService.getCategories()
        ]);
        setApps(loadedApps);
        setCategories(loadedCats);
        setIsAdmin(storageService.isAdminLoggedIn());
      } catch (err) {
        console.error('Failed to load apps or categories', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered Apps
  const filteredApps = useMemo(() => {
    return apps
      .filter((item) => {
        const matchesCategory =
          selectedCategory === '전체' || item.category === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.category &&
            item.category.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [apps, selectedCategory, searchQuery]);

  // Admin Actions
  const handleAdminAuthSuccess = () => {
    setIsAdmin(true);
    setIsAuthModalOpen(false);
    showToast('교사용 관리자 모드가 활성화되었습니다.');
  };

  const handleExitAdmin = () => {
    storageService.logoutAdmin();
    setIsAdmin(false);
    showToast('관리자 모드를 종료했습니다.');
  };

  const handleOpenAddModal = () => {
    setEditingApp(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (app: PlayApp) => {
    setEditingApp(app);
    setIsEditModalOpen(true);
  };

  const handleSaveApp = async (appData: Partial<PlayApp>) => {
    try {
      if (editingApp) {
        // Update existing
        const updated = await storageService.updateApp(editingApp.id, appData);
        setApps((prev) =>
          prev.map((item) => (item.id === editingApp.id ? updated : item))
        );
        showToast(`'${updated.title}' 놀이앱이 수정되었습니다.`);
      } else {
        // Add new
        const created = await storageService.addApp({
          title: appData.title || '',
          url: appData.url || '',
          icon: appData.icon || '🎈',
          category: appData.category || '기타',
          description: appData.description || '',
          isCustomImage: appData.isCustomImage
        });
        setApps((prev) => [...prev, created]);
        showToast(`'${created.title}' 놀이앱이 새로 등록되었습니다.`);
      }
      setIsEditModalOpen(false);
      setEditingApp(null);
    } catch (err) {
      console.error(err);
      alert('놀이앱 저장 중 오류가 발생했습니다.');
    }
  };

  const handleOpenDeleteModal = (app: PlayApp) => {
    setDeletingApp(app);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingApp) return;
    try {
      await storageService.deleteApp(deletingApp.id);
      setApps((prev) => prev.filter((item) => item.id !== deletingApp.id));
      showToast(`'${deletingApp.title}' 카드가 삭제되었습니다.`);
      setIsDeleteModalOpen(false);
      setDeletingApp(null);
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // Reordering: Move up or down
  const handleMove = async (appId: string, direction: 'up' | 'down') => {
    const currentIndex = apps.findIndex((a) => a.id === appId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= apps.length) return;

    const newApps = [...apps];
    const [moved] = newApps.splice(currentIndex, 1);
    newApps.splice(targetIndex, 0, moved);

    const reordered = await storageService.reorderApps(newApps);
    setApps(reordered);
  };

  // Reset to default
  const handleResetDefault = async () => {
    if (
      window.confirm(
        '기본 9개 놀이앱 목록으로 초기화하시겠습니까? 현재 추가/수정된 내역은 기본값으로 대체됩니다.'
      )
    ) {
      const defaults = await storageService.resetToDefault();
      setApps(defaults);
      showToast('초기 기본 놀이앱 목록으로 복원되었습니다.');
    }
  };

  // Import JSON
  const handleImportApps = async (imported: PlayApp[]) => {
    try {
      const reordered = await storageService.reorderApps(imported);
      setApps(reordered);
      showToast(`${reordered.length}개의 놀이앱 데이터를 성공적으로 불러왔습니다.`);
    } catch {
      alert('데이터 가져오기에 실패했습니다.');
    }
  };

  // Category Handlers
  const handleAddCategory = async (name: string) => {
    const updated = await storageService.addCategory(name);
    setCategories(updated);
    showToast(`새 분류 '${name}'이(가) 추가되었습니다.`);
  };

  const handleUpdateCategory = async (oldName: string, newName: string) => {
    const updated = await storageService.updateCategory(oldName, newName);
    setCategories(updated);
    const refreshedApps = await storageService.getApps();
    setApps(refreshedApps);
    if (selectedCategory === oldName) {
      setSelectedCategory(newName);
    }
    showToast(`'${oldName}' 분류가 '${newName}'(으)로 변경되었습니다.`);
  };

  const handleDeleteCategory = async (name: string) => {
    const result = await storageService.deleteCategory(name);
    setCategories(result.categories);
    const refreshedApps = await storageService.getApps();
    setApps(refreshedApps);
    if (selectedCategory === name) {
      setSelectedCategory('전체');
    }
    showToast(`'${name}' 분류가 삭제되었습니다.`);
  };

  const handleResetCategories = async () => {
    const reset = await storageService.resetCategories();
    setCategories(reset);
    const refreshedApps = await storageService.getApps();
    setApps(refreshedApps);
    setSelectedCategory('전체');
    showToast('분류 목록이 기본값으로 초기화되었습니다.');
  };

  // Fullscreen classroom toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  return (
    <div className="min-h-screen bg-[#E5DDDE] flex flex-col justify-between selection:bg-[#F6D3DE] selection:text-[#493342]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#493342] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 border border-pink-300/20">
          <Sparkles className="w-4 h-4 text-pink-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Toolbar (When Admin Mode Active) */}
      {isAdmin && (
        <AdminBar
          onAddNew={handleOpenAddModal}
          onManageCategories={() => setIsCategoryModalOpen(true)}
          onChangePassword={() => setIsPasswordChangeModalOpen(true)}
          onResetDefault={handleResetDefault}
          onExit={handleExitAdmin}
          apps={apps}
          onImportApps={handleImportApps}
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          isAdmin={isAdmin}
          onOpenAdminAuth={() => setIsAuthModalOpen(true)}
          onExitAdmin={handleExitAdmin}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          totalAppsCount={apps.length}
        />

        {/* 3-Column Responsive Grid Area */}
        <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 my-4 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-12 h-12 rounded-full border-3 border-[#F6D3DE] border-t-[#493342] animate-spin mb-4" />
              <p className="text-sm font-semibold text-[#493342]">
                놀이앱 목록을 불러오는 중입니다...
              </p>
            </div>
          ) : filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredApps.map((app, index) => (
                <AppCard
                  key={app.id}
                  app={app}
                  isAdmin={isAdmin}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                  onMoveUp={() => handleMove(app.id, 'up')}
                  onMoveDown={() => handleMove(app.id, 'down')}
                  isFirst={index === 0}
                  isLast={index === filteredApps.length - 1}
                  onOpenQr={(selected) => {
                    setQrApp(selected);
                    setIsQrModalOpen(true);
                  }}
                />
              ))}

              {/* Admin Mode "Add App" Placeholder Card */}
              {isAdmin && (
                <button
                  onClick={handleOpenAddModal}
                  className="flex flex-col items-center justify-center p-8 rounded-[22px] border-2 border-dashed border-[#F6D3DE] bg-white/40 hover:bg-white hover:border-[#493342]/40 transition-all duration-200 group min-h-[220px] text-center cursor-pointer active:scale-98"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF3F6] border border-[#F6D3DE] flex items-center justify-center text-pink-500 mb-3 group-hover:scale-110 transition-transform">
                    <PlusCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-[#493342]">새 놀이앱 추가하기</h3>
                  <p className="text-xs text-[#59465F] mt-1">
                    클릭하여 새로운 바이브코딩 웹앱을 등록하세요
                  </p>
                </button>
              )}
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/60 rounded-3xl border border-[#F6D3DE] max-w-md mx-auto my-6">
              <span className="text-5xl mb-3">🔍</span>
              <h3 className="text-base font-bold text-[#493342] mb-1">
                검색된 놀이앱이 없습니다
              </h3>
              <p className="text-xs text-[#59465F] mb-4">
                '{searchQuery}'에 해당하는 결과가 없습니다.
                <br />
                검색어를 확인하거나 카테고리 필터를 변경해보세요.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('전체');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#493342] text-white text-xs font-semibold hover:bg-[#382633] transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>검색 및 필터 초기화</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 px-4 text-center border-t border-[#F6D3DE]/50 mt-12">
        <p className="text-xs text-[#59465F] font-medium tracking-tight">
          바이브코딩 활용 놀이앱 모음 웹 허브 · 대전성천초등학교병설유치원
        </p>
        <p className="text-[11px] text-[#59465F]/60 mt-1">
          어린이의 즐거운 배움과 안전한 교실 놀이 문화를 응원합니다. 무단 배포 및 상업적 이용을 금합니다.
        </p>
      </footer>

      {/* Modals */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
        verifyPassword={(pwd) => storageService.verifyPassword(pwd)}
      />

      <AppEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSaveApp}
        editingApp={editingApp}
        categories={categories}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingApp(null);
        }}
        onConfirm={handleConfirmDelete}
        app={deletingApp}
      />

      <QrModal
        isOpen={isQrModalOpen}
        onClose={() => {
          setIsQrModalOpen(false);
          setQrApp(null);
        }}
        app={qrApp}
      />

      <PasswordChangeModal
        isOpen={isPasswordChangeModalOpen}
        onClose={() => setIsPasswordChangeModalOpen(false)}
        onChangePassword={(oldP, newP) => storageService.changePassword(oldP, newP)}
      />

      <CategoryManageModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        apps={apps}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        onResetCategories={handleResetCategories}
      />
    </div>
  );
}
