import axios from "axios";
import { useEffect, useState } from "react";
import LabelInput from "../LabelInput"    
import LabelSelect from "../LabelSelect";
            
function Variacoes(props){
    const [values, setValues] = useState({atributos:[]});
    
    async function setAtributos(){                                                    
        const atributos = (await axios.get('http://localhost:8080/atributos/'+props.categoria))
            .data.filter((value) => value.tags.variation_attribute);                               
        const domainId = (await axios.get('http://localhost:8080/categorias/'+props.categoria)).data.settings.catalog_domain;                         
        
        for(var i in atributos.filter((value) => value.value_type=="string"))      
            console.log(i)                               
            try {
                const values = (await axios.get('http://localhost:8080/atributos/top/'+domainId+"/"+atributos[i].id)).data                                                       
                atributos[i].values = values.length>0?values:atributos[i].values
            }catch(err){}                                  
        setValues({...values, atributos});               
    }

    useEffect(() => 
        setAtributos()  
    ,[props]);                             

    return (
        
        <>
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
                {
                    values.atributos.map((atributo, index) => 
                        <span style={{float: "left", width: "100%",  padding: "1%"}} key={index}>
                            <LabelInput  
                                id={atributo.id+"-"+index+"-"+props.index} value="id" name="name" 
                                label={atributo.name}
                                onChange={(event) => {}} 
                                type="text"/>
                            {atributo.values?<LabelSelect id={atributo.id+"-"+index+"-"+props.index} lista={atributo.values} value="id" name="name" label={atributo.name} onChange={(event)=>{}}/>:""}  
                        </span>
                    )
                }   
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