import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CropPriceMap, CropResultState } from '../../components/game/types';

const initialState: CropResultState = {
  originPriceMap: {},
  newPriceMap: {},
};

const cropResultSlice = createSlice({
  name: 'cropResult',
  initialState,
  reducers: {
    updateCropPrices: (
      state,
      action: PayloadAction<{
        originPriceMap: CropPriceMap;
        newPriceMap: CropPriceMap;
      }>,
    ) => {
      state.originPriceMap = action.payload.originPriceMap;
      state.newPriceMap = action.payload.newPriceMap;
    },
    clearCropPrices: (state) => {
      state.originPriceMap = {};
      state.newPriceMap = {};
    },
  },
});

export const { updateCropPrices, clearCropPrices } = cropResultSlice.actions;
export default cropResultSlice.reducer;
