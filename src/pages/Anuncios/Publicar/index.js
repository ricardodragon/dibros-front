import { useState } from "react";
import Atributos from "../../../components/Atributos";
import Categorias from "../../../components/Categorias";
import Contas from "../../../components/Contas";
import LabelInput from "../../../components/LabelInput";
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
                            <LabelInput 
                                type="text" label="Replicar ID : " 
                                id="replicar" placeholder="digite um id de anuncio meli"/>                                                        
                        </span>
                    </div>     
                    <div>
                        <span style={{float: "left", width: "100%", padding: "1%"}}>
                            <LabelInput label="Título : " id="titulo" type="text"/>   
                            <LabelInput label="Subtítulo : " id="subtitulo" type="text"/>                                                        
                           
                        </span>
                    </div>
                                    
                    <div>            
                        <span style={{float: "left", width: "100%", padding: "1%"}}>
                            <LabelInput label="Preço : " id="preco" type="number"/> 
                            <LabelInput label="Preço Original : " id="original_price" type="number"/>                                                         
                            <LabelInput label="Preço Base : " id="preco_base" type="number"/>                             
                        </span>                    
                    </div>
                                                    
                    <div>
                        <span style={{float: "left", width: "100%", padding: "1%"}}>
                            <LabelInput label="Quantidade disponível : " id="qtd_disponivel" type="number"/>                             
                            <LabelInput label="Quantidade inicial : " id="qtd_inicial" type="number"/>                                                                                     
                        </span>                    
                    </div>     
                    <div>
                        <span style={{float: "left", width: "100%",  padding: "1%"}}>
                            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="categoria">
                                Categoria : 
                            </label>  
                            <Categorias onChange={(categoriaId) => setValues({...values, categoriaId})}/>                                                                                            
                        </span>
                    </div>
                    <div>
                        <span style={{float: "left", width: "100%",  padding: "1%"}}>
                            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="tipo-anuncio">
                                Tipo do anuncio por conta : 
                            </label>  
                            {values.contas.map( (conta)=>
                                <TipoAnuncio conta={conta} categoria={values.categoriaId}/>
                            )}
                        </span>
                    </div>
                    {/* <div>
                        <Garantias categoria={values.categoriaId}/> 
                    </div> */}
                    {  
                        values.categoriaId?
                            <div>
                                <Atributos categoria={values.categoriaId}/> 
                            </div>:""
                    }
                </>
                :null                                                        
            }            
            
        </>
    )
}

export default Publicar
