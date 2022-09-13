import FieldsetLegend from "../../Estrutura/FieldsetLegend"
import Atributos from "./Atributos"
import "./atributosForm.css"

function AtributosForm(props){

    return( 
        <>
            <h5 className="h3">Atributos</h5>                
            {props.categoria?
                <Atributos disabled={props.disabled} value={props.value} onChange={event=>props.onChange(event)} 
                    categoria={props.categoria}/>
                :<p style={{fontWeight: "bold", fontSize:"14pt", color:"red"}}>Preencha a categoria</p>}
        </>        
    )
}

export default AtributosForm