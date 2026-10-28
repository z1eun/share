export interface PlayApp {
  id: string;
  title: string;
  icon: string; // Emoji character or image URL
  url: string;
  order: number;
  createdAt: string;
  category?: string;
  description?: string;
  isCustomImage?: boolean;
}

export type Category = '전체' | '생활습관·정리' | '활동·게임' | '신체·놀이' | '사회성·친구' | '음악·표현' | '기타';

export interface AdminAuthState {
  isAuthenticated: boolean;
  token?: string;
}
