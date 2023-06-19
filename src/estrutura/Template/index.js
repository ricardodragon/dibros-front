import Header from "../Header"
import Menu from "../Menu"
import "./template.css"

function Template(props){
      
    return (
        <div>
            <Header/>            
            <Menu/>            
            <div className="conteudo" onClick={event=>{document.getElementById("check-menu").checked=false;}}>
                <div style={{marginBottom: '100px'}}>
                    <h2>{props.nome}</h2>
                    <hr/>
                    {props.children}                    
                </div>
            </div>                        
        </div>
    )
}

export default Template