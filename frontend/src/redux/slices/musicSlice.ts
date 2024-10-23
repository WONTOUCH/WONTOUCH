import { createSlice } from '@reduxjs/toolkit';

interface MusicState {
  isMusicOn: boolean;
}

const initialState: MusicState = {
  isMusicOn: true, // 기본값은 음악 켜짐
};

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    toggleMusic: (state) => {
      state.isMusicOn = !state.isMusicOn; // 음악 상태를 토글 (켜짐/꺼짐)
    },
  },
});

export const { toggleMusic } = musicSlice.actions;
export default musicSlice.reducer;
