import { Button } from "@material-ui/core";
import { yellow } from "@material-ui/core/colors";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Contas from "../../../components/Contas";

import './style.css';

function Listagem(){
    const [values, setValues] = useState({anuncios:[]});   

    const setAnuncios = async () => setValues({
        ...values,
        anuncios:values.anuncios.concat((await axios.get('http://localhost:8080/meli/anuncios')).data)
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
                    <Link to={"/anuncios/detalhes/"+0+"/"+0} className="footer-card-link">
                        <Button size="small" color="primary">
                            Publicar
                        </Button>
                    </Link>
                </div>
                {   
                    values.anuncios.map((value, index) => {
                        return (
                            <li key={index} className="card-anuncios">
                                <figure className="foto-lista-anuncio">
                                    <img src={value.body.thumbnail} alt=""  />
                                </figure>
                                <div className="anuncio-info">
                                    <h3>{value.body.title}</h3>
                                    <div className="anuncio-especificacao">
                                        <label>Preço: {value.body.price}</label>
                                        <label>Quantidade: {value.body.available_quantity}</label>                                   
                                        <label>Data/Hora ultima alteração: {formatDate(value.body.last_updated)}</label>
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
                            </li>
                        )
                    })
                }
            </ul>
        </>
    );
}

export default Listagem