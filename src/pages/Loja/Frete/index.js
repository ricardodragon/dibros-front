
function Frete(props) {
    
    return (<fieldset style={{display: "block"}}><legend>Regras de Frete (Peso e Dimensões)</legend>
        <button style={{width: "fit-content", padding: "6px 16px", borderRadius: "12px"}} onClick={event=>{event.preventDefault();props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:[...(props.values.loja.fretesDTO||[]), {index:props.values.loja.fretesDTO?props.values.loja.fretesDTO.length:0}]}})}}>adicionar tabela</button>
        {props.values.loja.fretesDTO&&props.values.loja.fretesDTO.map((x, i)=><fieldset key={"frete-"+x.index}>
            <label htmlFor={"max-peso-"+x.index}>max peso por pedido : 
                <input required disabled={x.confirmar} id={"max-peso-"+x.index} placeholder="max peso por pedido" value={x.peso} type="number" onChange={event=>props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.map((f, index)=>i===index?{...f, pesoMaximo:event.target.value}:f)}})}/>                                                                      
            </label>            
            <label htmlFor={"max-comprimento-"+x.index}>max comprimento por pedido :           
                <input required disabled={x.confirmar} id={"max-comprimento-"+x.index} placeholder="max comprimento por pedido" value={x.comprimento} type="number" onChange={event=>props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.map((f, index)=>i===index?{...f, comprimento:event.target.value}:f)}})}/>                                                                      
            </label>            
            <label htmlFor={"max-largura-"+x.index}>max largura por pedido :       
                <input required disabled={x.confirmar} id={"max-largura-"+x.index} placeholder="max largura por pedido" value={x.largura} type="number" onChange={event=>props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.map((f, index)=>i===index?{...f, largura:event.target.value}:f)}})}/>                                                                      
            </label>            
            <label htmlFor={"max-altura-"+x.index}>max altura por pedido :       
                <input required disabled={x.confirmar} id={"max-altura-"+x.index} placeholder="max altura por pedido" value={x.altura} type="number" onChange={event=>props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.map((f, index)=>i===index?{...f, altura:event.target.value}:f)}})}/>                                                                      
            </label>            
            <label htmlFor={"valor-km-"+x.index}>valor/km :           
                <input required disabled={x.confirmar} id={"valor-km-"+x.index} placeholder="valor da entrega por km" value={x.valorKm} type="number" onChange={event=>props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.map((f, index)=>i===index?{...f, valorKm:event.target.value}:f)}})}/>                                                                      
            </label>  
            <label htmlFor={"prazo-km-"+x.index}>prazo minutos/km :          
                <input required disabled={x.confirmar} id={"prazo-km-"+x.index} placeholder="prazo em minutos por km" value={x.prazoEntrega} type="number" onChange={event=>props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.map((f, index)=>i===index?{...f, prazoEntrega:event.target.value}:f)}})}/>                                                                        
            </label>   
            <label htmlFor={"max-distancia-km-"+x.index}>máxima distancia/km :            
                <input required disabled={x.confirmar} id={"max-distancia-km-"+x.index} placeholder="máxima distancia por km" value={x.distancia} type="number" onChange={event=>props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.map((f, index)=>i===index?{...f, distancia:event.target.value}:f)}})}/>                                                                      
            </label> 
            <div style={{ display: "flex", gap: "8px", alignSelf: "end" }}>
                <button className="btn-confirmar" onClick={event=>{event.preventDefault();props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.map((t, index)=>i===index?{...t, confirmar:!t.confirmar}:t)}})}}>{props.values.loja.fretesDTO[i].confirmar?'editar':'confirmar'}</button>
                <button className="btn-excluir" onClick={event=>{event.preventDefault();props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.filter((_, index)=>index!==i)}});}}>excluir</button>
            </div>
        </fieldset>)}
    </fieldset>)
}

export default Frete;