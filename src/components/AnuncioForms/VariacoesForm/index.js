
import { Button } from "@material-ui/core"
import { useState } from "react"
import { BsArrowsAngleExpand, BsArrowsAngleContract, BsCaretUpFill, BsCaretDownFill } from "react-icons/bs"
import FieldsetLegend from "../../Estrutura/FieldsetLegend"
import LabelInput from "../../Estrutura/LabelInput"
import Variacoes from "./Variacoes/index.js"
import "./variacoesForm.css"

function VariacoesForm(props){

    const [values, setValues] = useState({variations:[], variationsByAttributes:[]})
    
    const addVariacao = (variacao, index=-1)=> 
        props.onChange(index==-1?props.variations.concat(variacao):props.variations.map((v,i)=> index==i?variacao:v))          
    
    const excluir = (index) => props.onChange(props.variations.filter((value, i)=>index!=i));    
    const addIndex = (variacao, i)=> props.onChange(props.variations.filter((v, index)=>index<=i).concat({...variacao, id:undefined}).concat(props.variations.filter((v, index)=>i<index)));                        

    const ordenaVariacao = (index, ordem) => {
        const variations = props.variations;        
        if(ordem=="up" && index-1>=0){
            const temp=variations[index-1]; 
            variations[index-1] = variations[index]
            variations[index] = temp;
        }else if(ordem=="down" && index+1<variations.length){
            const temp=variations[index+1]; 
            variations[index+1] = variations[index]
            variations[index] = temp;
        }
        props.onChange(variations)
    }

    // const setVariationsByAttributes = index => setValues({...values, variationsByAttributes:props.variations.reduce((variationsByAttributes, variationAtual) => {                
    //     if(!variationsByAttributes[variationAtual.attribute_combinations[index].value_name]) variationsByAttributes[variationAtual.attribute_combinations[index].value_name] = [];
    //     variationsByAttributes[variationAtual.attribute_combinations[index].value_name].push(variationAtual); 
    //     return variationsByAttributes;  
    // }, {})});
    
    return (
        
        <FieldsetLegend legend={"Variacões"} id={"check-variacoes-fieldset"} classe="variacoes">  
                                                                                                                           
            {/* <LabelSelect label="Deseja agrupar por : " onChange={value=>setVariationsByAttributes(value)} lista={props.attribute_combinations} /> */}
            <ol>                     
                {/* {Object.keys(values.variationsByAttributes).map(k =>  */}
                    <>                                               
                        {/* <h5 style={{fontWeight:"bolder"}}>{k}</h5>       
                        <h1>{values.variationsByAttributes[k].length+" '"+k+"' encontrados"}</h1> 
                        <h1>Qtd : {values.variationsByAttributes[k].length>0?values.variationsByAttributes[k].map(v=>parseInt(v.available_quantity)).reduce((prev, next)=>(prev+next)):0} Itens</h1>                                   */}
                        {/* {values.variationsByAttributes[k].map((variacao, index) => */}
                        {props.variations.map((variacao, index) =>
                            <li>
                                {!props.disabled?<div style={{margin:"2% 0 2% 0", float:"left"}}>
                                    {index>0?<BsCaretUpFill style={{cursor:"pointer"}} onClick={event=>{event.preventDefault();ordenaVariacao(index, "up")}}/>:""}
                                    {index<props.variations.length-1?<BsCaretDownFill style={{cursor:"pointer"}} onClick={event=>{event.preventDefault();ordenaVariacao(index, "down")}}/>:""}    
                                </div>:null}
                                <div style={{margin:"2% 0 1% 5%", border: "0.1em solid black", borderRadius: "0.8em"}}> 
                                    {!variacao.editar?<BsArrowsAngleExpand style={{cursor:"pointer"}} onClick={(event)=>{event.preventDefault();addVariacao({...variacao, editar:!variacao.editar}, index)}}/>:                                    
                                    <BsArrowsAngleContract style={{cursor:"pointer"}} onClick={(event)=>{event.preventDefault();addVariacao({...variacao, editar:!variacao.editar}, index)}}/>}                                       
                                    {!variacao.editar?
                                        <>
                                            {variacao.attribute_combinations.map((att, i) =>                                         
                                                <LabelInput disabled={props.disabled} value={att.value_name} label={att.name+" :"} id={att.id} type="text" onChange={value_name=>props.onChange(props.variations.map((v, vi)=>vi==index?{...v, attribute_combinations:v.attribute_combinations.map((a,ai)=>ai==i?{...att, value_name}:a)}:v))}/>                                                                                     
                                            )} 
                                            <LabelInput disabled={props.disabled} value={variacao.price} label="Preço :" id="preco_variacao" type="number" onChange={price=>addVariacao({...variacao, price}, index)}/>                                         

                                            <LabelInput 
                                                disabled={props.disabled}                                                 value={variacao.available_quantity} label="Qtd :" 
                                                id="qtd_disponivel_varicao" type="number" style={{marginRight:"5%"}} onChange={available_quantity=>addVariacao({...variacao, available_quantity}, index)}/>                                                                                                                          
                                        </>:<Variacoes disabled={props.disabled} value={variacao} categoria={props.categoria} onChange={(variacao)=>addVariacao(variacao, index)}/>                                                                                                                                                                                                                                 
                                    }
                                    {!props.disabled?<div style={{marginLeft:"60%"}}>
                                        <Button type="button" color="primary" onClick={(event)=>{event.preventDefault();addIndex(JSON.parse(JSON.stringify(variacao)), index-1<0?index:index-1)}}>Copiar acima</Button>                                                                                                                                                                                                                                                                                                                                                       
                                        <Button type="button" color="secondary" onClick={(event)=>{event.preventDefault();excluir(index)}}>Excluir</Button>                                                                                                                                                                                                                                                                                                                                                    
                                        <Button type="button" color="primary" onClick={(event)=>{event.preventDefault();addIndex(JSON.parse(JSON.stringify(variacao)), index)}}>Copiar abaixo</Button>                                                                                                                                                                                                                                                                                                                                                       
                                    </div>:null}        
                                </div>                                                              
                            </li>

                        )}
                    </>
                {/* )}                 */}
            </ol>                
            <input style={{float:"right"}} type="button" value="+" className="botao-add-variacao" onClick={(event)=>{event.preventDefault();props.onChange(props.variations.concat({attribute_combinations:props.attribute_combinations, attributes:[], available_quantity:0, picture_ids:[], price:0, sold_quantity:0}))}}/>
        </FieldsetLegend>        
    )
}

export default VariacoesForm
