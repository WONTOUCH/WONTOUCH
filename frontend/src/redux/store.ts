/// <reference types="redux-persist" />

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import sessionStorage from 'redux-persist/lib/storage/session'; // sessionStorage 저장
import { persistReducer, persistStore } from 'redux-persist'; // 상태 지속을 위한 모듈

import userSlice from './slices/userSlice';
import authSlice from './slices/authSlice';
import roomSlice from './slices/roomSlice';
import cropSlice from './slices/cropSlice';
import notificationSlice from './slices/notificationSlice';
import articleSlice from './slices/articleSlice';
import friendSlice from './slices/friendSlice';
import chatSlice from './slices/chatSlice';
import articleResultSlice from './slices/articleResultSlice';
import cropResultSlice from './slices/cropResultSlice';
import timeSlice from './slices/timeSlice';
import cropQuantitySlice from './slices/cropQuantitySlice';
import gameResultSlice from './slices/gameResultSlice';
import avatarSlice from './slices/avatarSlice';
import balanceSlice from './slices/balanceSlice';
import playerCropSlice from './slices/playerCropSlice';
import chartReducer from './slices/chartSlice';
import musicSlice from './slices/musicSlice';
import lastRoundSlice from './slices/lastRoundSlice';


// persist 설정
const persistConfig = {
  key: 'root', // key는 로컬 스토리지에 저장되는 이름
  storage: sessionStorage, // 사용할 스토리지 (sessionStorage)
  whitelist: ['user', 'auth', 'notification', 'friend'], // 유지할 슬라이스 지정
};

// 여러 슬라이스를 결합
const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  room: roomSlice,
  crop: cropSlice,
  article: articleSlice,
  notification: notificationSlice,
  friend: friendSlice,
  chat: chatSlice,
  articleResult: articleResultSlice,
  cropResult: cropResultSlice,
  time: timeSlice,
  cropQuantity: cropQuantitySlice,
  gameResult: gameResultSlice,
  avatar: avatarSlice,
  balance: balanceSlice,
  playerCrop: playerCropSlice,
  chart: chartReducer,
  music: musicSlice,
  lastRound: lastRoundSlice,
});

// persistReducer로 rootReducer를 래핑
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 스토어 설정
export const store = configureStore({
  reducer: persistedReducer, // 지속 가능한 리듀서 사용
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist에서 직렬화 오류 방지
    }),
});

// persistStore로 스토어를 감싼다.
export const persistor = persistStore(store);

// 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
