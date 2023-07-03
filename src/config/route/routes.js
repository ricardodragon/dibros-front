import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import PrivateRoutes from "./private-routes";
import Login from "../../pages/Login"
import Produtos from "../../pages/Produtos";
import Contas from "../../pages/Meli/Contas"
import MeliAnuncios from "../../pages/Meli/Anuncios";
import MeliAnuncio from "../../pages/Meli/Anuncio";
import Anuncios from "../../pages/Anuncios";
import Anuncio from "../../pages/Anuncio";
import NovaSenha from "../../pages/NovaSenha";
import Lojas from "../../pages/Lojas";
import Perfil from "../../pages/Perfil";
import AnuncioCompra from "../../pages/AnuncioCompra";

const Routes = ()=>(
    <BrowserRouter>
        <Switch>
            {/* Estrutra Auth etc */}
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/nova-senha/:token" component={NovaSenha}></Route>
            {/* <PrivateRoutes exact path="/usuarios" nome="Indentificação usuário" component={Usuarios}/> */}
            <PrivateRoutes exact path="/perfil" nome="Indentificação usuário" component={Perfil}/>

            {/* e-commerce dibros */}
            <PrivateRoutes exact path="/lojas" nome={"Lojas"} component={Lojas}/>
            <PrivateRoutes exact path="/produtos/:id" nome={"Produtos"} component={Produtos}/>
            <PrivateRoutes exact path={["/"]} nome={"dibros-store"} component={Anuncios}/>
            <PrivateRoutes exact path="/anuncio" nome={"Gerenciamento de anuncios"} component={Anuncio}/>            
            <PrivateRoutes exact path="/anuncio-compra/:id" nome={""} component={AnuncioCompra}/>            

            {/* sub rota do e-commerce meli */}            
            <PrivateRoutes exact path="/meli/contas" nome={"Gerencie suas contas MercadoLivre"} component={Contas}/>                       
            <PrivateRoutes exact path="/meli/anuncios/:id/:sku" nome={"Anúncios"} component={MeliAnuncios}/>                                    
            <PrivateRoutes exact path="/meli/anuncio/:idAnuncio/:userId" nome={"Anúncios - detalhes"} component={MeliAnuncio}/>                        
            <Redirect to="/"/>
        </Switch>
    </BrowserRouter>
)

export default Routes