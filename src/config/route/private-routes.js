import { Redirect, Route } from "react-router-dom"
import Template from "../../estrutura/Template"
import { isAuthenticated } from "../auth/auth"

const PrivateRoutes = ({component: Component, ...rest })=>    
    <Route { ...rest } render = {
        props =>{return isAuthenticated()?<Template><Component {...props} /></Template>:<Redirect to={{pathname : "/login", state: {from: props.location}}}/>}
    }/>


export default PrivateRoutes