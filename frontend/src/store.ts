import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import lawyersReducer from './slices/lawyersSlice';
import consultationReducer from './slices/consultationSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    lawyers: lawyersReducer,
    consultation: consultationReducer,
    ui: uiReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
