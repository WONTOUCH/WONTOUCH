import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload; // 토큰 설정
    },
    clearToken(state) {
      state.token = null; // 토큰 초기화
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
