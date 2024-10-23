import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Friend {
  friendId: number;
  nickname: string;
  description: string;
  characterName: string;
  tierPoint: number;
  online: boolean;
}

interface FriendList {
  friends: Friend[];
  onlineFriends: Friend[];
}

const initialState: FriendList = {
  friends: [],
  onlineFriends: [],
};

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    setFriends(state, action: PayloadAction<Friend[]>) {
      state.friends = action.payload;
    },
    addFriend(state, action: PayloadAction<Friend>) {
      state.friends.push(action.payload);
    },
    removeFriend(state, action: PayloadAction<number>) {
      state.friends = state.friends.filter(
        (friend) => friend.friendId !== action.payload,
      );
    },
    setOnlineFriends(state, action: PayloadAction<Friend[]>) {
      state.onlineFriends = action.payload;
    },
  },
});

export const { setFriends, addFriend, removeFriend, setOnlineFriends } =
  friendSlice.actions;
export default friendSlice.reducer;
