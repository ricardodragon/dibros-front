import { Route } from "react-router-dom";
import Login from "../../pages/Login";

function PrivateRoutes({component: Component, ...rest}){    


    return localStorage.getItem("token")?
        <Route { ...rest } render = {props =><Component {...props}/>}/>:<Login/>
}

export default PrivateRoutes