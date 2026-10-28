import { PlayApp } from '../types.ts';
import { DEFAULT_PLAY_APPS } from '../data/defaultApps.ts';

const CACHE_KEY = 'vibe_play_apps_cache_v1';
const CATEGORIES_CACHE_KEY = 'vibe_categories_cache_v1';
const ADMIN_TOKEN_KEY = 'vibe_admin_token';
const LOCAL_PWD_KEY = 'vibe_admin_pwd_override';

export const storageService = {
  async getApps(): Promise<PlayApp[]> {
    try {
      const res = await fetch('/api/apps');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.apps)) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data.apps));
          return data.apps;
        }
      }
    } catch {
      // Fallback silently to cache
    }

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore parse error
      }
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify(DEFAULT_PLAY_APPS));
    return DEFAULT_PLAY_APPS;
  },

  async addApp(newApp: Omit<PlayApp, 'id' | 'order' | 'createdAt'> & Partial<PlayApp>): Promise<PlayApp> {
    try {
      const res = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.app) {
          const current = await this.getApps();
          const updated = [...current, data.app];
          localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
          return data.app;
        }
      }
    } catch {
      // local fallback
    }

    // Local fallback creation
    const current = await this.getApps();
    const maxOrder = current.reduce((max, a) => Math.max(max, a.order || 0), 0);
    const created: PlayApp = {
      id: newApp.id || `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: newApp.title.trim(),
      icon: newApp.icon || '🎈',
      url: newApp.url.trim(),
      order: maxOrder + 1,
      createdAt: new Date().toISOString(),
      category: newApp.category || '기타',
      description: newApp.description?.trim() || '',
      isCustomImage: Boolean(newApp.isCustomImage)
    };

    const updated = [...current, created];
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    return created;
  },

  async updateApp(id: string, updates: Partial<PlayApp>): Promise<PlayApp> {
    try {
      const res = await fetch(`/api/apps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.app) {
          const current = await this.getApps();
          const next = current.map(item => item.id === id ? data.app : item);
          localStorage.setItem(CACHE_KEY, JSON.stringify(next));
          return data.app;
        }
      }
    } catch {
      // local fallback
    }

    const current = await this.getApps();
    const next = current.map(item => item.id === id ? { ...item, ...updates } : item);
    localStorage.setItem(CACHE_KEY, JSON.stringify(next));
    const target = next.find(item => item.id === id);
    if (!target) throw new Error('앱을 찾을 수 없습니다.');
    return target;
  },

  async deleteApp(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/apps/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const current = await this.getApps();
          const filtered = current.filter(item => item.id !== id);
          localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
          return true;
        }
      }
    } catch {
      // local fallback
    }

    const current = await this.getApps();
    const filtered = current.filter(item => item.id !== id);
    localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
    return true;
  },

  async reorderApps(reorderedApps: PlayApp[]): Promise<PlayApp[]> {
    const updated = reorderedApps.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    try {
      const res = await fetch('/api/apps/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apps: updated })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.apps) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data.apps));
          return data.apps;
        }
      }
    } catch {
      // local fallback
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    return updated;
  },

  async resetToDefault(): Promise<PlayApp[]> {
    try {
      const res = await fetch('/api/apps/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.apps) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data.apps));
          return data.apps;
        }
      }
    } catch {
      // local fallback
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify(DEFAULT_PLAY_APPS));
    return DEFAULT_PLAY_APPS;
  },

  async verifyPassword(pwd: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token || 'authenticated');
          return true;
        }
      }
    } catch {
      // local check fallback
    }

    const localSaved = localStorage.getItem(LOCAL_PWD_KEY) || '1234';
    if (pwd === localSaved) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, 'local_auth_' + Date.now());
      return true;
    }
    return false;
  },

  isAdminLoggedIn(): boolean {
    return Boolean(sessionStorage.getItem(ADMIN_TOKEN_KEY));
  },

  logoutAdmin(): void {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  async changePassword(oldPwd: string, newPwd: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          localStorage.setItem(LOCAL_PWD_KEY, newPwd);
          return { success: true, message: data.message || '비밀번호가 변경되었습니다.' };
        }
      }
    } catch {
      // local fallback
    }

    const currentSaved = localStorage.getItem(LOCAL_PWD_KEY) || '1234';
    if (oldPwd !== currentSaved) {
      return { success: false, message: '현재 비밀번호가 일치하지 않습니다.' };
    }
    localStorage.setItem(LOCAL_PWD_KEY, newPwd);
    return { success: true, message: '비밀번호가 성공적으로 변경되었습니다.' };
  },

  async getCategories(): Promise<string[]> {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(data.categories));
          return data.categories;
        }
      }
    } catch {
      // fallback
    }

    const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    const initial = ['생활습관·정리', '활동·게임', '신체·놀이', '사회성·친구', '음악·표현', '기타'];
    localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(initial));
    return initial;
  },

  async addCategory(name: string): Promise<string[]> {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.categories) {
          localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(data.categories));
          return data.categories;
        }
      }
    } catch {
      // fallback
    }

    const current = await this.getCategories();
    if (!current.includes(name.trim())) {
      const next = [...current, name.trim()];
      localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(next));
      return next;
    }
    return current;
  },

  async updateCategory(oldName: string, newName: string): Promise<string[]> {
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(oldName)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.categories) {
          localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(data.categories));
          const apps = await this.getApps();
          const updatedApps = apps.map(a => a.category === oldName ? { ...a, category: newName.trim() } : a);
          localStorage.setItem(CACHE_KEY, JSON.stringify(updatedApps));
          return data.categories;
        }
      }
    } catch {
      // fallback
    }

    const current = await this.getCategories();
    const next = current.map(c => c === oldName ? newName.trim() : c);
    localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(next));
    const apps = await this.getApps();
    const updatedApps = apps.map(a => a.category === oldName ? { ...a, category: newName.trim() } : a);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updatedApps));
    return next;
  },

  async deleteCategory(name: string): Promise<{ categories: string[]; fallbackCategory: string }> {
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(name)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.categories) {
          localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(data.categories));
          const fallback = data.fallbackCategory || '기타';
          const apps = await this.getApps();
          const updatedApps = apps.map(a => a.category === name ? { ...a, category: fallback } : a);
          localStorage.setItem(CACHE_KEY, JSON.stringify(updatedApps));
          return { categories: data.categories, fallbackCategory: fallback };
        }
      }
    } catch {
      // fallback
    }

    const current = await this.getCategories();
    const remaining = current.filter(c => c !== name);
    const fallback = remaining.includes('기타') ? '기타' : remaining[0];
    localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(remaining));
    const apps = await this.getApps();
    const updatedApps = apps.map(a => a.category === name ? { ...a, category: fallback } : a);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updatedApps));
    return { categories: remaining, fallbackCategory: fallback };
  },

  async resetCategories(): Promise<string[]> {
    const initial = ['생활습관·정리', '활동·게임', '신체·놀이', '사회성·친구', '음악·표현', '기타'];
    try {
      const res = await fetch('/api/categories/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.categories) {
          localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(data.categories));
          return data.categories;
        }
      }
    } catch {
      // fallback
    }
    localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(initial));
    return initial;
  }
};
