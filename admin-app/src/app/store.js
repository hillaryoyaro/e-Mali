import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/customers/customerSlice";
import productReducer from "../features/product/productSlice";
import brandReducer from "../features/brand/brandSlice";
import productCategoryReducer from "../features/productCategory/productCategorySlice";
import colorReducer from "../features/color/colorSlice";
import blogReducer from "../features/blogs/blogSlice";
import blogCategoryReducer from "../features/blogCategory/blogCategorySlice";
import enquiryReducer from "../features/enquiry/enquirySlice";
import orderReducer from "../features/order/orderSlice";

export const store = configureStore({
    reducer:{
        auth:authReducer,
        customer: customerReducer,
        product: productReducer,
        brand: brandReducer,
        productCategory : productCategoryReducer,
        color : colorReducer,
        blog : blogReducer,
        blogCategory : blogCategoryReducer,
        enquiry : enquiryReducer,
        order : orderReducer,
    },
}); 