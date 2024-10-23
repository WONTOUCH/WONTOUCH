import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CropQuantityState } from '../../components/game/types'; // 외부 파일에서 인터페이스를 가져옴

// 초기 상태: 각 작물의 수량을 관리하는 상태
const initialState: CropQuantityState = {
  cropsQuantities: [], // CropQuantity 배열로 작물의 id와 수량을 관리
};

const cropQuantitySlice = createSlice({
  name: 'cropQuantity',
  initialState,
  reducers: {
    // 새로운 작물을 추가하고 수량을 50으로 설정
    addCrop: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const existingCrop = state.cropsQuantities.find((crop) => crop.id === id);

      if (!existingCrop) {
        state.cropsQuantities.push({ id, quantity: 50, count: 0 }); // 수량을 50으로 초기 설정
      }
    },

    // 작물의 수량을 업데이트하는 리듀서
    updateCrop: (
      state,
      action: PayloadAction<{ id: string; newQuantity: number }>,
    ) => {
      const { id, newQuantity } = action.payload;
      const crop = state.cropsQuantities.find((crop) => crop.id === id);

      if (crop) {
        crop.quantity = newQuantity; // 새로운 수량으로 업데이트
      }
    },

    // 작물 수량 초기화
    clearCrops: (state) => {
      state.cropsQuantities = []; // 모든 작물 수량을 초기화
    },

    // count 값을 업데이트하는 리듀서
    updateCount: (
      state,
      action: PayloadAction<{ id: string; newCount: number }>,
    ) => {
      const { id, newCount } = action.payload;
      const crop = state.cropsQuantities.find((crop) => crop.id === id);

      if (crop) {
        crop.count = newCount; // 해당 작물의 count 값을 업데이트
      }
    },
  },
});

// 액션과 리듀서 내보내기
export const { addCrop, updateCrop, clearCrops, updateCount } =
  cropQuantitySlice.actions;
export default cropQuantitySlice.reducer;
