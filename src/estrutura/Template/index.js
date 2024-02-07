import Header from "../Header"
import Menu from "../Menu"
import "./template.css"

function Template(props){
    
    return (
        <div>            
            <Header/>            
            <Menu/>            
            <div className="conteudo" onClick={event=>{document.getElementById("check-menu").checked=false;document.getElementById("user-menu").style.display="none"}}>                
                {props.load&&<div style={{position:"absolute", width:"100%", height:"100%", backgroundColor:"rgba(173, 181, 189, 50%)", zIndex:"1000" }}>
                    <div className="spinner-border p-1" style={{width: "3rem",height: "3rem", margin:"18% 0 0 47%"}} role="status"></div>                 
                </div>}
                {props.children}                    
            </div>                        
        </div>
    )
}

export default Template