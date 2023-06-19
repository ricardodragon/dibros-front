import axios from 'axios';
import Routes from './config/route/routes';
import "./reset.css" 


const App = () => {      
    axios.interceptors.request.use(function (config) {             
        config.headers.Authorization = localStorage.getItem("token");
        return config;
    });
    return <Routes/>
}

export default App;
