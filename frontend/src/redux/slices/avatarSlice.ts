import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Avatar {
  characterName: string;
  description: string | undefined;
  price: number | 0;
  equipped: boolean;
  owned: boolean;
}

interface AvatarState {
  avatars: Avatar[];
}

const initialState: AvatarState = {
  avatars: [],
};

const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    setAvatars(state, action: PayloadAction<Avatar[]>) {
      state.avatars = action.payload;
    },
    updateAvatarEquipped: (state, action) => {
      const avatar = state.avatars.find(
        (avatar) => avatar.characterName === action.payload,
      );
      if (avatar) {
        avatar.equipped = true;
      }
    },
    updateAvatarOwned: (state, action) => {
      const avatar = state.avatars.find(
        (avatar) => avatar.characterName === action.payload,
      );
      if (avatar) {
        avatar.owned = true;
      }
    },
  },
});

export const { setAvatars, updateAvatarEquipped, updateAvatarOwned } =
  avatarSlice.actions;
export default avatarSlice.reducer;
