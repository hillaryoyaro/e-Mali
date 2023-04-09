import axios from "axios";
import {base_url} from "../../utils/axiosConfig"

//User Service Register
const register = async (userData) => {
    const response = await axios.post(`${base_url}user/register`,userData);
    if(response.data){
        return response.data;
    }
}

//User Service login
const login = async (userData) => {
    const response = await axios.post(`${base_url}user/login`,userData);
    if(response.data){
        return response.data;
    }
}


export const authService = {register,login}