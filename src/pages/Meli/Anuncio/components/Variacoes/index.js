import Imagens from "../Imagens";
import "./variacoes.css";

function Variacoes(props){
    
    const setAtributoValue = (i, index, value_name) => {   
        const variations = props.variations;
        variations[index].attribute_combinations[i] = { ...variations[index].attribute_combinations[i], value_name } 
        props.onChange(variations)                        
    }
    
    // const addVariacao = (variacao, index=-1)=> 
    //     props.onChange(index==-1?props.variations.concat(variacao):props.variations.map((v,i)=> index==i?variacao:v))          
    
    const excluir = (index) => props.onChange(props.variations.filter((value, i)=>index!==i));    
    const addIndex = (variacao, i)=> props.onChange(props.variations.filter((v, index)=>index<=i).concat({...variacao, id:undefined}).concat(props.variations.filter((v, index)=>i<index)));                        
    
    return (
        <div className="table-responsive">
            <table className="table">     
                <thead className="thead-light"> 
                    <tr>
                        <th scope="col">SKU</th>
                        {props.variations[0]&&props.variations[0].attribute_combinations.map((a, i) => 
                            <th scope="col" key={a.id + "" + i}>{a.name}</th>
                        )}
                        <th scope="col">Quantidade</th>   
                        <th scope="col">Imagens</th>                 
                        <th scope="col"></th>            
                    </tr>
                </thead>
                <tbody>
                    {props.variations.map((variacao, index) => <>
                        <tr key={(index+1)*100}>
                            <td>
                                <input disabled={props.disabled} className={"form-control form-control-sm"} value={variacao.attributes.filter(a => a.id === "SELLER_SKU").length?variacao.attributes.filter(a => a.id === "SELLER_SKU")[0].value_name:""} id={variacao.seller_custom_field} type="text" onChange={event=>{props.onChange(props.variations.map((v,i)=>i===index?{
                                    ...v, 
                                    attributes:v.attributes.filter(a => a.id === "SELLER_SKU").length?v.attributes.map(a=>a.id === "SELLER_SKU"?{...a, value_name:event.target.value}:a):[...v.attributes, {id:"SELLER_SKU", value_name:event.target.value}]
                                }:v))}}/>
                            </td>
                            {variacao.attribute_combinations.map((atributo, i) =>                              
                                <td key={(i+1)*30}>
                                    <input className={"form-control form-control-sm"} 
                                        required={true} key={i} disabled={props.disabled}
                                        value={atributo.value_name} label={atributo.name?atributo.name:atributo.id} 
                                        id={(atributo.id?atributo.id:atributo.name)+index} type="text" size="50"
                                        onChange={event=>setAtributoValue(i, index, event.target.value)}/>                                                                                            
                                </td>
                            )} 
                            <td><input size="2" id={index+"qtd_disponivel_varicao"} type="number" onChange={event=>props.onChange(props.variations.map((v,i)=>i===index?{...v, available_quantity:event.target.value}:v))} disabled={props.disabled} className={"form-control form-control-sm"} value={variacao.available_quantity}/></td>
                            <td style={{cursor: "pointer"}} onClick={event => { event.preventDefault(); props.onChange(props.variations.map((x,i)=> {return index===i?{...x,colapse:!x.colapse}:x}))}}>{variacao.colapse?"👇" : "👉"}</td>
                            <td><button disabled={props.disabled} className="w-100 btn btn-sm btn-danger" onClick={(event)=>{event.preventDefault();excluir(index)}}>Excluir</button></td>
                            <td><button disabled={props.disabled} className="w-100 btn btn-sm btn-primary" onClick={(event)=>{event.preventDefault();addIndex(JSON.parse(JSON.stringify(variacao)), index)}}>Adicionar</button></td>                        
                            <td></td>
                        </tr>
                        {variacao.colapse&&<tr><td align="center" colSpan="10"><Imagens disabled={props.disabled} value={variacao.picture_ids} onChange={picture_ids=>props.onChange(props.variations.map((v,i)=>i===index?{...v, picture_ids}:v))}/></td></tr>}
                    </>)}
                </tbody>
            </table>
        </div>  
    )
}

export default Variacoes

// const ordenaVariacao = (index, ordem) => {
//     const variations = props.variations;        
//     if(ordem=="up" && index-1>=0){
//         const temp=variations[index-1]; 
//         variations[index-1] = variations[index]
//         variations[index] = temp;
//     }else if(ordem=="down" && index+1<variations.length){
//         const temp=variations[index+1]; 
//         variations[index+1] = variations[index]
//         variations[index] = temp;
//     }
//     props.onChange(variations)
// }
