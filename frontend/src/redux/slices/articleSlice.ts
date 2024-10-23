import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ArticleInfo 타입 정의 (info 객체의 구조)
interface ArticleInfo {
  id: string;
  crop: string;
  aspect: string;
  title: string;
  body: string;
  author: string;
  future_articles: string | null;
}

// Article 타입 정의
interface Article {
  type: string;
  info: ArticleInfo | null; // info 속성 추가, null일 수 있으므로 | null 처리
  town: string;
  playerGold: number;
}

// 리덕스 상태 타입 정의
interface ArticleState {
  purchasedArticles: Article[];
}

const initialState: ArticleState = {
  purchasedArticles: [], // 구매한 기사 목록을 배열로 저장
};

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    // 새로운 기사를 배열에 추가
    addArticle: (state, action: PayloadAction<Article>) => {
      state.purchasedArticles.push(action.payload);
    },
    // 전체 기사 삭제 (배열 비우기)
    clearArticles: (state) => {
      state.purchasedArticles = [];
    },
  },
});

export const { addArticle, clearArticles } = articleSlice.actions;
export default articleSlice.reducer;
