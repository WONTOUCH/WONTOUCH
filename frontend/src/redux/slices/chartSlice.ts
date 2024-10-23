import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ChartState는 단순히 number[] 배열
type ChartState = number[];

const initialState: ChartState = []; // 초기 상태는 빈 배열

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setChartData: (state, action: PayloadAction<number[]>) => {
      // 새로운 chartData 배열로 state를 교체
      return action.payload;
    },
  },
});

export const { setChartData } = chartSlice.actions;
export default chartSlice.reducer;
