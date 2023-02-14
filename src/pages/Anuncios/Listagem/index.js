import { Button } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FcHighPriority, FcCheckmark } from "react-icons/fc";
import './style.css';
import LabelInput from "../../../estrutura/LabelInput";

function Listagem(){
    const [values, setValues] = useState({anuncios:[]});   
    const dominio = process.env.REACT_APP_MELI_DOMAIN
    let { id, sku } = useParams();        
    
    const setAnuncios = async () => {
        sku=sku=='undefined'?'':sku
        setValues({
            ...values, sku, id, 
            anuncios:(await axios.get(dominio+'/meli/anuncios/list/'+id+'?sku='+sku)).data
        })
    };    

    useEffect(() => setAnuncios() , [id, sku]);   

    return (
        <>
            <ul>
                <div>      
                    <LabelInput disabled={false} label="Anuncios diversos" id="diversos" type="text" onChange={diversos => setValues({...values, diversos})}/>                    
                    <button className="btn btn-sm btn-primary" onClick={async event=>{event.preventDefault(); setValues({...values,anuncios:(await axios.get(dominio+'/meli/anuncios?q='+values.diversos)).data.map(x=>{ return {body:x}})})}}>Buscar</button>
                    <Link to={"/anuncios/detalhes/"+0+"/"+0} className="btn btn-sm btn-primary">
                            Publicar
                    </Link>                    
                </div>
                {   
                    values.anuncios.map((value, index) => {
                        return (
                            
                            <div key={index} className="card m-4" style={{maxWidth: "540px;"}}>  
                                <div style={{display: "flex",alignItems: "center"}} onClick={event=>{event.preventDefault();window.open(value.body.permalink);}}>
                                    <figcaption className="foto-lista-anuncio">
                                        <img src={value.body.thumbnail} alt=""  />                                    
                                    </figcaption>                                                                       
                                    <span style={{display:"inline"}} className="h5 p-4">{value.body.title}</span>                                    
                                    <span className="h5">{value.body.status!="active"?<FcHighPriority/>:<FcCheckmark/>}</span>
                                </div>
                                <div className="card-body">                                    
                                    <div className="row">
                                        <div className="col-sm-12 col-md-3">                                            
                                            <label>Preço</label>&nbsp;<span style={{fontWeight:"bold"}}>{value.body.price}</span>
                                        </div>
                                        <div className="col-sm-12 col-md-3">
                                            <label>Quantidade</label>&nbsp;<span style={{fontWeight:"bold"}}>{value.body.available_quantity}</span>                                            
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <label>Última alteração</label>&nbsp;<span style={{fontWeight:"bold"}}>{new Date(value.body.last_updated).toLocaleString()}</span>                                            
                                        </div>
                                    </div>                                    
                                    
                                    <div className="footer-card-link" style={{boxSizing:"content-box", padding:"1%"}}>
                                        <Link to={"/anuncios/detalhes/"+value.body.id+"/"+(value.body.seller_id?value.body.seller_id:0)}>
                                            <Button className="btn btn-primary btn-sm">Detalhes</Button>
                                        </Link> 
                                        {value.body.status=="active"?<button onClick={event=>{event.preventDefault();axios.put(dominio+'/meli/anuncios/'+value.body.seller_id+'/'+value.body.id, {status:"paused"}).then(r=>alert("Deu"))}} className="btn btn-warning btn-sm">Pausar</button>:<button className="btn btn-info btn-sm" onClick={event=>{event.preventDefault();axios.put(dominio+'/meli/anuncios/'+value.body.seller_id+'/'+value.body.id, {status:"active"}).then(r=>alert("Deu"))}}>Ativar</button>}                                                                             
                                        <button onClick={event=>{event.preventDefault();axios.put(dominio+'/meli/anuncios/'+value.body.seller_id+'/'+value.body.id, {status:"closed"}).then(r=>axios.put(dominio+'/meli/anuncios/'+value.body.seller_id+'/'+value.body.id, {deleted:"true"}).then(r=>alert("Deu")))}} className="btn btn-danger btn-sm">Excluir</button>   
                                    </div>
                                </div>
                            
                            </div>
                        )
                    })
                }
            </ul>
        </>
    );
}

export default Listagem