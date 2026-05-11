import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { User } from '../../types';

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("accessToken")

interface AuthState {
  user:User | null;
  accessToken:string|null;
  loading:boolean;
  error:string|null;
  isAuthenticated:boolean
}

const initialState:AuthState={
  user:storedUser?JSON.parse(storedUser):null,
  accessToken:storedToken,
  loading:false,
  error:null,
  isAuthenticated: !!storedToken
}

export const registerUser=createAsyncThunk(
  'auth/register',
  async (data:{full_name:string,email:string,password:string},{rejectWithValue})=>{
    try {
      const response=await api.post('/auth/register',data);
      return response.data;   
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
})

export const login =createAsyncThunk(
  'auth/login',
  async (data :{email:string,password:string},{rejectWithValue})=>{
    try {
      const response=await api.post('/auth/login',data);
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)
export const logout=createAsyncThunk(
  'auth/logout',
  async (_,{rejectWithValue})=>{
    try {
      const response=await api.post('/auth/logout');
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed')
    }
  }
)
const authSlice =createSlice({
  name:"auth",
  initialState,
  reducers:{
    clearError:(state)=>{
      state.error=null;
     
    },
  },
  extraReducers:(builder)=>{
    builder
    //register
    .addCase(registerUser.pending,(state)=>{
      state.loading=true;
      state.error=null;
    })
    .addCase(registerUser.fulfilled,(state,action)=>{
      state.loading=false;
      state.user=action.payload.user;
      state.accessToken=action.payload.accessToken;
      state.isAuthenticated=true
    })
    .addCase(registerUser.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload as string;
    })
//Login
    .addCase(login.pending,(state)=>{
      state.loading=true;
      state.error=null;
      
    })
    .addCase(login.fulfilled,(state,action)=>{
      state.loading=false,
      state.user=action.payload.user;
      state.accessToken=action.payload.accessToken;
      localStorage.setItem("accessToken",action.payload.accessToken);
      localStorage.setItem("user",JSON.stringify(action.payload.user));
      state.isAuthenticated=true

    })
    .addCase(login.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload as string;
    })
//Logout
    .addCase(logout.pending,(state)=>{
      state.loading=true;
      state.error=null;
    })
    .addCase(logout.fulfilled,(state)=>{
      state.loading=false;
      state.user=null;
      state.accessToken=null;
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      state.isAuthenticated=false
    })
    .addCase(logout.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload as string;
      
    
  })
  }
})

export const {  clearError } = authSlice.actions;
export default authSlice.reducer;