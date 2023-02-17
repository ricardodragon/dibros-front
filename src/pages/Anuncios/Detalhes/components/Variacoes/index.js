import LabelInput from "../../../../../estrutura/LabelInput";
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
        <div style={{display: "flex", flexDirection: "row", overflowX:"scroll"}}>  
            {props.variations.map((variacao, index) =>                
                <div key={index} className="border rounded m-3 p-2">                    
                    <button disabled={props.disabled} className="col-12 btn btn-sm btn-link" onClick={(event)=>{event.preventDefault();addIndex(JSON.parse(JSON.stringify(variacao)), index-1<0?index:index-1)}}>+acima</button>                                                                                                                                                                                                                                                                                                                                                                                                                               
                    {variacao.attribute_combinations.map((atributo, i) => {                               
                        return <LabelInput required={true}
                            key={i} disabled={props.disabled}
                            value={atributo.value_name} label={atributo.name?atributo.name:atributo.id} 
                            id={(atributo.id?atributo.id:atributo.name)+index} type="text" 
                            onChange={value=>setAtributoValue(i, index, value)}/>                                                            
                    }
                    )}     
                    <div className="col">
                        <LabelInput 
                            disabled={true} required={true}
                            value={variacao.available_quantity} label="Quantidade" 
                            id={index+"qtd_disponivel_varicao"} type="number" 
                            onChange={available_quantity=>props.onChange(props.variations.map((v,i)=>i===index?{...v, available_quantity}:v))}/>
                    </div>      
                    <LabelInput disabled={props.disabled}
                            value={variacao.seller_custom_field?variacao.seller_custom_field:""} label={"SKU"} 
                            id={variacao.seller_custom_field} type="text" onChange={seller_custom_field=>props.onChange(props.variations.map((v,i)=>i===index?{...v, seller_custom_field}:v))}/>                              
                    <Imagens
                        disabled={props.disabled}
                        value={variacao.picture_ids}                           
                        onChange={picture_ids=>props.onChange(props.variations.map((v,i)=>i===index?{...v, picture_ids}:v))}/>                     
                    {/* <AtributosVariacao disabled={props.disabled} variacao={true} value={variacao.attributes?variacao.attributes:[]} onChange={attributes=>props.onChange(props.variations.map((x,i)=>i==index?{...x, attributes}:x))} categoria={props.categoria}/> */}
                    <br/>  
                    <button disabled={props.disabled} className="w-100 btn btn-sm btn-danger" onClick={(event)=>{event.preventDefault();excluir(index)}}>Excluir</button>                                                                                                                                                                                                                                                                                                                                                                                            
                    <button disabled={props.disabled} className="col-12 btn btn-sm btn-link" onClick={(event)=>{event.preventDefault();addIndex(JSON.parse(JSON.stringify(variacao)), index)}}>abaixo+</button>                                                                                                                                                                                                                                                                                                                                                       
                </div>
            )}
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