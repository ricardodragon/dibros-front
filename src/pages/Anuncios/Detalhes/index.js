import { useState } from "react"
import { useParams } from "react-router-dom";
import "./detalhes.css"

function Detalhes(){

    const {userId} = useParams(); 

    const [values, setValues] = useState({anuncio:{title:'', price:0, available_quantity:0, variations:[], attributes:[], category_id:''}, disable: true, loader:true});                  
    
    const habilitarEdicao = event=>{event.preventDefault();setValues({...values, editar:true, disabled:!values.disabled})}
    const habilitarReplica = event=>{event.preventDefault();setValues({...values, editar:false, disabled:!values.disabled})}    

    return (               
        values.loader?<div style={{ position: "absolute", width:"100%", height:"100%", backgroundColor:"white", zIndex:"1000" }}>
            <div className="spinner-border p-5" style={{width: "3rem",height: "3rem", margin:"10% 0 0 30%"}} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>                 
        </div>:   
        <>
            <form onSubmit={event => {event.preventDefault();}}> 
                <div className="d-flex justify-content-end">
                    {!values.disabled?<button className="btn btn-secondary" onClick={event=>{event.preventDefault();}}>Redefinir</button>:null}            
                    {values.disabled?<button className="btn btn-primary" onClick={habilitarReplica}>Replicar</button>:null}                    
                    {values.disabled&&userId!==0&&!values.editar?<button className="btn btn-info" onClick={habilitarEdicao}> Editar </button>:null}  
                </div>            
            </form>
        </>
    )
}
export default Detalhes