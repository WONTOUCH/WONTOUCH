import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameParticipant {
  userId: number;
  isReady: boolean;
  nickname: string | '';
  description: string | '';
  characterName: string | '';
  tierPoint: number | 0;
  mileage: number | 0;
}

interface RoomState {
  roomId: string | '';
  roomName: string | '';
  hostId: number | null;
  gameParticipants: GameParticipant[];
  currentPlayerCount: number | 0;
  isPrivate: boolean;
  password: string | '';
}

const initialState: RoomState = {
  roomId: '',
  roomName: '',
  hostId: null,
  gameParticipants: [],
  currentPlayerCount: 0,
  isPrivate: false,
  password: '',
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomId(state, action: PayloadAction<string | ''>) {
      state.roomId = action.payload;
    },
    setRoomName(state, action: PayloadAction<string | ''>) {
      state.roomName = action.payload;
    },
    setHostId(state, action: PayloadAction<number | 0>) {
      state.hostId = action.payload;
    },
    setGameParticipants(state, action: PayloadAction<GameParticipant[]>) {
      state.gameParticipants = action.payload;
    },

    setIsPrivate(state, action: PayloadAction<boolean>) {
      state.isPrivate = action.payload;
    },
    setPassword(state, action: PayloadAction<string | ''>) {
      state.password = action.payload;
    },
    updateParticipantReadyState: (state, action) => {
      const { playerId, isReady } = action.payload;
      const participant = state.gameParticipants.find(
        (p) => p.userId === playerId,
      );
      if (participant) {
        participant.isReady = isReady;
      }
    },
    removeRoomId(state) {
      state.roomId = '';
      state.roomName = '';
      state.hostId = null;
      state.gameParticipants = [];
      state.currentPlayerCount = 0;
      state.isPrivate = false;
      state.password = '';
    },
  },
});

export const {
  setRoomId,
  setRoomName,
  setHostId,
  setGameParticipants,
  setIsPrivate,
  setPassword,
  updateParticipantReadyState,
  removeRoomId,
} = roomSlice.actions;
export default roomSlice.reducer;
