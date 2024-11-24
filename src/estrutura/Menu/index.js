
import { FcCollaboration, FcMultipleSmartphones, FcBookmark} from "react-icons/fc";
import { Link } from "react-router-dom";
import './menu.css';

function menu(){
    return (
        <div className="menu">        
            <label className="botao-menu" htmlFor="check-menu">☰</label>
            <input type="checkbox" className="check-menu" id="check-menu"/>    
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