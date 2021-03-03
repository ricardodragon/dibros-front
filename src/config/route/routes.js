import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Home from "../../pages/Home"
import Login from "../../pages/Login"
import PrivateRoutes from "./private-routes";
import Usuarios from "../../pages/Usuarios"
import Contas from "../../pages/Contas"
import Template from "../../components/Template";

const Routes = ()=>(
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/login" component={Login}></Route>
            <PrivateRoutes exact path="/usuarios">
                <Template><Usuarios></Usuarios></Template>
            </PrivateRoutes>
            <PrivateRoutes exact path="/contas">
                <Template><Contas></Contas></Template>
            </PrivateRoutes>
            <Redirect to="/"/>
        </Switch>
    </BrowserRouter>
)

export default Routes