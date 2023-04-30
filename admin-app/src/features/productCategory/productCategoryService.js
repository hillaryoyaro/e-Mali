import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosConfig"

//using axios module and async to access data from our API's
const getProductCategories = async() => {
    try{
        const response = await axios.get(`${base_url}productcategory/`, config);
        console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
    }

};

//create object
const productCategoryService = {
    getProductCategories,
};

export default productCategoryService;