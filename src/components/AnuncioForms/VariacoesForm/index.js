
import { useEffect, useState } from "react"
import { BsArrowsAngleExpand, BsArrowsAngleContract } from "react-icons/bs"
import FieldsetLegend from "../../FieldsetLegend"
import LabelInput from "../../LabelInput"
import AtributosVariacoesForm from "../AtributosVariacoesForm"
import Variacoes from "./Variacoes/index.js"
import "./variacoesForm.css"

function VariacoesForm(props){

    const [values, setValues] = useState({variations:[], atributos:[]})

    useEffect(() => setValues({...values, variations:props.value!=undefined?props.value:values.variations}), [props.value])    
    const addVariacao = (variacao, index=-1)=> props.onChange(index==-1?values.variations.concat(variacao):values.variations.map((v,i)=> index==i?variacao:v))      
    const addAtributo = (a)=> props.onChange(values.variations.map((v,i)=>{ v.attribute_combinations.push(a); return v}))
    const excluir = (index) => props.onChange(values.variations.filter((value, i)=>index!=i));
    const editarAtributo = (value, index) => props.onChange(values.variations.map(v=>{ v.attribute_combinations[index].name = value; delete v.attribute_combinations[index].id;return v}));    
    const addIndex = (variacao, i)=>
        props.onChange(values.variations.filter((v, index)=>index<=i).concat({...variacao, id:undefined}).concat(values.variations.filter((v, index)=>i<index)));            

    const editarAtributoValue = (value, i, index) => {
        const variations = values.variations;
        variations[index].attribute_combinations[i].value_name = value   
        props.onChange(variations)
    }                

    const excluirAtributo = index => {
        const name = values.variations[0].attribute_combinations[index].name;        
        const variations = values.variations.map(v=> {
            v.attribute_combinations=v.attribute_combinations.filter(a=>a.name!=name)
            return v;
        })
        setValues({...values, variations})
    }        

    const ordenaVariacao = (index, ordem) => {
        const variations = values.variations;        
        if(ordem=="up" && index-1>=0){
            const temp=variations[index-1]; 
            variations[index-1] = variations[index]
            variations[index] = temp;
        }else if(ordem=="down" && index+1<variations.length){
            const temp=variations[index+1]; 
            variations[index+1] = variations[index]
            variations[index] = temp;
        }
        setValues({...values, variations})
    }

    return (
        
        <FieldsetLegend legend={"Variacões"} id={"check-variacoes-fieldset"} classe="variacoes">                         
            <AtributosVariacoesForm 
                value={{
                    categoria:props.categoria, 
                    attribute_combinations: values.variations[0]?values.variations[0].attribute_combinations:[]
                }} 
                onChange={(value, index)=>editarAtributo(value, index)} addAtributo={addAtributo} excluirAtributo={excluirAtributo}/>
            
            <FieldsetLegend legend={""} id={"check-attribute-combinations-fieldset"} classe="attribute-combinations">                                                                                                        
                <Variacoes value={{attribute_combinations:values.variations[0]?values.variations[0].attribute_combinations:[]}} categoria={props.categoria} onChange={addVariacao}/>
            </FieldsetLegend>
            <FieldsetLegend legend={"Lista"} id={"check-variacoes-lista-fieldset"} classe="variacoes-lista">
                <ol> 
                    <h1>{"Total : "+values.variations.length+" Variações"}</h1> 
                    <h1>Qtd : {values.variations.length>0?values.variations.map(v=>parseInt(v.available_quantity)).reduce((prev, next)=>(prev+next)):0}</h1>             
                    {
                        values.variations.map((variacao, index) =>                                                     
                            <li style={{border: "0.1em solid black", borderRadius: "0.8em"}}> 
                                {!variacao.editar?<BsArrowsAngleExpand style={{cursor:"pointer"}} onClick={(event)=>{event.preventDefault();addVariacao({...variacao, editar:!variacao.editar}, index)}}/>:                                    
                                <BsArrowsAngleContract style={{cursor:"pointer"}} onClick={(event)=>{event.preventDefault();addVariacao({...variacao, editar:!variacao.editar}, index)}}/>}                                       
                                {!variacao.editar?
                                    <>
                                        {variacao.attribute_combinations.map((att, i) =>                                         
                                            <LabelInput  value={att.value_name} label={att.name+" :"} id={att.id} type="text" onChange={value=>editarAtributoValue(value, i, index)}/>                                                                                     
                                        )} 
                                        <LabelInput  value={variacao.price} label="Preço :" id="preco_variacao" type="number" onChange={price=>addVariacao({...variacao, price}, index)}/>                                         

                                        <LabelInput 
                                            value={variacao.available_quantity} label="Qtd :" 
                                            id="qtd_disponivel_varicao" type="number" style={{marginRight:"5%"}} onChange={available_quantity=>addVariacao({...variacao, available_quantity}, index)}/>                                                                                                                          
                                    </>:
                                    <>  
                                        <Variacoes value={variacao} categoria={props.categoria} onChange={(variacao)=>addVariacao(variacao, index)}/>                                                                                                                                                                                                                                 
                                    </>                                    
                                }
                                <input type="button" value="Copiar acima" className="botao-add-variacao" onClick={(event)=>{event.preventDefault();addIndex(variacao, index-1<0?index:index-1)}}/>                                                                                                                                                                                                                                                                                                                                                       
                                <input type="button" value="Excluir" className="botao-excluir-variacao" onClick={(event)=>{event.preventDefault();excluir(index)}}/>                                                                                                                                                                                                                                                                                                                                                    
                                <input type="button" value="Copiar abaixo" className="botao-add-variacao" onClick={(event)=>{event.preventDefault();addIndex(variacao, index)}}/>                                                                                                                                                                                                                                                                                                                                                       
                            </li>                                                        
                        )                    
                    }
                </ol>
            </FieldsetLegend>                
        </FieldsetLegend>        
    )
}

export default VariacoesForm
