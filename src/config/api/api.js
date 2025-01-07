import axios from "axios";

const api = axios.create({
    baseURL : process.env.REACT_APP_URL,
});
api.interceptors.request.use(function (config) { 
    
    if(config.url.indexOf("auth/login")===-1)
        config.headers.Authorization = localStorage.getItem("token");    
    
    return config;
});

export default api;