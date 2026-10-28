import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const APPS_FILE = path.join(DATA_DIR, 'apps.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

const INITIAL_CATEGORIES = [
  '생활습관·정리',
  '활동·게임',
  '신체·놀이',
  '사회성·친구',
  '음악·표현',
  '기타'
];

const INITIAL_APPS = [
  {
    id: 'app_20261028_01',
    title: '정리 O,X 퀴즈',
    icon: '🧹',
    url: 'https://vibe-clean-quiz.netlify.app',
    order: 1,
    createdAt: '2026-10-28T06:43:00Z',
    category: '생활습관·정리',
    description: '교실 물건의 제자리를 O, X로 신나게 맞히는 정리정돈 놀이'
  },
  {
    id: 'app_20261028_02',
    title: '뽑기 룰렛',
    icon: '🎁',
    url: 'https://vibe-roulette-spinner.netlify.app',
    order: 2,
    createdAt: '2026-10-28T06:44:00Z',
    category: '활동·게임',
    description: '두근두근 발표자 뽑기와 모둠 활동 순서 정하기 룰렛'
  },
  {
    id: 'app_20261028_03',
    title: '하늘에서 떨어진다',
    icon: '🍗',
    url: 'https://vibe-falling-catcher.netlify.app',
    order: 3,
    createdAt: '2026-10-28T06:45:00Z',
    category: '신체·놀이',
    description: '하늘에서 내려오는 맛있는 음식과 보물을 쏙쏙 받는 순발력 게임'
  },
  {
    id: 'app_20261028_04',
    title: '내 짝꿍 찾기',
    icon: '🖤',
    url: 'https://vibe-find-partner.netlify.app',
    order: 4,
    createdAt: '2026-10-28T06:46:00Z',
    category: '사회성·친구',
    description: '짝꿍 카드를 맞춰보며 새로운 친구와 다정하게 인사하기'
  },
  {
    id: 'app_20261028_05',
    title: '친구 이름 게임',
    icon: '🧑‍🦱',
    url: 'https://vibe-friend-names.netlify.app',
    order: 5,
    createdAt: '2026-10-28T06:47:00Z',
    category: '사회성·친구',
    description: '우리 반 소중한 친구들의 이름과 별명을 신나게 불러보는 놀이'
  },
  {
    id: 'app_20261028_06',
    title: '정리타이머',
    icon: '⏰',
    url: 'https://vibe-cleanup-timer.netlify.app',
    order: 6,
    createdAt: '2026-10-28T06:48:00Z',
    category: '생활습관·정리',
    description: '신나는 배경음악과 함께 정리 시간을 알려주는 시각 타이머'
  },
  {
    id: 'app_20261028_07',
    title: '무작위 발표자 지명기',
    icon: '🎯',
    url: 'https://vibe-random-student.netlify.app',
    order: 7,
    createdAt: '2026-10-28T06:49:00Z',
    category: '활동·게임',
    description: '오늘은 어떤 친구가 멋지게 발표해 볼까요? 공정한 무작위 지명'
  },
  {
    id: 'app_20261028_08',
    title: '칭찬 도장판 & 스티커',
    icon: '⭐',
    url: 'https://vibe-praise-stamps.netlify.app',
    order: 8,
    createdAt: '2026-10-28T06:50:00Z',
    category: '생활습관·정리',
    description: '착한 행동과 바른 정리를 한 어린이에게 반짝반짝 칭찬 스티커'
  },
  {
    id: 'app_20261028_09',
    title: '유치원 모임 동요 모음',
    icon: '🎵',
    url: 'https://vibe-kindergarten-songs.netlify.app',
    order: 9,
    createdAt: '2026-10-28T06:51:00Z',
    category: '음악·표현',
    description: '동그랗게 모여 부르는 신나는 아침 인사 및 일과 동요 플레이어'
  }
];

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(APPS_FILE)) {
    fs.writeFileSync(APPS_FILE, JSON.stringify(INITIAL_APPS, null, 2), 'utf-8');
  }
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ adminPassword: '1234' }, null, 2), 'utf-8');
  }
  if (!fs.existsSync(CATEGORIES_FILE)) {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(INITIAL_CATEGORIES, null, 2), 'utf-8');
  }
}

function readCategories(): string[] {
  ensureDataFiles();
  try {
    const content = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : INITIAL_CATEGORIES;
  } catch (err) {
    console.error('Failed to read categories.json', err);
    return INITIAL_CATEGORIES;
  }
}

function writeCategories(categories: string[]) {
  ensureDataFiles();
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
}

function readApps(): any[] {
  ensureDataFiles();
  try {
    const content = fs.readFileSync(APPS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Failed to read apps.json, restoring initial defaults', err);
    return INITIAL_APPS;
  }
}

function writeApps(apps: any[]) {
  ensureDataFiles();
  fs.writeFileSync(APPS_FILE, JSON.stringify(apps, null, 2), 'utf-8');
}

function readAdminPassword(): string {
  ensureDataFiles();
  try {
    const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return parsed.adminPassword || '1234';
  } catch {
    return '1234';
  }
}

function writeAdminPassword(password: string) {
  ensureDataFiles();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ adminPassword: password }, null, 2), 'utf-8');
}

// API Routes
app.get('/api/apps', (_req, res) => {
  const apps = readApps();
  // Sort by order ascending
  apps.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  res.json({ success: true, apps });
});

