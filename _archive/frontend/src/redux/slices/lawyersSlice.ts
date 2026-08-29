import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Lawyer {
  id: string;
  bio: string;
  hourlyRate: number;
  specializations: string[];
  averageRating: number;
}

interface LawyersState {
  lawyers: Lawyer[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LawyersState = {
  lawyers: [],
  isLoading: false,
  error: null
};

const lawyersSlice = createSlice({
  name: 'lawyers',
  initialState,
  reducers: {
    fetchLawyersStart: (state) => {
      state.isLoading = true;
    },
    fetchLawyersSuccess: (state, action: PayloadAction<Lawyer[]>) => {
      state.lawyers = action.payload;
      state.isLoading = false;
    },
    fetchLawyersFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export const { fetchLawyersStart, fetchLawyersSuccess, fetchLawyersFailure } = lawyersSlice.actions;
export default lawyersSlice.reducer;
