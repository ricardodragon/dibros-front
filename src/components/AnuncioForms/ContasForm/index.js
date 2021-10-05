import Contas from "../../Contas";
import FieldsetLegend from "../../FieldsetLegend";
import "./contasForm.css"

function ContasForm(props){
    return (
        <FieldsetLegend legend={"Contas"} id={"check-contas-fieldset"} classe="contas">                                       
            <label style={{padding: "1%", fontWeight: "bolder"}} htmlFor="conta">Conta : </label>
            <Contas onChange={props.onChange} id="conta"/>
        </FieldsetLegend>
    )
}

export default ContasForm