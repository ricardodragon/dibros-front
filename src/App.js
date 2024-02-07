import Routes from './config/route/routes';
import "./reset.css" 
import axios from './config/api/api';
import { useState } from 'react';

const App = (props) => {   
    const [values, setValues] = useState({load:false})     
    axios.interceptors.request.use(function (config) {         
        if(config.url.indexOf("auth/usuarios")===-1 && !values.load)
            setValues({...values, load:true})    
        return config;
    });

    axios.interceptors.response.use(function (config) {   
        if(config.config.url.indexOf("auth/usuarios")===-1 && values.load)
            setValues({...values, load:false})                           
        return config;
    });
    
    return <Routes load={values.load} {...props}/>
}

export default App;
