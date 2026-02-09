import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TravelPlan } from '../../types';

interface TripState {
    currentPlan: TravelPlan | null;
    savedTrips: TravelPlan[];
    loading: boolean;
    error: string | null;
}

const initialState: TripState = {
    currentPlan: null,
    savedTrips: [],
    loading: false,
    error: null,
};

const tripSlice = createSlice({
    name: 'trip',
    initialState,
    reducers: {
        setTripPlan(state, action: PayloadAction<TravelPlan>) {
            state.currentPlan = action.payload;
            state.loading = false;
            state.error = null;
        },
        clearTripPlan(state) {
            state.currentPlan = null;
        },
        generateTripStart(state) {
            state.loading = true;
            state.error = null;
        },
        generateTripFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        // Could expand to include saved trips logic
    },
});

export const { setTripPlan, clearTripPlan, generateTripStart, generateTripFailure } = tripSlice.actions;
export default tripSlice.reducer;
