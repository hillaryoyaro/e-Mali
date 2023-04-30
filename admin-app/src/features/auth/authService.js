import axios from "axios";
import { base_url } from "../../utils/base_url";

//using axios module and async to access data from our API's
const login = async(userData) => {
    const response = await axios.post (`${base_url}user/admin-login`,userData);
    if (response.data){
        //storing the token in ourlocal staorage
        localStorage.setItem('user',JSON.stringify(response.data));
        
    }

    return response.data;
};

//create object
const authService = {
    login,
};

export default authService;