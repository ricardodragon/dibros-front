import { Route } from "react-router-dom"
import Template from "../../estrutura/Template"
import Login from "../../pages/Login";
import axios from "../api/api";
import { useEffect, useState } from "react";

function PrivateRoutes({component: Component, ...rest}){
    const [values, setValues] = useState({isAuthenticated:true})
    
    useEffect(()=>
        axios.get("/auth/usuarios").then(response=>setValues({isAuthenticated:true})).catch(error=>setValues({isAuthenticated:false}))
    ,[])

    return values.isAuthenticated?
        <Route { ...rest } render = {props =>{return <Template load={rest.load}><Component {...props} /></Template>}}/>
        :<Login/>
}

export default PrivateRoutes