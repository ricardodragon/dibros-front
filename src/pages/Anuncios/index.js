import { Button } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AutoComplete from "../../components/AutoComplete";

import './style.css';

function Anuncios(){
    const [anuncios, setAnuncios] = useState([]);
    const [conta, setConta] = useState({});

    const getAnuncios = async () => {
        const response = await axios.get('http://localhost:8080/anuncios/by-user-id?id='+JSON.parse(localStorage.getItem("usuario")).id);
        setAnuncios(anuncios.concat(response.data));
    }

    useEffect(() => { getAnuncios() }, []);

    const formatDate = function(string){
        var optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleTimeString([], optionsDate);
    }

    return (
        <>
            <ul>
                <div>
                    <AutoComplete setConta={setConta}/>
                    <Link to="/anuncios/publicar" className="footer-card-link">
                        <Button size="small" color="primary">
                            Publicar
                        </Button>
                    </Link>
                </div>
                {   
                    anuncios.map((value, index) => {
                        return (
                            <li key={index} className="card-anuncios">
                                <figure className="foto-lista-anuncio">
                                    <img src={value.thumbnail}/>
                                </figure>
                                <div className="anuncio-info">
                                    <h3>{value.title}</h3>
                                    <div className="anuncio-especificacao">
                                        <label>Preço: {value.price}</label>
                                        <label>Quantidade: {value.available_quantity}</label>                                   
                                        <label>Data/Hora ultima alteração: {formatDate(value.last_updated)}</label>
                                        <Link to="/" className="footer-card-link">
                                            <Button size="small" color="primary">
                                                Detalhes
                                            </Button>
                                        </Link>
                                        <a target="blank" href={value.permalink} className="footer-card-link">
                                            <Button size="small" color="primary">
                                                MercadoLivre
                                            </Button>        
                                        </a>
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