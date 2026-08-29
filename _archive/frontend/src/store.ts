import { configureStore } from '@reduxjs/toolkit';
import authReducer from './redux/slices/authSlice';
import lawyersReducer from './redux/slices/lawyersSlice';
import consultationReducer from './redux/slices/consultationSlice';
import uiReducer from './redux/slices/uiSlice';

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
