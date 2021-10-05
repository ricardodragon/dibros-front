import FieldsetLegend from "../../FieldsetLegend";
import Garantias from "./Garantias";
import "./garantiasForm.css"

function GarantiasForm(props){    

    return(
        <FieldsetLegend legend={"Garantias"} id={"check-garantias-fieldset"} classe="garantias">            
            <Garantias categoria={props.categoria}/>
        </FieldsetLegend>
    )
}

export default GarantiasForm