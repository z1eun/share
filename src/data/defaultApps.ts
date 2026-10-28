import { PlayApp } from '../types.ts';

export const DEFAULT_PLAY_APPS: PlayApp[] = [
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

export const CATEGORIES: string[] = [
  '전체',
  '생활습관·정리',
  '활동·게임',
  '신체·놀이',
  '사회성·친구',
  '음악·표현'
];
