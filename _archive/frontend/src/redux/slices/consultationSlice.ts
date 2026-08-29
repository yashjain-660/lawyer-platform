import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Consultation {
  id: string;
  lawyerId: string;
  title: string;
  scheduledDate: string;
  status: string;
}

interface ConsultationState {
  consultations: Consultation[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ConsultationState = {
  consultations: [],
  isLoading: false,
  error: null
};

const consultationSlice = createSlice({
  name: 'consultation',
  initialState,
  reducers: {
    fetchConsultationsStart: (state) => {
      state.isLoading = true;
    },
    fetchConsultationsSuccess: (state, action: PayloadAction<Consultation[]>) => {
      state.consultations = action.payload;
      state.isLoading = false;
    },
    fetchConsultationsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    addConsultation: (state, action: PayloadAction<Consultation>) => {
      state.consultations.push(action.payload);
    }
  }
});

export const { 
  fetchConsultationsStart, 
  fetchConsultationsSuccess, 
  fetchConsultationsFailure,
  addConsultation 
} = consultationSlice.actions;
export default consultationSlice.reducer;
