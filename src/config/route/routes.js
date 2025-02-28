import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import PrivateRoutes from "./private-routes";
import Login from "../../pages/Login"
import Contas from "../../pages/Meli/Contas"
import MeliAnuncios from "../../pages/Meli/Anuncios";
import MeliAnuncio from "../../pages/Meli/Anuncio";
import NovaSenha from "../../pages/NovaSenha";
import EditarPerfil from "../../pages/Perfil/EditarPerfil";
import Feed from "../../pages/Feed";
import AnuncioDetalhes from "../../pages/Anuncio/AnuncioDetalhes";
import CriarProdutos from "../../pages/Produto/CriarProdutos";
import Anuncio from "../../pages/Anuncio/CriarAnuncios";
import CriarLojas from "../../pages/Loja/CriarLojas";
import LojaDetalhes from "../../pages/Loja/LojaDetalhes";
import DetalharPerfil from "../../pages/Perfil/DetalharPerfil";

function Routes(props){    

    return(
        <BrowserRouter>
            <Switch>
                {/* Estrutra Auth etc */}
                <Route exact path="/login" component={Login}></Route>
                <Route exact path="/nova-senha/:token" component={NovaSenha}></Route>
                <Route exact path="/" component={Feed}/>                                        
                <Route exact path="/anuncio-detalhes/:id" render={(p) => <AnuncioDetalhes load={props.load} {...p}/>}/>

                {/* e-commerce dibros */}
                <PrivateRoutes exact path="/perfil/:id" load={props.load} nome="Indentificação usuário" component={DetalharPerfil}/>
                <PrivateRoutes exact path="/perfil/editar/:id" load={props.load} nome="Indentificação usuário" component={EditarPerfil}/>
                <PrivateRoutes exact path="/lojas" load={props.load} nome={"Lojas"} component={CriarLojas}/>
                <PrivateRoutes exact path="/loja/:id" component={LojaDetalhes}/>
                <PrivateRoutes exact path="/produtos/:id" load={props.load} nome={"Produtos"} component={CriarProdutos}/>
                <PrivateRoutes exact path="/anuncio" load={props.load} nome={"Gerenciamento de anuncios"} component={Anuncio}/>                                 

                {/* sub rota do e-commerce meli */}            
                <PrivateRoutes exact path="/meli/contas" load={props.load} nome={"Gerencie suas contas MercadoLivre"} component={Contas}/>                       
                <PrivateRoutes exact path="/meli/anuncios/:id/:sku" load={props.load} nome={"Anúncios"} component={MeliAnuncios}/>                                    
                <PrivateRoutes exact path="/meli/anuncio/:idAnuncio/:userId" load={props.load} nome={"Anúncios - detalhes"} component={MeliAnuncio}/>                        
                <Redirect to="/"/>
            </Switch>
        </BrowserRouter>
    )
}

export default Routes