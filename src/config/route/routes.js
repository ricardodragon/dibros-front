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
import axios from "../api/api";
import { useEffect, useState } from "react";

function Routes(props){    
    const [values, setValues] = useState({isAuthenticated:true})

    useEffect(()=>
        axios.get("/auth/usuarios").then(
            response=>{
                console.log("oi")
                localStorage.setItem('usuario', JSON.stringify(response.data));
                setValues({isAuthenticated:true})
            }
        ).catch(error=>
            setValues({isAuthenticated:false})
        )
    ,[])

    return(
        <BrowserRouter>
            <Switch>
                {/* Estrutra Auth etc */}
                <Route exact path="/login" component={Login}></Route>
                <Route exact path="/nova-senha/:token" component={NovaSenha}></Route>
                <Route exact path="/" component={Feed}/>            
                <Route exact path="/loja/:id" component={LojaDetalhes}/>            
                <Route exact path="/anuncio-detalhes/:id" render={(p) => <AnuncioDetalhes load={props.load} {...p}/>}/>

                {/* e-commerce dibros */}
                <PrivateRoutes exact isAuthenticated={values.isAuthenticated} path="/perfil/:id" load={props.load} nome="Indentificação usuário" component={DetalharPerfil}/>
                <PrivateRoutes exact isAuthenticated={values.isAuthenticated} path="/perfil/editar/:id" load={props.load} nome="Indentificação usuário" component={EditarPerfil}/>
                <PrivateRoutes exact isAuthenticated={values.isAuthenticated} path="/lojas" load={props.load} nome={"Lojas"} component={CriarLojas}/>
                <PrivateRoutes exact isAuthenticated={values.isAuthenticated} path="/produtos/:id" load={props.load} nome={"Produtos"} component={CriarProdutos}/>
                <PrivateRoutes exact isAuthenticated={values.isAuthenticated} path="/anuncio" load={props.load} nome={"Gerenciamento de anuncios"} component={Anuncio}/>                                 

                {/* sub rota do e-commerce meli */}            
                <PrivateRoutes exact isAuthenticated={values.isAuthenticated} path="/meli/contas" load={props.load} nome={"Gerencie suas contas MercadoLivre"} component={Contas}/>                       
                <PrivateRoutes exact isAuthenticated={values.isAuthenticated} path="/meli/anuncios/:id/:sku" load={props.load} nome={"Anúncios"} component={MeliAnuncios}/>                                    
                <PrivateRoutes exact isAuthenticated={values.isAuthenticated} path="/meli/anuncio/:idAnuncio/:userId" load={props.load} nome={"Anúncios - detalhes"} component={MeliAnuncio}/>                        
                <Redirect to="/"/>
            </Switch>
        </BrowserRouter>
    )
}

export default Routes