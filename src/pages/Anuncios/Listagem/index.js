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
                                <div style={{display: "flex",alignItems: "center"}}>
                                    <figcaption className="foto-lista-anuncio">
                                        <img src={value.body.thumbnail} alt=""  />                                    
                                    </figcaption>                                                                       
                                    <span style={{display:"inline"}} className="h5">{value.body.title}</span>
                                </div>
                                <div className="card-body">
                                    <LabelInput disabled={true} className="form-control-plaintext" readonly={true} value={value.body.price} label="Preço : " id="preco" type="number"/>                                                                                                        
                                    <LabelInput disabled={true} className="form-control-plaintext" readonly={true} value={value.body.available_quantity} label="Quantidade: " id="qtd" type="number"/>                                                                                                        
                                    <LabelInput disabled={true} className="form-control-plaintext" readonly={true} value={formatDate(value.body.last_updated)} label="Data/Hora ultima alteração: " id="data" type="text"/>                                                                                                                                         
                                    
                                    <div className="footer-card-link" style={{boxSizing:"content-box", padding:"1%"}}>
                                        <Link to={"/anuncios/detalhes/"+value.body.id+"/"+value.body.seller_id}>
                                            <Button size="small" color="primary">
                                                Detalhes
                                            </Button>        
                                        </Link>                                        
                                        <Button 
                                            size="small" style={{color:"yellow"}}
                                            target="_blank" rel="noreferrer"                                                
                                            href={value.body.permalink}>                                            
                                                Mercado Livre                                           
                                        </Button> 
                                        <Button size="small" color="secondary">
                                            Excluir
                                        </Button>   
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