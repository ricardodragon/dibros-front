
import { 
    FcHome, FcCollaboration, FcAssistant, FcBookmark, 
    FcMultipleSmartphones, FcPortraitMode, FcShipped,
    FcBullish,  FcLineChart, FcMenu
} from "react-icons/fc";
import { Link } from "react-router-dom";
import './menu.css';

function menu(){
    return (
        <div>
            <input type="checkbox" className="check-menu" id="check-menu"/>
            <div className="botao-menu">
                <label htmlFor="check-menu"><FcMenu size={35} style={{cursor: "pointer"}} htmlFor="check-menu"/></label>
            </div>
            <nav className="menu-conteudo">
                <ul>
                    <li>
                        <Link to='/'><FcHome size={0}/><span className="menu-legenda">Home</span></Link> 
                    </li>
                    <li>
                        <Link to='/contas'><FcCollaboration size={0}/><span className="menu-legenda">Contas</span></Link>
                    </li>
                    <li>
                        <Link to='/anuncios/0'><FcBookmark size={0}/><span className="menu-legenda">Anúncios</span></Link>
                    </li>
                    <li>                
                        <Link to=''><FcMultipleSmartphones size={0}/><span className="menu-legenda">Produtos</span></Link>
                    </li>
                    <li>                
                        <Link to='/usuarios'><FcPortraitMode size={0}/><span className="menu-legenda">Usuário</span></Link>
                    </li>
                    <li>
                        <Link to=''><FcAssistant size={0}/><span className="menu-legenda">Perguntas</span></Link>
                    </li>
                    <li>
                        <Link to=''><FcShipped size={0}/><span className="menu-legenda">Fretes</span></Link>
                    </li>
                    <li>                
                        <Link to=''><FcBullish size={0}/><span className="menu-legenda">Metas</span></Link>
                    </li>
                    <li>                
                        <Link to=''><FcLineChart size={0}/><span className="menu-legenda">Dashboard</span></Link>
                    </li>
                    <li>
                        <Link to=''><FcHome size={0}/><span className="menu-legenda">Home</span> </Link>
                    </li>
                    <li>
                        <Link to=''><FcCollaboration size={0}/><span className="menu-legenda">Contas</span></Link>
                    </li>
                    <li>
                        <Link to=''><FcBookmark size={0}/><span className="menu-legenda">Anúncios</span></Link>
                    </li>
                    <li>                
                        <Link to=''><FcMultipleSmartphones size={0}/><span className="menu-legenda">Produtos</span></Link>
                    </li>
                    <li>                
                        <Link to=''><FcPortraitMode size={0}/><span className="menu-legenda">Usuário</span></Link>
                    </li>
                    <li>
                        <Link to=''><FcAssistant size={0}/><span className="menu-legenda">Perguntas</span></Link>
                    </li>
                    <li>
                        <Link to=''><FcShipped size={0}/><span className="menu-legenda">Fretes</span></Link>
                    </li>
                    <li>                
                        <Link to=''><FcBullish size={0}/><span className="menu-legenda">Metas</span></Link>
                    </li>
                    <li>                
                        <Link to=''><FcLineChart size={0}/><span className="menu-legenda">Dashboard</span></Link>
                    </li>
                    <li>
                        <Link to=''><FcHome size={0}/><span className="menu-legenda">Home</span> </Link>
                    </li>
                    <li>
                        <Link to=''><FcCollaboration size={0}/><span className="menu-legenda">Contas</span></Link>
                    </li>
                    <li>
                        <Link to=''><FcBookmark size={0}/><span className="menu-legenda">Anúncios</span></Link>
                    </li>
                    <li>                
                        <Link to=''><FcMultipleSmartphones size={0}/><span className="menu-legenda">Produtos</span></Link>
                    </li>
                    <li>                
                        <Link to=''><FcPortraitMode size={0}/><span className="menu-legenda">Usuário</span></Link>
                    </li>
                    <li>
                        <Link to=''><FcAssistant size={0}/><span className="menu-legenda">Perguntas</span></Link>
                    </li>
                    <li>
                        <Link to=''><FcShipped size={0}/><span className="menu-legenda">Fretes</span></Link>
                    </li>
                    <li>                
                        <Link to=''><FcBullish size={0}/><span className="menu-legenda">Metas</span></Link>
                    </li>
                    <li>                
                        <Link to=''><FcLineChart size={0}/><span className="menu-legenda">Dashboard</span></Link>
                    </li>
                    <li>
                        <Link to=''><FcHome size={0}/><span className="menu-legenda">Home</span> </Link>
                    </li>
                    <li>
                        <Link to=''><FcCollaboration size={0}/><span className="menu-legenda">Contas</span></Link>
                    </li>
                    <li>
                        <Link to=''><FcBookmark size={0}/><span className="menu-legenda">Anúncios</span></Link>
                    </li>
                    <li>                
                        <Link to=''><FcMultipleSmartphones size={0}/><span className="menu-legenda">Produtos</span></Link>
                    </li>
                    <li>                
                        <Link to=''><FcPortraitMode size={0}/><span className="menu-legenda">Usuário</span></Link>
                    </li>
                    <li>
                        <Link to=''><FcAssistant size={0}/><span className="menu-legenda">Perguntas</span></Link>
                    </li>
                    <li>
                        <Link to=''><FcShipped size={0}/><span className="menu-legenda">Fretes</span></Link>
                    </li>
                    <li>                
                        <Link to=''><FcBullish size={0}/><span className="menu-legenda">Metas</span></Link>
                    </li>
                    <li>                
                        <Link to=''><FcLineChart size={0}/><span className="menu-legenda">Dashboard</span></Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default menu