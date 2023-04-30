import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

//geting a user from local storage--if it is available we parse json
const getUserFromLocalStorage = localStorage.getItem('user')
? JSON.parse(localStorage.getItem('user')):
 null;

//creating the initial state--default state 
const initialState = {
    user: getUserFromLocalStorage,
    isError:false,
    isLoading:false,
    isSuccess:false,
    message:"",
};

export const login = createAsyncThunk("auth/admin-login",async(user,thankAPI) => {
    try{
        return await authService.login(user);
    }catch(error){
        return thankAPI.rejectWithValue(error);
    }
})

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:(buider) => {
        buider.addCase(login.pending,(state) => {
            state.isLoading = true;
        })
        .addCase(login.fulfilled,(state,action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.user = action.payload;
        })
        .addCase(login.rejected,(state,action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.action = null;
        });
    },
});

export default authSlice.reducer;