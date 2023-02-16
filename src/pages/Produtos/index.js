
import axios from 'axios';
import { useEffect, useState } from 'react';
import LabelInput from '../../estrutura/LabelInput';
import './style.css';

function Produtos(){
    
    const [values, setValues] = useState({produtos:[], produto:{preco:"", quantidade:"", titulo:""}})    
    
    const verificaProduto = () => values.produto.quantidade||values.produto.preco||values.produto.titulo;
     
    useEffect(() => 
        axios.get(process.env.REACT_APP_MELI_DOMAIN+"/produto").then(res => setValues({produtos:res.data, produto:{preco:"", quantidade:"", titulo:""}}))
    , []);

    const submit = event => {
        event.preventDefault();
        values.produto.id?
            axios.put(process.env.REACT_APP_MELI_DOMAIN+"/produto", values.usuario).then(res => 
                axios.get(process.env.REACT_APP_MELI_DOMAIN+"/produto/all").then(res => {setValues({...values, produtos:res.data});})):
            axios.post(process.env.REACT_APP_MELI_DOMAIN+"/produto", values.usuario).then(res => 
                axios.get(process.env.REACT_APP_MELI_DOMAIN+"/produto/all").then(res => {setValues({...values, produtos:res.data});}))
        
    }

    return (
        <div className="p-4">
            <h4>Produtos</h4>
            <form className="mt-4" onSubmit={submit}>                
                <fieldset id="usuario" className="p-2" style={{overflow:"hidden"}}>
                    <legend>{values.produto.id?"Editar":"Criar"} Produto {values.produto.id}</legend>                    
                    {/* <LabelInput value={values.produto.codigo} label="Codigo: " placeholder="codigo" id="codigo" type="text" onChange={codigo=>setValues({...values,produto:{...values.produto,codigo}})}/> */}
                    <LabelInput value={values.produto.quantidade} label="Quantidade: " placeholder="quantidade" id="quantidade" type="number" onChange={quantidade=>setValues({...values,produto:{...values.produto,quantidade}})}/>
                    <LabelInput value={values.produto.preco} label="Valor: " placeholder="valor" id="valor" type="number" step="0.2" onChange={preco=>setValues({...values,produto:{...values.produto,preco}})}/>
                    <LabelInput value={values.produto.titulo} label="Título: " placeholder="título" id="titulo" type="text" onChange={titulo=>setValues({...values,produto:{...values.produto,titulo}})}/>                    
                    <input disabled={!verificaProduto()} type="submit" value="enviar" className="btn btn-sm btn-success mt-2"/>    
                    <input disabled={!verificaProduto()} onClick={event => {event.preventDefault();setValues({...values, produto:{preco:"", quantidade:"", titulo:""}})}} type="submit" className="btn btn-sm btn-primary mt-2" value="Limpar"/>                        
                </fieldset>
            </form>
            <div className="table-responsive">
                <table className="table">     
                    <thead className="thead-light">
                        <tr className="table-light">
                            <th scope="col">ID</th>
                            <th scope="col">Quantidade</th>
                            <th scope="col">Preço</th>
                            <th scope="col">Título</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead> 
                    <tbody>                
                        {values.produtos.map(p=>
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.quantidade}</td>
                                <td>{"R$ "+p.preco}</td>
                                <td>{p.titulo}</td>
                                <td><button className="btn btn-sm btn-primary" onClick={event=>{event.preventDefault();setValues({...values, produto:p})}}>Editar</button></td>
                                {/* <td><button className="btn btn-sm btn-danger" onClick={event=>{event.preventDefault();axios.delete(process.env.REACT_APP_MELI_DOMAIN+"/produto/"+p.id).then(r=>setProdutos())}}>X</button></td> */}
                            </tr>
                        )}               
                    </tbody>    
                </table>       
            </div>    
        </div>
    );
}

export default Produtos
// useLayoutEffect(() => 
// axios.get(process.env.REACT_APP_MELI_DOMAIN+"/produto/all")).then(res=>setValues({produtos: res.data, produto:{preco:"", quantidade:"", titulo:""}}) 
// , []);