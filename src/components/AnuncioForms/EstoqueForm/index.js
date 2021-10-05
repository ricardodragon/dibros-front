import FieldsetLegend from "../../FieldsetLegend"
import LabelInput from "../../LabelInput"
import "./estoqueForm.css"

function EstoqueForm(props){
    
    
    return (
        <FieldsetLegend legend={"Estoque"} id={"check-estoque-fieldset"} classe="estoque">                                                                                     
            <LabelInput label="Quantidade disponível : " id="qtd_disponivel" type="number"/>
            <LabelInput label="Quantidade inicial : " id="qtd_inicial" type="number"/>                        
        </FieldsetLegend>
    )
}

export default EstoqueForm
