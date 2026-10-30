import { useEffect, useState } from "react";
import axios from '../../../../config/api/api';

function CardEndereco(props) {

    const [values, setValues] = useState({endereco:{}})

    useEffect(()=>setValues({endereco:props.endereco}), [props.endereco])

    const enviar = event => event.preventDefault();

    const excluir = event => {
        event.preventDefault();
        axios.delete("/loja/endereco/"+values.endereco.id).then(r=>r?.data>0?props.excluir(values.endereco.id):null)
    }

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
                        <input type="checkbox" checked={values.endereco?.selecionado ?? false} onChange={event=>setValues({...values, endereco:{...values.endereco, selecionado:event.target.checked}})}/>
                        <span className="slider"></span>
                    </label>
                </fieldset>
                <p>
                    <input type="submit" value="enviar"/>
                    <input type="submit" onClick={excluir} value="excluir" style={{backgroundColor:"red", color:"white"}}/>
                </p>
            </fieldset>
        </form>
    </>)
}

export default CardEndereco;