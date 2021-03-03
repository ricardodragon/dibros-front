import { Redirect, Route } from "react-router-dom"
import { isAuthenticated } from "../auth/auth"

const PrivateRoutes =  ({ component: Component, ...rest })=>(
    <Route { ...rest } render = {props => 
        (
            isAuthenticated()?(
                <Component {...props} />
            ):(
                <Redirect to={{pathname : "/login", state: {from: props.location}}}/>
            )
        )}
    />
)

export default PrivateRoutes