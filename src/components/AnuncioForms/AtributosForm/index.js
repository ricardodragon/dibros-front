import FieldsetLegend from "../../FieldsetLegend"
import Atributos from "./Atributos"
import "./atributosForm.css"

function AtributosForm(props){

    return(
        <FieldsetLegend legend="Atributos" id={"check-atributos-fieldset"} classe="atributos">
             {props.categoria?<Atributos categoria={props.categoria}/>:<p style={{fontWeight: "bold", fontSize:"14pt", color:"red"}}>Preencha a categoria</p>}
        </FieldsetLegend>
    )
}

export default AtributosForm