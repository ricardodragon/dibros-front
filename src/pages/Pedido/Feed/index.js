import "./feed.css";
import ListarPedidos from "./ListarPedidos";
import ListarVendas from "./ListarVendas";

function Feed(props) {

    return (<>
        <a className="menu-feed-pedidos" href="/pedidos/#pedidos"><span className='feed-menu-pedidos-opaciti'>🏬 pedidos</span><span className='feed-menu-pedidos'>🏬 pedidos</span></a>
        <a href="/pedidos/#vendas" className="menu-feed-pedidos"><span className='feed-menu-pedidos-opaciti'>📦 vendas</span><span className='feed-menu-pedidos'>📦 vendas</span></a>           
        
        <div className="tabs-feed-pedidos">            
            <section id="pedidos" className="tab-pedidos">
                <ListarPedidos/>
            </section>
            <section id="vendas" className="tab-pedidos">
                <ListarVendas/>
            </section>  
        </div>
    </>)
}
export default Feed