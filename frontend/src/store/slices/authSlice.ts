import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { User } from '../../types';

interface AuthState {
  user:User | null;
  token:string|null;
  loading:boolean;
  error:string|null;
}

const initialState:AuthState={
  user:null,
  token:null,
  loading:false,
  error:null,
}

export const register=createAsyncThunk(
  'auth/register',
  async (data:{full_name:string,email:string,password:string},{rejectWithValue})=>{
    try {
      const response=await api.post('/auth/register',data);
      return response.data;   
    } catch (error) {
      return rejectWithValue('Registration failed');
    }
})

export const login =createAsyncThunk(
  'auth/login',
  async (data :{email:string,password:string},{rejectWithValue})=>{
    try {
      const response=await api.post('/auth/login',data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Login failed')
    }
  }
)

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;