app.post('/api/apps', (req, res) => {
  const newApp = req.body;
  if (!newApp || !newApp.title || !newApp.url) {
    return res.status(400).json({ success: false, message: '앱 제목과 URL을 입력해주세요.' });
  }

  const apps = readApps();
  const maxOrder = apps.reduce((max, a) => Math.max(max, a.order || 0), 0);

  const createdItem = {
    id: newApp.id || `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: newApp.title.trim(),
    icon: newApp.icon || '🎈',
    url: newApp.url.trim(),
    order: typeof newApp.order === 'number' ? newApp.order : maxOrder + 1,
    createdAt: newApp.createdAt || new Date().toISOString(),
    category: newApp.category || '기타',
    description: newApp.description?.trim() || '',
    isCustomImage: Boolean(newApp.isCustomImage)
  };

  apps.push(createdItem);
  writeApps(apps);
  res.status(201).json({ success: true, app: createdItem });
});

app.put('/api/apps/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const apps = readApps();
  const index = apps.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: '앱을 찾을 수 없습니다.' });
  }

  apps[index] = {
    ...apps[index],
    ...updates,
    id // keep original ID
  };

  writeApps(apps);
  res.json({ success: true, app: apps[index] });
});

app.delete('/api/apps/:id', (req, res) => {
  const { id } = req.params;
  const apps = readApps();
  const filtered = apps.filter(a => a.id !== id);

  if (filtered.length === apps.length) {
    return res.status(404).json({ success: false, message: '삭제할 앱을 찾을 수 없습니다.' });
  }

  writeApps(filtered);
  res.json({ success: true, deletedId: id });
});

app.post('/api/apps/reorder', (req, res) => {
  const { apps: reorderedApps } = req.body;
  if (!Array.isArray(reorderedApps)) {
    return res.status(400).json({ success: false, message: '유효한 목록 배열이 필요합니다.' });
  }

  const updated = reorderedApps.map((item, index) => ({
    ...item,
    order: index + 1
  }));

  writeApps(updated);
  res.json({ success: true, apps: updated });
});

app.post('/api/apps/reset', (_req, res) => {
  writeApps(INITIAL_APPS);
  res.json({ success: true, apps: INITIAL_APPS });
});

// Category Management API Routes
app.get('/api/categories', (_req, res) => {
  const categories = readCategories();
  res.json({ success: true, categories });
});

app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: '분류 이름을 입력해주세요.' });
  }
  const trimmed = name.trim();
  const categories = readCategories();
  if (categories.includes(trimmed)) {
    return res.status(400).json({ success: false, message: '이미 존재하는 분류입니다.' });
  }
  categories.push(trimmed);
  writeCategories(categories);
  res.status(201).json({ success: true, categories });
});

app.put('/api/categories/:name', (req, res) => {
  const oldName = decodeURIComponent(req.params.name);
  const { newName } = req.body;
  if (!newName || !newName.trim()) {
    return res.status(400).json({ success: false, message: '새 분류 이름을 입력해주세요.' });
  }
  const trimmedNew = newName.trim();
  const categories = readCategories();
  const idx = categories.indexOf(oldName);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: '수정할 분류를 찾을 수 없습니다.' });
  }
  if (oldName !== trimmedNew && categories.includes(trimmedNew)) {
    return res.status(400).json({ success: false, message: '이미 동일한 이름의 분류가 존재합니다.' });
  }

  categories[idx] = trimmedNew;
  writeCategories(categories);

  // Update apps that have this category
  const apps = readApps();
  let updatedCount = 0;
  const updatedApps = apps.map(app => {
    if (app.category === oldName) {
      updatedCount++;
      return { ...app, category: trimmedNew };
    }
    return app;
  });
  if (updatedCount > 0) {
    writeApps(updatedApps);
  }

  res.json({ success: true, categories, updatedAppsCount: updatedCount });
});

app.delete('/api/categories/:name', (req, res) => {
  const nameToDelete = decodeURIComponent(req.params.name);
  const categories = readCategories();
  if (!categories.includes(nameToDelete)) {
    return res.status(404).json({ success: false, message: '삭제할 분류를 찾을 수 없습니다.' });
  }
  if (categories.length <= 1) {
    return res.status(400).json({ success: false, message: '최소 1개 이상의 분류는 유지되어야 합니다.' });
  }

  const remaining = categories.filter(c => c !== nameToDelete);
  writeCategories(remaining);

  // Reassign apps that used this category to '기타' or first available category
  const fallbackCategory = remaining.includes('기타') ? '기타' : remaining[0];
  const apps = readApps();
  let reassignedCount = 0;
  const updatedApps = apps.map(app => {
    if (app.category === nameToDelete) {
      reassignedCount++;
      return { ...app, category: fallbackCategory };
    }
    return app;
  });
  if (reassignedCount > 0) {
    writeApps(updatedApps);
  }

  res.json({ success: true, categories: remaining, reassignedCount, fallbackCategory });
});

app.post('/api/categories/reset', (_req, res) => {
  writeCategories(INITIAL_CATEGORIES);
  res.json({ success: true, categories: INITIAL_CATEGORIES });
});

app.post('/api/admin/verify', (req, res) => {
  const { password } = req.body;
  const currentPassword = readAdminPassword();
  if (password === currentPassword) {
    res.json({ success: true, token: 'auth_' + Date.now() });
  } else {
    res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
  }
});

app.post('/api/admin/change-password', (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const currentPassword = readAdminPassword();
  if (oldPassword !== currentPassword) {
    return res.status(401).json({ success: false, message: '현재 비밀번호가 일치하지 않습니다.' });
  }
  if (!newPassword || newPassword.length < 2) {
    return res.status(400).json({ success: false, message: '새 비밀번호는 2자리 이상 입력해주세요.' });
  }

  writeAdminPassword(newPassword);
  res.json({ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' });
});

async function startServer() {
  ensureDataFiles();

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Web Hub server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
