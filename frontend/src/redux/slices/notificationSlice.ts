import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  count: number | 0;
}

const initialState: NotificationState = {
  count: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    increaseNotificationCount(state) {
      state.count += 1;
    },
    decreaseNotificationCount(state) {
      state.count -= 1;
    },
  },
});

export const { increaseNotificationCount, decreaseNotificationCount } =
  notificationSlice.actions;
export default notificationSlice.reducer;
