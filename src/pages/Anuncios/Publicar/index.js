import axios from "axios";
import { useState } from "react";
import Categorias from "../../../components/Categorias";
import Contas from "../../../components/Contas";
import Garantias from "../../../components/Garantias";
import TipoAnuncio from "../../../components/TipoAnuncio";


function Publicar(){
    
    const [values, setValues] = useState({});              
    
    function postAnuncio({}){
        // axios.post('http://localhost:8080/anuncios/publicar', {anuncio: null})
        //     .then(response => {                
        //     });
    }

    return (
        <>
            <h1>Publicar</h1>               
            <div>
                <span style={{float: "left", width: "100%", padding: "1%"}}>
                    <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="conta">Conta : </label>
                    <Contas onChange={(contas) => setValues({...values, contas})} id="conta"/>                   
                </span>
            </div>
            {  
                values.contas?
                <>
                    <div>
                        <span style={{float: "left", width: "100%", padding: "1%"}}>
                            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="conta">Replicar ID : </label>
                            <input placeholder="digite um id de anuncio meli"/>
                        </span>
                    </div>     
                    <div>
                        <span style={{float: "left", width: "100%", padding: "1%"}}>
                            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="titulo">Título : </label>
                            <input id="titulo" type="text" />
                            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="subtitulo">Subtítulo : </label>
                            <input id="subtitulo" type="text"/>
                        </span>
                    </div>
                                    
                    <div>            
                        <span style={{float: "left", width: "100%", padding: "1%"}}>
                            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="preco">Preço : </label>
                            <input id="preco" type="number"/> 
                            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="original_price">Preço Original : </label>
                            <input id="original_price" type="number"/>                       
                            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="preco_base">Preço Base : </label><input id="preco_base" type="number"/>
                        </span>                    
                    </div>
                                                    
                    <div>
                        <span style={{float: "left", width: "100%", padding: "1%"}}>
                            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="qtd_disponivel">Quantidade disponível : </label><input id="qtd_disponivel" type="number"/>
                            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="initial_quantity">Quantidade inicial : </label><input id="initial_quantity" type="number"/>
                        </span>                    
                    </div>     
                    <div>
                        <span style={{float: "left", width: "100%",  padding: "1%"}}>
                            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="categoria">Categoria : </label>  
                            <Categorias onChange={(categoriaId) => setValues({...values, categoriaId})}/>                                                                                            
                        </span>
                    </div>
                    {  
                        values.categoriaId?
                        <><div>
                            <span style={{float: "left", width: "100%",  padding: "1%"}}>
                                <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="tipo-anuncio">Tipo do anuncio por conta : </label>  
                                {
                                    values.contas.map( (conta)=>{
                                        return (
                                            <>
                                                <label style={{padding: "1%"}} htmlFor="tipo-anuncio">{conta.email}</label>
                                                <TipoAnuncio userMeliId={conta.id} categoria={values.categoriaId}/>
                                            </>
                                        )
                                    })
                                }
                            </span>
                        </div>
                        {/* <div>
                            <Garantias categoria={values.categoriaId}/> 
                        </div> */}
                        </>
                        :null
                    }
                    
                </>:null
            }            
            
        </>
    )
}

export default Publicar
