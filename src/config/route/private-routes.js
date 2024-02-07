import { Route } from "react-router-dom"
import Template from "../../estrutura/Template"
import { useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

function PrivateRoutes({component: Component, ...rest}){
    const { location } = useLocation();

    useEffect(() =>{ 
        axios.get(process.env.REACT_APP_URL+"/auth/usuarios")
            .catch((error) => {localStorage.removeItem("token"); location.replace('/login');});
    }, [location]);

    return<Route { ...rest } render = {props =><Template load={rest.load}><Component {...props} /></Template>}/>
}

export default PrivateRoutes