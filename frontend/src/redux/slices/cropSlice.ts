import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Crop, CropsState } from '../../components/game/types';

const initialState: CropsState = {
  crops: [],
};

const cropsSlice = createSlice({
  name: 'crops',
  initialState,
  reducers: {
    setCrops: (state, action: PayloadAction<Crop[]>) => {
      state.crops = action.payload;
    },
    updatePrice: (
      state,
      action: PayloadAction<{ id: string; newPrice: number }>,
    ) => {
      const crop = state.crops.find((crop) => crop.id === action.payload.id);
      if (crop) {
        crop.price = action.payload.newPrice;
      }
    },
  },
});

export const { setCrops, updatePrice } = cropsSlice.actions;
export default cropsSlice.reducer;
