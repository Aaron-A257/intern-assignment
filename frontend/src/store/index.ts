// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import stocksReducer from './slices/stocksSlice';

export const store = configureStore({
  reducer: {
    stocks: stocksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;