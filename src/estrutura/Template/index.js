import Header from "../Header";
import "./template.css";

function Template(props){
    
    return (
        <div onClick={event=>{console.log("template");[...document.getElementsByClassName("notificacao-check")].forEach(x=>x.checked=false)}}>            
            <Header/>            
            <div id="conteudo">                                
                {props.children}                    
            </div>                        
        </div>
    )
}

export default Template