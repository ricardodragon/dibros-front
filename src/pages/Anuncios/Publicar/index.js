import { useState } from "react";
import FieldsetLegend from "../../../components/FieldsetLegend";
import AnuncioForm from "../../../components/AnuncioForms/AnuncioForm";
import MoedaForm from "../../../components/AnuncioForms/MoedaForm";
import EstoqueForm from "../../../components/AnuncioForms/EstoqueForm";
import TipoAnuncioForm from "../../../components/AnuncioForms/TipoAnuncioForm";
import CategoriasForm from "../../../components/AnuncioForms/CategoriasForm";
import AtributosForm from "../../../components/AnuncioForms/AtributosForm";
import VariacoesForm from "../../../components/AnuncioForms/VariacoesForm";
import "./publicar.css"
import ContasForm from "../../../components/AnuncioForms/ContasForm";
import ReplicarAnuncioForm from "../../../components/AnuncioForms/ReplicarAnuncioForm";
import ImagensForm from "../../../components/AnuncioForms/ImagensForm";
import DescricaoForm from "../../../components/AnuncioForms/DescricaoForm";
import GarantiasForm from "../../../components/AnuncioForms/GarantiasForm";

function Publicar(){
    
    const [values, setValues] = useState({});              
    
    function postAnuncio({}){
        // axios.post('http://localhost:8080/anuncios/publicar', {anuncio: null})
        //     .then(response => {                
        //     });
    }

    return (
                                
        <form>                            
            <ContasForm onChange={(contas) => { setValues({...values, contas})}}/>
            <ReplicarAnuncioForm/>
            { values.contas? <TipoAnuncioForm contas={values.contas} categoria={values.categoriaId}/> : null }
            <CategoriasForm onChange={(categoriaId) => setValues({...values, categoriaId})}/>                
            <FieldsetLegend legend={"Anuncio"} id={"check-anuncio-fieldset"} classe="anuncio">                                              
                <AnuncioForm/>                
                <MoedaForm/>                
                <EstoqueForm/>                                                                                  
                <AtributosForm categoria={values.categoriaId}/>
                <VariacoesForm categoria={values.categoriaId}/>                                            
                <ImagensForm/>
                <DescricaoForm/>
                <GarantiasForm categoria={values.categoriaId}/>
            </FieldsetLegend>    
            <input className="botao-publicar" type="submit" value="Publicar"/>                                
        </form>
        
    )
}
export default Publicar
