import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Home from "../../pages/Home"
import Login from "../../pages/Login"
import PrivateRoutes from "./private-routes";
import Usuarios from "../../pages/Usuarios"
import Contas from "../../pages/Contas"
import Anuncios from "../../pages/Anuncios"
import Publicar from "../../pages/Anuncios/Publicar";


const Routes = ()=>(
    <BrowserRouter>
        <Switch>
            <Route exact path="/login" component={Login}></Route>
            <PrivateRoutes exact path={["/","/home"]} component={Home}/>
            <PrivateRoutes exact path="/usuarios" component={Usuarios}/>
            <PrivateRoutes exact path="/contas" component={Contas}/>                       
            <PrivateRoutes exact path="/anuncios/publicar/:idAnuncio/:userId" component={Publicar}/>
            <PrivateRoutes exact path="/anuncios/:id" component={Anuncios}/>
            <Redirect to="/"/>
        </Switch>
    </BrowserRouter>
)

export default Routes