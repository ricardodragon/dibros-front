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
import AnuncioDetalhes from "../../pages/AnuncioDetalhes";

const Routes = (props)=>(
    
    <BrowserRouter>
        <Switch>
            {/* Estrutra Auth etc */}
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/nova-senha/:token" component={NovaSenha}></Route>
            <Route exact path="/anuncio-detalhes/:id" render={(p) => <AnuncioDetalhes load={props.load} {...p}/>}/>
            <Route exact path="/" component={Anuncios}/>
            {/* <PrivateRoutes exact path="/usuarios" nome="Indentificação usuário" component={Usuarios}/> */}
            <PrivateRoutes exact path="/perfil" load={props.load} nome="Indentificação usuário" component={Perfil}/>

            {/* e-commerce dibros */}
            <PrivateRoutes exact path="/lojas" load={props.load} nome={"Lojas"} component={Lojas}/>
            <PrivateRoutes exact path="/produtos/:id" load={props.load} nome={"Produtos"} component={Produtos}/>
            <PrivateRoutes exact path="/anuncio" load={props.load} nome={"Gerenciamento de anuncios"} component={Anuncio}/>                                 
            <PrivateRoutes exact path="/anuncio-detalhes" load={props.load} nome="Tela de compra do anuncio" component={AnuncioDetalhes}/>

            {/* sub rota do e-commerce meli */}            
            <PrivateRoutes exact path="/meli/contas" load={props.load} nome={"Gerencie suas contas MercadoLivre"} component={Contas}/>                       
            <PrivateRoutes exact path="/meli/anuncios/:id/:sku" load={props.load} nome={"Anúncios"} component={MeliAnuncios}/>                                    
            <PrivateRoutes exact path="/meli/anuncio/:idAnuncio/:userId" load={props.load} nome={"Anúncios - detalhes"} component={MeliAnuncio}/>                        
            <Redirect to="/"/>
        </Switch>
    </BrowserRouter>
)

export default Routes