import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Feed from "../../pages/Feed";
import Login from "../../pages/Login";
import CriarLojas from "../../pages/Loja/CriarLojas";
import LojaDetalhes from "../../pages/Loja/LojaDetalhes";
import Contas from "../../pages/Meli/Contas";
import DetalharPerfil from "../../pages/Perfil/DetalharPerfil";
import EditarPerfil from "../../pages/Perfil/EditarPerfil";
import CriarProdutos from "../../pages/Produto/CriarProdutos";
import MeliFeed from "../../pages/Meli/Feed";
import PrivateRoutes from "./private-routes";
import Carrinho from "../../pages/Carrinho";
import ConversaListar from "../../pages/Conversa/ConversaListar";
import ConversaDetalhes from "../../pages/Conversa/ConversaDetalhes";
import PedidoDetalhes from "../../pages/Pedido/PedidoDetalhes";
import ListarPedidos from "../../pages/Pedido/ListarPedidos";
import Cadastro from "../../pages/Cadastro";
import NovaSenha from "../../pages/NovaSenha";

function Routes(props){    

    return(
        <BrowserRouter>
            <Switch>
                {/* Estrutra Auth etc */}
                <Route exact path="/login" component={Login}></Route>
                <Route exact path="/cadastro/:token" component={Cadastro}></Route>
                <Route exact path="/nova-senha/:token" component={NovaSenha}></Route>
                <Route exact path="/" component={Feed}/>                                                        

                {/* e-commerce dibros */}
                <PrivateRoutes exact path="/perfil/:id" load={props.load} nome="Indentificação usuário" component={DetalharPerfil}/>
                <PrivateRoutes exact path="/perfil/editar/:id" load={props.load} nome="Indentificação usuário" component={EditarPerfil}/>
                <PrivateRoutes exact path="/lojas" load={props.load} nome={"Lojas"} component={CriarLojas}/>
                <PrivateRoutes exact path="/loja/:id" load={props.load} component={LojaDetalhes}/>
                <PrivateRoutes exact path="/produtos/:id" load={props.load} nome={"Produtos"} component={CriarProdutos}/>
                <PrivateRoutes exact path="/carrinho" load={props.load} nome={"Carrinho"} component={Carrinho}/>
                <PrivateRoutes exact path="/conversa" load={props.load} nome={"ConversaListar"} component={ConversaListar}/>
                <PrivateRoutes exact path="/conversa-detalhes/:id" load={props.load} nome={"ConversaDetalhes"} component={ConversaDetalhes}/>
                <PrivateRoutes exact path="/pedidos" load={props.load} nome={"ListarPedidos"} component={ListarPedidos}/>
                <PrivateRoutes exact path="/pedido-detalhes/:id" load={props.load} nome={"PedidoDetalhes"} component={PedidoDetalhes}/>
                
                {/* sub rota do e-commerce meli */}            
                <PrivateRoutes exact path="/meli/contas" load={props.load} nome={"Gerencie suas contas MercadoLivre"} component={Contas}/>                       
                <PrivateRoutes exact path="/meli/feed" load={props.load} nome={"Anúncios - detalhes"} component={MeliFeed}/>                        
                <Redirect to="/"/>
            </Switch>
        </BrowserRouter>
    )
}

export default Routes