
import { FcCollaboration, FcMultipleSmartphones, FcMenu, FcBookmark} from "react-icons/fc";
import { Link } from "react-router-dom";
import './menu.css';

function menu(){
    return (
        <div style={{float:"left", position:"fixed", top:"5.6em"}} className="menu">        
            <input type="checkbox" className="check-menu" id="check-menu"/>    
            <div className="botao-menu">
                <label htmlFor="check-menu" style={{cursor: "pointer", fontWeight:"bolder", fontSize:"20pt"}}>☰</label>
            </div>
            <nav className="menu-conteudo">
                <ul>
                    <li>
                        <Link to={'/lojas'}><FcBookmark size={0}/><span className="menu-legenda">Lojas</span></Link>
                    </li>
                    <li>                    
                        <Link to={'/produtos/'+0}><FcMultipleSmartphones size={0}/><span className="menu-legenda">Produtos</span></Link>
                    </li>
                    <li>                    
                        <Link to={'/anuncio'}><FcMultipleSmartphones size={0}/><span className="menu-legenda">Anunciar</span></Link>
                    </li>
                    <li>
                        <Link to='/meli/contas'><FcCollaboration size={0}/><span className="menu-legenda">Contas</span></Link>
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