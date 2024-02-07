import { Route } from "react-router-dom"
import Template from "../../estrutura/Template"
import { useEffect } from "react";
import axios from "../api/api";

function PrivateRoutes({component: Component, ...rest}){

    useEffect(() =>{ 
        axios.get(process.env.REACT_APP_URL+"/auth/usuarios")
            .catch((error) => {localStorage.removeItem("token");});
    }, []);

    return <Route { ...rest } render = {props =>{return <Template load={rest.load}><Component {...props} /></Template>}}/>
}

export default PrivateRoutes