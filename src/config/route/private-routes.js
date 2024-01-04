import { Redirect, Route } from "react-router-dom"
import Template from "../../estrutura/Template"
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

function PrivateRoutes({component: Component, ...rest }){
    const [values, setValues] = useState({load:true})    
    const { location } = useLocation();
    useEffect(() =>{ 
        axios.get(process.env.REACT_APP_URL+"/auth/usuarios").then(response =>             
            setValues({usuario:response.data, load:false})
        ).catch((error) => {localStorage.removeItem("token");setValues({load:false})});
    }, [location]);

    return values.load?<h1>Carregando...</h1>
        :<Route { ...rest } render = {
            props =>{return values.usuario?<Template><Component {...props} /></Template>:<Redirect to={{pathname : "/login", state: {from: props.location}}}/>}
        }/>
}

export default PrivateRoutes