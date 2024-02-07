import axios from 'axios';
import Routes from './config/route/routes';
import "./reset.css" 
import { useState } from 'react';

const App = (props) => {   
    const [values, setValues] = useState({load:false}) 
    
    
    axios.interceptors.request.use(function (config) {         
        if(config.url.indexOf("auth/usuarios")===-1)
            setValues({...values, load:true}) 
        if(config.url.indexOf("auth/login")===-1)
            config.headers.Authorization = localStorage.getItem("token");    
        return config;
    });

    axios.interceptors.response.use(function (config) {   
        if(config.config.url.indexOf("auth/usuarios")===-1)
            setValues({...values, load:false})                           
        return config;
    });
    
    return <Routes load={values.load}/>
}

export default App;
