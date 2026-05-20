import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { Transaction } from '../../types';
import toast from 'react-hot-toast';



interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  transferSuccess: boolean;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
  transferSuccess: false,
};

export const fetchMyTransactions = createAsyncThunk(
  'transactions/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/transactions/my');
      return res.data.transactions;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch transactions.');
    }
  }
);

export const makeTransfer = createAsyncThunk(
  'transactions/transfer',
  async (
    data: { from_account_id: number; to_account_number: string; amount: number; description?: string },
    { rejectWithValue }
  ) => {
    try {
      
      const res = await api.post('/transactions/transfer', data);
      
      return res.data;
      
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Transfer failed.');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransferStatus(state) {
      state.transferSuccess = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchMyTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(makeTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.transferSuccess = false;
      })
      .addCase(makeTransfer.fulfilled, (state) => {
        state.loading = false;
        state.transferSuccess = true;
        
        
      })
      .addCase(makeTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        
      });
  }
});

export const { clearTransferStatus } = transactionSlice.actions;
export default transactionSlice.reducer;