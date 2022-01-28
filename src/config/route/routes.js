import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Home from "../../pages/Home"
import Login from "../../pages/Login"
import PrivateRoutes from "./private-routes";
import Usuarios from "../../pages/Usuarios"
import Contas from "../../pages/Contas"
import Produtos from "../../pages/Produtos";
import Detalhes from "../../pages/Anuncios/Detalhes";
import Listagem from "../../pages/Anuncios/Listagem";


const Routes = ()=>(
    <BrowserRouter>
        <Switch>
            <Route exact path="/login" component={Login}></Route>
            <PrivateRoutes exact path={["/","/home"]} component={Home}/>
            <PrivateRoutes exact path="/usuarios" component={Usuarios}/>
            <PrivateRoutes exact path="/contas" component={Contas}/>                       
            <PrivateRoutes exact path="/anuncios/detalhes/:idAnuncio/:userId" component={Detalhes}/>
            {/* <PrivateRoutes exact path="/anuncios/editar/:idAnuncio/:userId" component={Publicar}/> */}
            <PrivateRoutes exact path="/anuncios/:id" component={Listagem}/>
            <PrivateRoutes exact path="/produtos" component={Produtos}/>
            <Redirect to="/"/>
        </Switch>
    </BrowserRouter>
)

export default Routes