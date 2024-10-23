import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 작물의 이름(string)과 수량(number)을 관리하는 상태 인터페이스
interface PlayerCropState {
  crops: { [key: string]: number };
}

// 초기 상태: 작물 이름과 수량이 담긴 객체
const initialState: PlayerCropState = {
  crops: {}, // 초기에는 비어있는 상태로 설정
};

const playerCropSlice = createSlice({
  name: 'playerCrop',
  initialState,
  reducers: {
    // 전체 작물 리스트를 초기화하거나 설정하는 리듀서
    setPlayerCrops: (
      state,
      action: PayloadAction<{ [key: string]: number }>,
    ) => {
      state.crops = action.payload;
    },
    // 작물 수량을 업데이트하는 리듀서
    updateCropAmount: (
      state,
      action: PayloadAction<{ cropName: string; newQuantity: number }>,
    ) => {
      if (state.crops[action.payload.cropName] !== undefined) {
        state.crops[action.payload.cropName] = action.payload.newQuantity;
      }
    },

    clearCropAmout: (state) => {
      state.crops = {};
    },
  },
});

// 액션과 리듀서 내보내기
export const { setPlayerCrops, updateCropAmount, clearCropAmout } =
  playerCropSlice.actions;
export default playerCropSlice.reducer;
