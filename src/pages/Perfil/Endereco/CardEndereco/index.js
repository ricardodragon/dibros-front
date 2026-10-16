import { useEffect, useState } from "react";




function CardEndereco(props) {

    const [values, setValues] = useState({endereco:{}})

    useEffect(()=>setValues({endereco:props.endereco}), [props.endereco])

    const enviar = event => console.log()

    return (<>
        <form onSubmit={enviar} className="endereco-conteudo">
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
                <fieldset>
                    <label className="switch">
                        <input type="checkbox" checked={values.endereco.selecionado} onChange={event=>setValues({...values, endereco:{...values.endereco, selecionado:event.target.checked}})}/>
                        <span className="slider"></span>
                    </label>
                </fieldset>
                <p><input type="submit" value="Enviar" className="btn btn-sm btn-success mt-2"/></p>
            </fieldset>
        </form>
    </>)
}

export default CardEndereco;