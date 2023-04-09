import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {productService} from "./productService";
import {toast} from "react-toastify";


export const getAllProducts = createAsyncThunk(
    "product/get",
    async(thunkAPI) => {
        try{
            return productService.getProducts();
        }catch(error){
            return thunkAPI.rejectWithValue(error)
        }
});
 
const productState = {
    product:[],
    isError:"false",
    isSuccess:"false",
    isloading:"false",
    message:""
}

export const productSlice = createSlice({
    name:"product",
    initialState:productState,
    reducers:{},
    extraReducers:(builder) => {
        builder.addCase(getAllProducts.pending,(state) => {
            state.isloading = true;
        }).addCase(getAllProducts.fulfilled,(state,action) => {
            state.isloading = false;
            state.isError = false;
            state.isSuccess = true;
            state.product = action.payload
        }).addCase(getAllProducts.rejected,(state,action) => {
            state.isError = true;
            state.isloading = false;
            state.isSuccess = false;
            state.message = action.error;
        })
    }
});

export default productSlice.reducer;