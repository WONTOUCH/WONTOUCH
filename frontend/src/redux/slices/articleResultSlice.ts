import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArticleResult, ArticleState } from '../../components/game/types'; // types 파일에서 가져옴

const initialState: ArticleState = {
  purchasedArticles: [],
  articleResults: [], // 초기 상태
};

export const articleSlice = createSlice({
  name: 'articleResult',
  initialState,
  reducers: {
    addArticleResult: (state, action: PayloadAction<ArticleResult[]>) => {
      state.articleResults = action.payload;
    },
    clearArticleResults: (state) => {
      state.articleResults = [];
    },
  },
});

export const { addArticleResult, clearArticleResults } = articleSlice.actions;
export default articleSlice.reducer;
