import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer'; // Immer에서 MapSet 플러그인 import

// 플러그인 활성화
enableMapSet();

interface ChatParticipant {
  userId: number;
  nickname: string | '';
}

interface ChatState {
  chatParticipants: Set<ChatParticipant>;
}

const initialState: ChatState = {
  chatParticipants: new Set(),
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addChatParticipants: (state, action: PayloadAction<ChatParticipant>) => {
      state.chatParticipants.add(action.payload);
    },
  },
});

export const { addChatParticipants } = chatSlice.actions;
export default chatSlice.reducer;
