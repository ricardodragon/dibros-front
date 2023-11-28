import { useEffect, useState } from "react";
import Template from "../../estrutura/Template";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";

function AnuncioCompra(props){

    const [values, setValues] = useState({anuncio:{}});
    const host = "http://" + window.location.hostname+":7080";
    const { id } = useParams();

    useEffect(() => 
        axios.get(host+"/loja/anuncio/"+id).then(res => setValues({anuncio:res.data}))
    , [host]);

    return (
        <Template props={props}>
        <div style={{textAlign:"center"}}>
            
            <img src={host+values.anuncio.imagemPath} style={{width:"100%", height:"29em"}}/>            
            <div>
                <h1>Capinha para celulares iphone</h1>
                <div style={{display:"inline-flex", width:"100%", overflowX:"scroll"}}>
                    {values.anuncio.anuncioProdutosDTO&&values.anuncio.anuncioProdutosDTO.filter(x=>x.imagemPath).map(x=><img src={host+x.imagemPath} style={{padding:"0 0.3em 0 0.3em", width:"5em", height:"5em"}} alt="Anúncio"/>)}                    
                </div>
                {values.anuncio.comentariosDTO&&values.anuncio.comentariosDTO.filter(x=>!x.idComentario).map((x, index)=> 
                        <div style={{fontSize:"10pt", width:"100%", paddingLeft:"2%", paddingBottom:"4%"}} key={index}> 
                            <div style={{height:"100%", position:"absolute", float:"left"}}>
                                <img alt="Imagem perfil user" src={x.usuarioDTO.imagemPath?host+x.usuarioDTO.imagemPath:"https://freesvg.org/img/abstract-user-flat-3.png"} style={{borderRadius: "50%", width:"2em", height:"2em"}}/>                                      
                            </div>
                            {x.idUsuario===JSON.parse(localStorage.getItem("usuario")).id&&<div style={{fontWeight:"bolder", float:"right", cursor:"pointer", paddingRight:"3%", paddingLeft:"3%"}} onClick={event=>{event.preventDefault();document.getElementById(x.id+'-'+index).showModal();}}>⋮</div>}
                            
                            <dialog onClick={event=>{event.preventDefault();document.getElementById(x.id+'-'+index).close();}} id={x.id+'-'+index} style={{borderRadius:"0.5%", borderStyle:"none", width:"100%", top:'85%', textAlign:'center'}}>
                                <label style={{width:'100%', cursor:'pointer', padding:"0.5%"}} onClick={event=>{event.stopPropagation();}}>✏️ EDITAR</label><br/>
                                {/* <label style={{width:'100%', cursor:'pointer', padding:"0.5%"}} onClick={event=>{deleteComentario(event, anuncio, x);document.getElementById(x.id+'-'+index).close();event.stopPropagation();}}>❌ EXCLUIR</label> */}
                            </dialog>

                            {x.likeComentariosDTO.filter(lc=>lc.idUsuario===JSON.parse(localStorage.getItem("usuario")).id).length?
                                <p style={{float:"right", paddingRight:"3%", cursor:"pointer"}} >❤️</p>:
                                <p style={{float:"right", paddingRight:"3%", cursor:"pointer"}}>🤍</p>}                                                
                            <div style={{margin:"0 2% 0 2.3em"}}><p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{x.usuarioDTO.nome||x.usuarioDTO.email}</p>{x.texto}</div>
                            <p style={{margin:"0 4% 0 2.3em", display:"inline-block"}}>{x.likeComentariosDTO.length} curtidas</p><label style={{cursor:"pointer", textDecoration:"underline"}}>Responder</label>  
                            
                            {/* {x.expandComentario&&<> */}
                                {/* <input id={x.id+"comentario"} value={x.inputComentario} style={{width:"88%", border:"none", margin:"0 0 2% 2%"}} placeholder="comentario" type="text"/>
                                <button style={{width:"8%", background:"none", border:"none", padding:"0"}} disabled={true}>➡️</button> */}
                            {/* </>}                       */}
                            
                            {x.comentariosDTO&&x.comentariosDTO.length>0&&<p style={{marginBottom:"0", marginLeft:"2.3em", cursor:"pointer"}}>⎯ Ver mais {x.comentariosDTO.length} respostas</p>}
                            
                            {x.comentariosDTO&&x.comentariosDTO.map((cc, i)=>                             
                                <div style={{marginLeft:"2.3em"}}>                   
                                    <div style={{height:"100%", position:"absolute", float:"left"}}>
                                        <img alt="Imagem perfil user" src={host+cc.usuarioDTO.imagemPath} style={{borderRadius: "50%", width:"2em", height:"2em"}}/>                                      
                                    </div>             
                                    <div style={{fontWeight:"bolder", float:"right", cursor:"pointer", paddingRight:"3%", paddingLeft:"3%"}} onClick={event=>{event.preventDefault();document.getElementById(cc.id+'-'+i).showModal();}}>⋮</div>                                
                                    <dialog onClick={event=>{event.preventDefault();document.getElementById(cc.id+'-'+i).close();}} id={cc.id+'-'+i} style={{borderRadius:"0.5%", borderStyle:"none", width:"100%", top:'85%', textAlign:'center'}}>
                                        <label style={{width:'100%', cursor:'pointer', padding:"0.5%"}} onClick={event=>{event.stopPropagation();}}>✏️ EDITAR</label><br/>
                                        <label style={{width:'100%', cursor:'pointer', padding:"0.5%"}}>❌ EXCLUIR</label>
                                    </dialog>
                                    {cc.likeComentariosDTO.filter(lc=>lc.idUsuario===JSON.parse(localStorage.getItem("usuario")).id).length?
                                    <p style={{float:"right", paddingRight:"3%", cursor:"pointer"}} >❤️</p>:
                                    <p style={{float:"right", paddingRight:"3%", cursor:"pointer"}}>🤍</p>}                        
                                    <div style={{margin:"0 2% 0 2.3em"}}><p style={{whiteSpace: "nowrap", fontSize:"8pt", fontWeight:"bolder", textOverflow: "ellipsis", overflow:"hidden", marginBottom:"0"}}>{cc.usuarioDTO.nome||cc.usuarioDTO.email}</p>{cc.texto}</div>
                                </div>
                            )}
                        </div>
                    )}
                Preço : 15,99                
            </div>
        </div>
        </Template>
    );
}

export default AnuncioCompra
