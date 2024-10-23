import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 초기 상태 설정
interface LastRoundState {
  isLastRound: boolean;
}

const initialState: LastRoundState = {
  isLastRound: false, // 기본값은 false
};

// Slice 생성
const lastRoundSlice = createSlice({
  name: 'lastRound',
  initialState,
  reducers: {
    setLastRound(state, action: PayloadAction<boolean>) {
      state.isLastRound = action.payload;
    },
  },
});

// 액션과 리듀서 내보내기
export const { setLastRound } = lastRoundSlice.actions;
export default lastRoundSlice.reducer;
