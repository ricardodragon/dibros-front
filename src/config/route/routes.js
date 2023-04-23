import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import PrivateRoutes from "./private-routes";
import Home from "../../pages/Home"
import Login from "../../pages/Login"
import Usuarios from "../../pages/Usuarios"
import Produtos from "../../pages/Produtos";
import Contas from "../../pages/Meli/Contas"
import MeliAnuncios from "../../pages/Meli/Anuncios";
import MeliAnuncio from "../../pages/Meli/Anuncio";
import Anuncios from "../../pages/Anuncios";
import Template from "../../estrutura/Template";

const Routes = ()=>(
    <BrowserRouter>
        <Switch>
            {/* Estrutra Auth etc */}
            <Route exact path="/login" component={Login}></Route>
            <PrivateRoutes exact path={["/","/home"]} component={Home} nome={"Seja bem vindo a dibros-store!"}/>
            <PrivateRoutes exact path="/usuarios" nome="Indentificação usuário" component={Usuarios}/>
            
            {/* e-commerce dibros */}
            <PrivateRoutes exact path="/produtos" nome={"Produtos"} component={Produtos}/>
            
            {/* sub rota do e-commerce meli */}            
            <PrivateRoutes exact path="/meli/contas" nome={"Gerencie suas contas MercadoLivre"} component={Contas}/>                       
            <PrivateRoutes exact path="/meli/anuncios/:id/:sku" nome={"Anúncios"} component={MeliAnuncios}/>                                    
            <PrivateRoutes exact path="/meli/anuncio/:idAnuncio/:userId" nome={"Anúncios - detalhes"} component={MeliAnuncio}/>            
            <Template nome={"Anuncios dibros-store"}><Route exact path="/anuncios" nome={"Anuncios dibros-store"} component={Anuncios}></Route></Template>
            <Redirect to="/"/>
        </Switch>
    </BrowserRouter>
)

export default Routes