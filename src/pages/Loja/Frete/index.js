
function Frete(props) {
    
    return (<fieldset><legend>tabela de : peso x comprimento x largura</legend>
        <button onClick={event=>{event.preventDefault();props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:[...(props.values.loja.fretesDTO||[]), {index:props.values.loja.fretesDTO?props.values.loja.fretesDTO.length:0}]}})}}>adicionar tabela</button><br/>
        {props.values.loja.fretesDTO&&props.values.loja.fretesDTO.map((x, i)=><fieldset key={"frete-"+x.index}>
            <label htmlFor={"max-peso-"+x.index}>max peso por pedido : </label>            
            <input required disabled={x.confirmar} style={{width:"75%"}} id={"max-peso-"+x.index} placeholder="max peso por pedido" value={x.pesoMaximo} type="number" onChange={event=>props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.map((f, index)=>i===index?{...f, pesoMaximo:event.target.value}:f)}})}/>                                                                      
            <label htmlFor={"max-comprimento-"+x.index}>max comprimento por pedido : </label>            
            <input required disabled={x.confirmar} style={{width:"75%"}} id={"max-comprimento-"+x.index} placeholder="max comprimento por pedido" value={x.comprimentoMaximo} type="number" onChange={event=>props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.map((f, index)=>i===index?{...f, comprimentoMaximo:event.target.value}:f)}})}/>                                                                      
            <label htmlFor={"max-largura-"+x.index}>max largura por pedido : </label>            
            <input required disabled={x.confirmar} style={{width:"75%"}} id={"max-largura-"+x.index} placeholder="max largura por pedido" value={x.larguraMaximo} type="number" onChange={event=>props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.map((f, index)=>i===index?{...f, larguraMaximo:event.target.value}:f)}})}/>                                                                      
            <label htmlFor={"valor-km-"+x.index}>valor/km : </label>            
            <input required disabled={x.confirmar} style={{width:"75%"}} id={"valor-km-"+x.index} placeholder="valor da entrega por km" value={x.valorKm} type="number" onChange={event=>props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.map((f, index)=>i===index?{...f, valorKm:event.target.value}:f)}})}/>                                                                      
            <label htmlFor={"prazo-km-"+x.index}>prazo minutos/km : </label>            
            <input required disabled={x.confirmar} style={{width:"75%"}} id={"prazo-km-"+x.index} placeholder="prazo em minutos por km" value={x.prazoEntrega} type="number" onChange={event=>props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.map((f, index)=>i===index?{...f, prazoEntrega:event.target.value}:f)}})}/>                                                                      
            <label htmlFor={"max-distancia-km-"+x.index}>máxima distancia/km : </label>            
            <input required disabled={x.confirmar} style={{width:"75%"}} id={"max-distancia-km-"+x.index} placeholder="máxima distancia por km" value={x.distancia} type="number" onChange={event=>props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.map((f, index)=>i===index?{...f, distancia:event.target.value}:f)}})}/>                                                                      
            <button onClick={event=>{event.preventDefault();props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.map((t, index)=>i===index?{...t, confirmar:!t.confirmar}:t)}})}}>{props.values.loja.fretesDTO[i].confirmar?'editar':'confirmar'}</button>
            <button onClick={event=>{event.preventDefault();props.setValues({...props.values, loja:{...props.values.loja, fretesDTO:props.values.loja.fretesDTO.filter((_, index)=>index!==i)}});}}>excluir</button>
        </fieldset>)}
    </fieldset>)
}

export default Frete;