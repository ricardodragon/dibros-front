import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Home from "../../pages/Home"
import Login from "../../pages/Login"
import PrivateRoutes from "./private-routes";
import Usuarios from "../../pages/Usuarios"
import Contas from "../../pages/Contas"
import Produtos from "../../pages/Produtos";
// import Detalhes from "../../pages/Anuncios/Detalhes";
import Listagem from "../../pages/Anuncios/Listagem";

const Routes = ()=>(
    <BrowserRouter>
        <Switch>
            <Route exact path="/login" component={Login}></Route>
            <PrivateRoutes exact path={["/","/home"]} component={Home} nome={"Seja bem vindo a FlexConnection!"}/>
            <PrivateRoutes exact path="/usuarios" nome="Indentificação usuário" component={Usuarios}/>
            <PrivateRoutes exact path="/contas" nome={"Gerencie suas contas MercadoLivre"} component={Contas}/>                       
            {/* <PrivateRoutes exact path="/anuncios/detalhes/:idAnuncio/:userId" nome={"Anúncios - detalhes"} component={Detalhes}/>             */}
            <PrivateRoutes exact path="/anuncios/:id/:sku" nome={"Anúncios"} component={Listagem}/>            
            <PrivateRoutes exact path="/produtos" nome={"Produtos"} component={Produtos}/>
            <Redirect to="/"/>
        </Switch>
    </BrowserRouter>
)

export default Routes