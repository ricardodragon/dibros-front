
import { FcCollaboration, FcMultipleSmartphones, FcBookmark} from "react-icons/fc";
import { Link } from "react-router-dom";
import './menu.css';

function menu(props){
    return (
        <div style={{float:"left", position:"fixed", top:"3.72em"}} className="menu">        
            <input type="checkbox" className="check-menu" id="check-menu"/>    
            <div className="botao-menu">
                <label htmlFor="check-menu" style={{cursor: "pointer", fontWeight:"bolder", fontSize:"30pt"}}>☰</label>
            </div>
            <nav className="menu-conteudo">
                <ul>
                    <li>
                        <Link to={{pathname: '/lojas',state: { from: props.location }}}><FcBookmark size={0}/><span className="menu-legenda">Lojas</span></Link>
                    </li>
                    <li>                    
                        <Link to={{pathname: '/produtos/'+0,state: { from: props.location }}}><FcMultipleSmartphones size={0}/><span className="menu-legenda">Produtos</span></Link>
                    </li>
                    <li>                    
                        <Link  to={{pathname: '/anuncio/',state: { from: props.location }}}><FcMultipleSmartphones size={0}/><span className="menu-legenda">Anunciar</span></Link>
                    </li>
                    <li>
                        <Link to='/meli/contas'><FcCollaboration size={0}/><span className="menu-legenda">Mercado Livre</span></Link>
                    </li>
                    {/* <li>                
                        <Link to='/usuarios'><FcPortraitMode size={0}/><span className="menu-legenda">Usuário</span></Link>
                    </li>                     */}
                </ul>
            </nav>
            
        </div>
    )
}

export default menu