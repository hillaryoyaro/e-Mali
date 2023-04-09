import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {authService} from "./userService";
import {toast} from "react-toastify";

export const registerUser = createAsyncThunk("auth/register",
async(userData,thunkAPI) => {
    try{
        return authService.register(userData)
    }catch(error){
        return thunkAPI.rejectWithValue(error)
    }
});

export const loginUser = createAsyncThunk("auth/login",
async(userData,thunkAPI) => {
    try{
        return authService.login(userData)
    }catch(error){
        return thunkAPI.rejectWithValue(error)
    }
});
 
const initialState = {
    user:"",
    isError:"false",
    isSuccess:"false",
    isloading:"false",
    message:""
}

export const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{},
    extraReducers:(builder) => {
        builder
         //userslice Registration implementation
        .addCase(registerUser.pending,(state) => {
            state.isloading = true
        })
        .addCase(registerUser.fulfilled,(state,action) => {
            state.isloading = false;
            state.isError = false;
            state.isSuccess = true;
            state.createdUser = action.payload;
            if(state.isSuccess === true){
                toast.info("User Created Successfully");
            }
        })
        .addCase(registerUser.rejected,(state,action) => {
            state.isloading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error
            if(state.isError === true){
                toast.error(action.error);
            }
        })
        //userslice login implementation
        .addCase(loginUser.pending,(state) => {
            state.isloading = true
        })
        .addCase(loginUser.fulfilled,(state,action) => {
            state.isloading = false;
            state.isError = false;
            state.isSuccess = true;
            state.user = action.payload;
            if(state.isSuccess === true){
                //saving our token to local storage
                localStorage.setItem("token",action.payload.token);
                toast.info("User Login Successfully");
            }
        })
        .addCase(loginUser.rejected,(state,action) => {
            state.isloading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error
            if(state.isError === true){
                toast.error(action.error);
            }
        })
    }
})

export  default authSlice.reducer;