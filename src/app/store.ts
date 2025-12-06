import { configureStore } from '@reduxjs/toolkit';
import minionsReducer from '../features/minions/minionsSlice';

export const store = configureStore({
  reducer: {
    minions: minionsReducer,
  },
});

// Tipos inferidos para TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;