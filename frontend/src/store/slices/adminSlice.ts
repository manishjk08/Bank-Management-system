import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type {  AdminAccount } from '../../types';

interface AdminState {
  allAccounts: AdminAccount[]
  loading: boolean;
  error: string | null;
  depositSuccess: boolean;
}

const initialState: AdminState = {
  allAccounts: [],
  loading: false,
  error: null,
  depositSuccess: false,
};

export const fetchAllAccounts = createAsyncThunk(
  'admin/fetchAllAccounts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/accounts');
      return res.data.accounts;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch accounts.');
    }
  }
);

export const makeDeposit = createAsyncThunk(
  'admin/deposit',
  async (
    data: { to_account_id: number; amount: number; description?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post('/transactions/deposit', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Deposit failed.');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearDepositStatus(state) {
      state.depositSuccess = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.allAccounts = action.payload;
      })
      .addCase(fetchAllAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(makeDeposit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.depositSuccess = false;
      })
      .addCase(makeDeposit.fulfilled, (state) => {
        state.loading = false;
        state.depositSuccess = true;
      })
      .addCase(makeDeposit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearDepositStatus } = adminSlice.actions;
export default adminSlice.reducer;