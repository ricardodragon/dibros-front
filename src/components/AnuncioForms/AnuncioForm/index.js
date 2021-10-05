import FieldsetLegend from '../../FieldsetLegend';
import LabelInput from '../../LabelInput';
import "./anuncioForm.css"
function AnuncioForm(props){

    return ( 
        <>            
            <FieldsetLegend legend={"Anuncio"} id={"check-anuncios-fieldset"} classe="anuncios">                                                                                                            
                <LabelInput label="Título : " id="titulo" type="text"/>
                <LabelInput label="Subtítulo : " id="subtitulo" type="text"/>
            </FieldsetLegend>  
        </>   
    )
}

export default AnuncioForm
