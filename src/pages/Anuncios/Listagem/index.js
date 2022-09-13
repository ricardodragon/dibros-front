import { Button } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Contas from "../../../components/Contas";
import LabelInput from "../../../components/Estrutura/LabelInput";

import './style.css';

function Listagem(){
    const [values, setValues] = useState({anuncios:[]});   
    const dominio = "http://DESKTOP-DS0K2GT"
    
    const setAnuncios = async () => setValues({
        ...values,
        anuncios:values.anuncios.concat((await axios.get(dominio+':8080/meli/anuncios')).data)
    });    

    useEffect(() => { setAnuncios() }, []);

    const formatDate = function(string){
        console.log(string)
        var optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };        
        return new Date(string).toLocaleTimeString([], optionsDate);
    }

    return (
        <>
            <ul>
                <div>
                    <Contas onChange={(contas) => setValues({...values, contas:contas})}/>
                    <Link to={"/anuncios/detalhes/"+0+"/"+0} className="footer-card-link btn btn-sm btn-primary">
                            Publicar
                    </Link>
                </div>
                {   
                    values.anuncios.map((value, index) => {
                        return (
                            
                            <div key={index} className="card mb-3" style={{maxWidth: "540px;"}}>  
                                <div style={{display: "flex",alignItems: "center"}} onClick={event=>{event.preventDefault();window.open(value.body.permalink);}}>
                                    <figcaption className="foto-lista-anuncio">
                                        <img src={value.body.thumbnail} alt=""  />                                    
                                    </figcaption>                                                                       
                                    <span style={{display:"inline"}} className="h5">{value.body.title}</span>
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
                                        <Link to={"/anuncios/detalhes/"+value.body.id+"/"+value.body.seller_id}>
                                            <Button className="btn btn-primary btn-sm">Detalhes</Button>
                                        </Link>                                                                                
                                        <button className="btn btn-danger btn-sm">Excluir</button>   
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