import FieldsetLegend from "../../FieldsetLegend"
import LabelInput from "../../LabelInput"
import "./replicarAnuncioForm.css"

function ReplicarAnuncio(props){

    return (
        <FieldsetLegend legend="Replica" id="check-replicar-anuncio-fieldset" classe="replicar-anuncio">                                                         
            <LabelInput type="text" label="Replicar ID : "id="replicar" placeholder="digite um id de anuncio meli"/>                            
        </FieldsetLegend>
    )
}
export default ReplicarAnuncio