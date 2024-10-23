import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimeState } from '../../components/game/types';

const initialState: TimeState = {
  duration: 0,
  round: 0,
  timerRunning: false,
  preparationTime: 0, // 초기값 0
  isPreparation: false, // 대기상태가 아닌 것으로 초기화
};

const timeSlice = createSlice({
  name: 'time',
  initialState,
  reducers: {
    setRoundStart: (
      state,
      action: PayloadAction<{ duration: number; round: number }>,
    ) => {
      state.duration = action.payload.duration;
      state.round = action.payload.round;
      state.timerRunning = true;
      state.isPreparation = false; // 라운드 시작 시 대기상태가 아님
    },
    decrementDuration: (state) => {
      if (state.duration > 0) {
        state.duration -= 1;
      } else {
        state.timerRunning = false;
      }
    },
    setPreparationStart: (
      state,
      action: PayloadAction<{ preparationTime: number }>,
    ) => {
      state.preparationTime = action.payload.preparationTime;
      state.isPreparation = true; // 대기상태 시작
    },
    decrementPreparationTime: (state) => {
      if (state.preparationTime > 0) {
        state.preparationTime -= 1;
      } else {
        state.isPreparation = false; // 대기시간이 끝나면 종료
      }
    },
  },
});

export const {
  setRoundStart,
  decrementDuration,
  setPreparationStart,
  decrementPreparationTime,
} = timeSlice.actions;

export default timeSlice.reducer;
