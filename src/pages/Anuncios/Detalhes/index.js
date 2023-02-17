import "./detalhes.css"

function Detalhes(){
    
    return (   
        <div style={{ position: "absolute", width:"100%", height:"100%", backgroundColor:"white", zIndex:"1000" }}>
            <div className="spinner-border p-5" style={{width: "3rem",height: "3rem", margin:"10% 0 0 30%"}} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>                 
        </div>                                                                                                                                                                                   
    )
}
export default Detalhes