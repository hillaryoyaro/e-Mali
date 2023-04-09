import axios from "axios";
import {base_url} from "../../utils/axiosConfig"

//Get Products Intergration  from productSlice 
const getProducts = async () => {
    const response = await axios.get(`${base_url}product`);
    if(response.data){
        return response.data;
    }
}

//Wishlist Intergration  from productSlice 
 const addToWishlist = async () => {
     const response = await axios.get(`${base_url}product`);
     if(response.data){
         return response.data;
     }
 }


export const productService = {getProducts};