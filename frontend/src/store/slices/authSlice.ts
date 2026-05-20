import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { User } from '../../types';

const storedUser = localStorage.getItem("user");
const storedToken=localStorage.getItem("accessToken")

interface AuthState {
  user:User | null;
  accessToken:string|null;
  loading:boolean;
  error:string|null;
  isAuthenticated:boolean
}

const initialState:AuthState={
  user:storedUser?JSON.parse(storedUser):null,
  accessToken:storedToken||null,
  loading:false,
  error:null,
  isAuthenticated: !! storedToken
}

export const registerUser=createAsyncThunk(
  'auth/register',
  async (data:{full_name:string,email:string,password:string},{rejectWithValue})=>{
    try {
      const response=await api.post('/auth/register',data);
      return response.data;   
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
})

export const login =createAsyncThunk(
  'auth/login',
  async (data :{email:string,password:string},{rejectWithValue})=>{
    try {
      const response=await api.post('/auth/login',data);
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed')
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
      return rejectWithValue(error.response?.data?.error || 'Logout failed')
    }
  }
)
export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/refresh-token",{});
      
      return response.data;

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Refresh failed"
      );
    }
  }
);
const authSlice =createSlice({
  name:"auth",
  initialState,
  reducers:{
    clearError:(state)=>{
      state.error=null;
     
    },
     setCredentials: (state, action) => {
    state.accessToken = action.payload.accessToken;
    state.isAuthenticated = true;
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
    .addCase(login.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload.user || null;
  state.accessToken = action.payload.accessToken;
  state.isAuthenticated = true;
  if (action.payload.accessToken) {
    localStorage.setItem("accessToken", action.payload.accessToken);
  }
  if (action.payload.user) {
    localStorage.setItem("user", JSON.stringify(action.payload.user));
  }
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
      
   //refresh token 
  })
  .addCase(refreshToken.fulfilled, (state, action) => {
  state.accessToken = action.payload.accessToken;
  state.isAuthenticated = true;
  localStorage.setItem("accessToken", action.payload.accessToken);
  if (state.user) {
    localStorage.setItem("user", JSON.stringify(state.user));
  }
})
.addCase(refreshToken.rejected, (state) => {
  state.isAuthenticated = false;
  state.user = null;
  state.accessToken = null;
   localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
})
  }
})

export const {  clearError,setCredentials } = authSlice.actions;
export default authSlice.reducer;