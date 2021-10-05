import FieldsetLegend from "../../FieldsetLegend"
import LabelInput from "../../LabelInput"
import "./moedaForm.css"
function MoedaForm(props){
    
    return (
        <FieldsetLegend legend={"Moeda"} id={"check-moeda-fieldset"} classe="moeda">                                                                                     
            <LabelInput label="Preço : " id="preco" type="number"/>
            <LabelInput label="Preço Original : " id="original_price" type="number"/>
            <LabelInput label="Preço Base : " id="preco_base" type="number"/>
        </FieldsetLegend>
    )
}

export default MoedaForm
