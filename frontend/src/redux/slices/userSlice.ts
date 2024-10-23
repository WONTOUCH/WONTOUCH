import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: number | null;
  nickname: string | '';
  description: string | '';
  characterName: string | '';
  tierPoint: number | 0;
  mileage: number | 0;
}

const initialState: UserState = {
  id: null,
  nickname: '',
  description: '',
  characterName: '',
  tierPoint: 0,
  mileage: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId(state, action: PayloadAction<number>) {
      state.id = action.payload;
    },
    clearUserId(state) {
      state.id = null;
    },
    setUserNickname(state, action: PayloadAction<string>) {
      state.nickname = action.payload;
    },
    setUserDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;
    },
    setUserCharacterName(state, action: PayloadAction<string>) {
      state.characterName = action.payload;
    },
    setUserTierPoint(state, action: PayloadAction<number>) {
      state.tierPoint = action.payload;
    },
    getUserTierPoint(state, action: PayloadAction<number>) {
      state.tierPoint += action.payload;
    },
    setUserMileage(state, action: PayloadAction<number>) {
      state.mileage = action.payload;
    },
    getUserMileage(state, action: PayloadAction<number>) {
      state.mileage += action.payload;
    },
    postUserMileage(state, action: PayloadAction<number>) {
      state.mileage -= action.payload;
    },

    // 새로운 리듀서: tierPoint와 mileage를 동시에 업데이트
    updateUserStats(
      state,
      action: PayloadAction<{ tierPoint: number; mileage: number }>,
    ) {
      state.tierPoint += action.payload.tierPoint; // tierPoint 업데이트
      state.mileage += action.payload.mileage; // mileage 업데이트
    },
  },
});

// 액션과 리듀서 내보내기
export const {
  setUserId,
  clearUserId,
  setUserNickname,
  setUserDescription,
  setUserCharacterName,
  setUserTierPoint,
  getUserTierPoint,
  setUserMileage,
  getUserMileage,
  postUserMileage,
  updateUserStats, // 추가된 리듀서
} = userSlice.actions;

export default userSlice.reducer;
