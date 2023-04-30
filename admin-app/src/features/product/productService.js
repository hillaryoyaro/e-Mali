import axios from "axios";
import { base_url } from "../../utils/base_url";

//using axios module and async to access data from our API's
const getProducts = async() => {
    const response = await axios.get(`${base_url}product/`);
   
    return response.data;
};

//create object
const productService = {
    getProducts,
};

export default productService;