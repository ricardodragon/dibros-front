import axios from "../../../../config/api/api";
import { useEffect, useState } from "react";
import './style.css';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function ListarAnuncios(){
    const [values, setValues] = useState({anuncios:[], contas:[], conta:0});   
    const { id } = useParams()

    useEffect(() =>         
        axios.get('/meli/contas/all').then(r=> {
            axios.get('/meli/anuncios/list/'+id+"?sku=").then(res => {
                setValues({contas:r.data, anuncios:res.data, conta:id})
            })
        })
    , [id]);   

    var buscar = event => {
        event.preventDefault();
        axios.get('/meli/anuncios/list/'+values.conta+"?sku=").then(res => {
            setValues({...values, anuncios:res.data})
        })
    }

    return (
        <div className="anuncios-conteudo">
            <header className="meli-anuncios-header">    
                <form onSubmit={buscar}>
                    <select id="meli-conta-select" style={{display:"inline", width:"30%", marginRight:'2%'}} value={values.conta} onChange={(event)=>setValues({...values, conta:event.target.value})}>                                                            
                        {/* <option key={0} value={0}>selecione a conta</option> */}
                        {/* <option key={1} value={0}>qualquer anuncio</option> */}
                        {values.contas.map(c=><option key={c.id} value={c.id}>{c.nickname}</option>)}
                    </select>  
                    <input type="text" style={{marginRight:'2%'}}/>
                    <input type="submit" value="🔍"/>
                </form>
            </header>
            <div >
                {   
                    values.anuncios.map((value, index) => {
                        return (                            
                            <div key={index} className="card-anuncio">
                                <header style={{padding: "2%"}}>
                                    <a style={{fontWeight:"bolder"}} href={'/meli/anuncio/'+value.body.id+'/'+(value.body.seller_id?value.body.seller_id:0)} target="_blank" rel="noreferrer" >{value.body.title}</a>                                                                                                  
                                </header>
                                <p className="teste">
                                    <img src={value.body.thumbnail} alt="Anúncio" className='img-anuncio' />
                                </p>                                
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
                                        <button onClick={event=>{event.preventDefault();window.open(value.body.permalink)}} className="btn btn-warning btn-sm">Abrir no Mercado Live</button>                                    
                                        {value.body.status==="active"?<button onClick={event=>{event.preventDefault();axios.put('/meli/anuncios/'+value.body.seller_id+'/'+value.body.id, {status:"paused"}).then(r=>alert("Deu"))}} className="btn btn-warning btn-sm">Pausar</button>:<button className="btn btn-info btn-sm" onClick={event=>{event.preventDefault();axios.put('/meli/anuncios/'+value.body.seller_id+'/'+value.body.id, {status:"active"}).then(r=>alert("Deu"))}}>Ativar</button>}                                                                             
                                        <button onClick={event=>{event.preventDefault();axios.put('/meli/anuncios/'+value.body.seller_id+'/'+value.body.id, {status:"closed"}).then(r=>axios.put('/meli/anuncios/'+value.body.seller_id+'/'+value.body.id, {deleted:"true"}).then(r=>alert("Deu")))}} className="btn btn-danger btn-sm">Excluir</button>   
                                    </div>                                    
                                </div>                            
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default ListarAnuncios