import FieldsetLegend from "../../FieldsetLegend"
import LabelInput from "../../LabelInput"
import "./moedaForm.css"
function MoedaForm(props){
    
    return (
        <FieldsetLegend legend={"Moeda"} id={"check-moeda-fieldset"} classe="moeda">                                                                                     
            <LabelInput label="Preço : " id="preco" type="number" onChange={value => props.onChangePreco(value)}/>
            <LabelInput label="Preço Original : " id="original_price" type="number" onChange={value => props.onChangeOriginalPreco(value)}/>
            <LabelInput label="Preço Base : " id="preco_base" type="number" onChange={value => props.onChangeBasePreco(value)}/>
        </FieldsetLegend>
    )
}

export default MoedaForm
