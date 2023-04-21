import { useState } from 'react';
import capinha from './capinha.jpg';
import perfil from './ivan_sem_osso.jpg';
import "./anuncios.css"

function Anuncios(){
         
    const [values] = useState({anuncios:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]})    
    
    // useEffect(() => 
    //     axios.get(process.env.REACT_APP_MELI_DOMAIN+"/produto").then(res => setValues({produtos:res.data, produto:{preco:"", quantidade:"", titulo:""}}))
    // , []);

    return (        
        values.anuncios.map(anuncio =>            
            <div className="card-anuncio">  
                <img src={perfil} style={{borderRadius: "50%", display: "inline", width:"2em", height:"2em"}}/>
                <h4 style={{display: "inline"}}>Ricardibro</h4>                             
                <h5 style={{textAlign:"center"}}>Capinhas</h5>                                    
                <picture>
                    <img src={capinha} className='img-anuncio' alt="Anúncio"/>
                </picture>
                <div><a href="/home">Comprar</a></div>
                <img src={perfil} style={{borderRadius: "50%", display: "inline", width:"2em", height:"2em"}}/>
                <label style={{fontWeight:"bolder", paddingRight:"2%"}}>ricardibro:</label><span>É original?</span>
            </div>            
        )
    )
}

export default Anuncios