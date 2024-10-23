// redux/slices/gameResultSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PlayerResult {
  playerId: string;
  totalGold: number;
  tierPoint: number;
  rank: number;
  mileage: number;
}

export interface GameResultState {
  results: PlayerResult[];
}

const initialState: GameResultState = {
  results: [],
};

const gameResultSlice = createSlice({
  name: 'gameResult',
  initialState,
  reducers: {
    setGameResult: (state, action: PayloadAction<PlayerResult[]>) => {
      state.results = action.payload;
    },
  },
});

export const { setGameResult } = gameResultSlice.actions;

export default gameResultSlice.reducer;
