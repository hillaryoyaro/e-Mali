import axios from "axios";
import { base_url } from "../../utils/base_url";

//using axios module and async to access data from our API's
const getUsers = async() => {
    const response = await axios.get(`${base_url}user/all-users`);
   
    return response.data;
};

//create object
const customerService = {
    getUsers,
};

export default customerService;