import { Redirect, Route } from "react-router-dom"
import Template from "../../components/Estrutura/Template"
import { isAuthenticated } from "../auth/auth"

const PrivateRoutes = ({nome, component: Component, ...rest })=>    
    <Route { ...rest } render = {
        props =>{return isAuthenticated()?<Template nome={nome}><Component {...props} /></Template>:<Redirect to={{pathname : "/login", state: {from: props.location}}}/>}
    }/>


export default PrivateRoutes