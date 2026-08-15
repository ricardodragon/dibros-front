import Header from "../Header";
import "./template.css";

function Template(props){
    
    return (
        <div id="dibros" onClick={event=>{document.getElementById("user-menu").style.display="none";[...document.getElementsByClassName("notificacao-check")].forEach(x=>x.checked=false);}}>            
            <Header/>            
            <div id="conteudo">                                
                {props.children}                    
            </div>                        
        </div>
    )
}

export default Template