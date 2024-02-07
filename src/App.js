import Routes from './config/route/routes';
import "./reset.css" 
import axios from './config/api/api';

const App = () => {   
    axios.interceptors.request.use(function (config) {  
        return config;
    });

    axios.interceptors.response.use(function (config) {   
        return config;
    });
    
    return <Routes/>
}

export default App;
