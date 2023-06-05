import Header from "../Header"
import Menu from "../Menu"
import "./template.css"

function Template(props){
      
    return (
        <>
            <Header/>            
            <Menu/>            
            <div className="conteudo" >
                <div style={{marginBottom: '100px'}}>
                    <h2>{props.nome}</h2>
                    <hr/>
                    {props.children}                    
                </div>
            </div>                        
        </>
    )
}

export default Template