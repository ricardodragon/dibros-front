import { useEffect, useState } from "react";

function CardEndereco(props) {

    const [values, setValues] = useState({endereco:{selecionado:false}})    

    useEffect(() => setValues({endereco:props.endereco}), [props.endereco])

    return (<>
        <div className="endereco-conteudo">
            <fieldset id="endereco">                          
                <fieldset>
                    <label>rua</label>
                    <input type='text' required readOnly value={values.endereco.rua || ''}/>
                    <label>numero</label>
                    <input type='text' required value={values.endereco.numero ?? ''} onChange={event=> setValues({...values, endereco:{...values.endereco, numero:event.target.value}})}/>
                    <label>bairro</label>
                    <input type='text' required readOnly value={values.endereco.bairro || ''}/>
                    <label>complemento</label>
                    <input type='text' value={values.endereco.complemento || ''} onChange={event=> setValues({...values, endereco:{...values.endereco, complemento:event.target.value}})}/>
                </fieldset>
                <fieldset>
                    <label>estado</label>
                    <input type='text' required readOnly value={values.endereco.estado || ''}/>
                    <label>cidade</label>
                    <input type='text' required readOnly value={values.endereco.cidade || ''}/>
                </fieldset>
                <p><button onClick={event=>props.criar?props.criar(event,values.endereco):props.alterar(event,values.endereco)} className="btn btn-sm btn-success mt-2"/></p>
            </fieldset>
        </div>
    </>)
}

export default CardEndereco;