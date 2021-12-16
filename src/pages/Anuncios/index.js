import { Button } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Contas from "../../components/Contas";

import './style.css';

function Anuncios(){
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
                    <Link to={"/anuncios/publicar/"+0+"/"+0} className="footer-card-link">
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
                                        <Link to="/" className="footer-card-link">
                                            <Button size="small" color="primary">
                                                Detalhes
                                            </Button>
                                        </Link>
                                        <a target="_blank" rel="noreferrer" href={value.body.permalink} className="footer-card-link">
                                            <Button size="small" color="primary">
                                                Mercado Livre
                                            </Button>        
                                        </a>                                                                                
                                        <Link to={"/anuncios/publicar/"+value.body.id+"/"+value.body.seller_id} className="footer-card-link">
                                            <Button size="small" color="primary">
                                                Replicar
                                            </Button>        
                                        </Link>
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

export default Anuncios