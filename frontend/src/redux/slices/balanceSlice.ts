import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BalanceState {
  balance: number;
}

const initialState: BalanceState = {
  balance: 1000000, // 초기 자금 100만원
};

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    // 작물 구매, 판매시 잔액 업데이트
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    clearBalance: (state) => {
      state.balance = 1000000;
    },
  },
});

export const { updateBalance, clearBalance } = balanceSlice.actions;
export default balanceSlice.reducer;
