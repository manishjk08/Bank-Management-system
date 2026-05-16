import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { Account,PendingAccount } from '../../types';


interface AdminState {
  allAccounts: Account[]
  pendingAccounts:PendingAccount[]
  loading: boolean;
  error: string | null;
  depositSuccess: boolean;
}

const initialState: AdminState = {
  allAccounts: [],
  pendingAccounts:[],
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
export const PendingAccountRequest=createAsyncThunk(
  'admin/pending_request',
  async(_,{rejectWithValue})=>{
    try {
      const res=await api.get('accounts/pending_accounts')
      return res.data.accounts
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.error || ' failed to fetch accunts.')
    }
  }
)

export const ApproveAccounts=createAsyncThunk(
  'admin/approve/id',
  async (
    data:{
      id:number,
  },{rejectWithValue})=>{
    try {
      const res=await api.patch(`accounts/approve/${data.id}`)
      return res.data
    } catch (error) {
      return rejectWithValue(error||'Approved failed')
    }
  }
);
export const rejectAccounts=createAsyncThunk(
  'accounts/reject/id',
  async(data:{id:number},{rejectWithValue})=>{
    try {
      const res=await api.patch(`accounts/reject/${data.id}`)
      return res.data
    } catch (error) {
      return rejectWithValue(error||'Reject failed')
    }
  }
)

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
      })
      .addCase(PendingAccountRequest.pending,(state)=>{
        state.loading=true;
        state.error=null
      })
       .addCase(PendingAccountRequest.fulfilled,(state,action)=>{
        state.loading=true;
        state.error=null;
        state.pendingAccounts=action.payload
      })
       .addCase(PendingAccountRequest.rejected,(state)=>{
        state.loading=true;
        state.error=null
      })
      .addCase(ApproveAccounts.pending,(state)=>{
        state.loading=true;
        state.error=null
      })
       .addCase(ApproveAccounts.fulfilled,(state,action)=>{
        state.loading=false;
        state.error=null;
         state.pendingAccounts = state.pendingAccounts.filter(
    (acc) => acc.id !== action.payload.id);
    state.allAccounts.push(action.payload);
        
      })
       .addCase(ApproveAccounts.rejected,(state)=>{
        state.loading=false;
        state.error=null
      })
      .addCase(rejectAccounts.pending,(state)=>{
        state.loading=true;
        state.error=null
      })
       .addCase(rejectAccounts.fulfilled,(state,action)=>{
        state.loading=false;
        state.error=null;
         state.pendingAccounts = state.pendingAccounts.filter(
    (acc) => acc.id !== action.payload.id);
    
        
      })
       .addCase(rejectAccounts.rejected,(state)=>{
        state.loading=false;
        state.error=null
      })
  }
});

export const { clearDepositStatus } = adminSlice.actions;
export default adminSlice.reducer;