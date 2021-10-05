import { Button } from "@material-ui/core";
import LabelInput from "../../../LabelInput";
import Atributos from "../../AtributosForm/Atributos";
import "./variacoes.css"
function Variacoes(props){

    return (
        
        <>
            <datalist id="atributos-variacao"></datalist>
            <input type="text" datalist="atributos-variacao"/>
            <input type="submit" value="Adicionar Atributo"  className="botao-add-atributo"/>
            <div>            
                <span style={{float: "left", width: "100%", padding: "1%"}}>
                    <LabelInput label="Preço : " id="preco_variacao" type="number"/>                                         
                </span>                    
            </div>
            <div>
                <span style={{float: "left", width: "100%", padding: "1%"}}>
                    <LabelInput label="Quantidade disponível : " id="qtd_disponivel_varicao" type="number"/>                                                                                                                  
                </span>                    
            </div>
            <div>
                <Atributos categoria={props.categoria} variacao={true}/>                     
            </div>
        </>
    )
}

export default Variacoes


// {    
    
//     "picture_ids": [
//         "833400-MLB44247818982_122020"
//     ],
//     "attribute_combinations": [
//         {
//             "id": null,
//             "name": "Celular",
//             "value_id": null,
//             "value_name": "iPhone 11 Pro Max",
//             "value_struct": null,
//             "values": [
//                 {
//                     "id": null,
//                     "name": "iPhone 11 Pro Max",
//                     "struct": null
//                 }
//             ]
//         },
//         {
//             "id": "COLOR",
//             "name": "Cor",
//             "value_id": "52007",
//             "value_name": "Amarelo",
//             "value_struct": null,
//             "values": [
//                 {
//                     "id": "52007",
//                     "name": "Amarelo",
//                     "struct": null
//                 }
//             ]
//         }
//     ]
// }