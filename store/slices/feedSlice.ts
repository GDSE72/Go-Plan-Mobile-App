import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FeedItem {
    id: string;
    uniqueId: string;
    url: string;
    name: string;
    district: string;
}

interface FeedState {
    items: FeedItem[];
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
}

const initialState: FeedState = {
    items: [],
    loading: false,
    error: null,
    lastFetched: null,
};

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        fetchFeedStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchFeedSuccess(state, action: PayloadAction<FeedItem[]>) {
            state.loading = false;
            state.items = action.payload;
            state.lastFetched = Date.now();
        },
        fetchFeedFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        clearFeed(state) {
            state.items = [];
            state.lastFetched = null;
        }
    },
});

export const { fetchFeedStart, fetchFeedSuccess, fetchFeedFailure, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
