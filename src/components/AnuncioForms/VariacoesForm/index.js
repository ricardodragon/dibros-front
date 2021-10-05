
import FieldsetLegend from "../../FieldsetLegend"
import ImagensForm from "../ImagensForm"
import Variacoes from "./Variacoes/index.js"
import "./variacoesForm.css"

function VariacoesForm(props){

    return (
        <FieldsetLegend  legend={"Variacões"} id={"check-variacoes-fieldset"} classe="variacoes">
            <Variacoes categoria={props.categoria} index={0}/>  
            {/* <ImagensForm/>                            */}
        </FieldsetLegend>        
    )
}

export default VariacoesForm