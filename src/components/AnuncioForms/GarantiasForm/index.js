import FieldsetLegend from "../../Estrutura/FieldsetLegend";
import Garantias from "./Garantias";
import "./garantiasForm.css"

function GarantiasForm(props){    

    return(
        <FieldsetLegend legend={"Garantias"} id={"check-garantias-fieldset"} classe="garantias">            
            <Garantias 
                categoria={props.categoria} setTipoGarantia={props.setTipoGarantia} 
                setTempoGarantia={props.setTempoGarantia}/>
        </FieldsetLegend>
    )
}

export default GarantiasForm