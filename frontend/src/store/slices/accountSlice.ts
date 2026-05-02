import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { Account } from '../../types';

interface AccountState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  loading: false,
  error: null,
};

export const fetchMyAccounts = createAsyncThunk(
  'accounts/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/accounts/my');
      return res.data.accounts;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch accounts.');
    }
  }
);

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchMyAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default accountSlice.reducer;