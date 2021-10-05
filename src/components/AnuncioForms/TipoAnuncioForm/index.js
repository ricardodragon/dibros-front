
import FieldsetLegend from '../../FieldsetLegend';
import TipoAnuncio from './TipoAnuncio';
import "./tipoAnuncioForm.css"

function TipoAnuncioForm(props){      

    return (
        <FieldsetLegend legend={"Tipo do anuncio por conta"} id={"check-tipo-anuncio-fieldset"} classe="tipo-anuncio">
            {
                props.contas.map((conta)=>
                    <TipoAnuncio conta={conta} categoria={props.categoriaId}/>)
            }
        </FieldsetLegend>   
    )
}

export default TipoAnuncioForm
