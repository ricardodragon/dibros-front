import { Redirect, Route } from "react-router-dom"
import Template from "../../components/Estrutura/Template"
import { isAuthenticated } from "../auth/auth"

const PrivateRoutes =  ({ component: Component, ...rest })=>(
    <Route { ...rest } render = {
        props => 
            (
                isAuthenticated()?(
                    <Template><Component {...props} /></Template>
                ):(
                    <Redirect to={{pathname : "/login", state: {from: props.location}}}/>
                )
            )
        }
    />
)

export default PrivateRoutes