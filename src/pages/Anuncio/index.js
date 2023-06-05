


function Anuncio(props){
    
    const [values, setValues] = useState({})    
    
    useEffect(() => 
        console.log("Anunciar")        
    , []);

    const submit = event => {
        event.preventDefault();
        var formData = new FormData();
        formData.append('files', undefined);
        formData.append('anuncioDTO', new Blob([JSON.stringify(undefined)], {type: "application/json"}));        
    }

    return (
        <div className="p-4">
            <h4>Anunciar</h4>
            <form className="mt-4" onSubmit={submit}>                
                <fieldset id="usuario" className="p-2" style={{overflow:"hidden", borderRadius:"0.9em"}}>                    
                    <legend>{undefined?"Editar":"Criar"} Anucio {undefined}</legend>                                        
                    <LabelInput value={values.produto.quantidade} label="Quantidade: " placeholder="quantidade" id="quantidade" type="number" onChange={quantidade=>setValues({...values,produto:{...values.produto,quantidade}})}/>
                    <LabelInput value={values.produto.preco} label="Valor: " placeholder="valor" id="valor" type="number" step="0.2" onChange={preco=>setValues({...values,produto:{...values.produto,preco}})}/>
                    <LabelInput value={values.produto.titulo} label="Título: " placeholder="título" id="titulo" type="text" onChange={titulo=>setValues({...values,produto:{...values.produto,titulo}})}/>                                                                                         
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt"}} className="p-1" htmlFor='loja'>Loja :</label>
                    <select id="loja" style={{borderRadius:"0.9em"}} className='col form-control form-control-sm' onChange={event=>{event.preventDefault();setValues({...values, produto:{...values.produto, idLoja:event.target.value}});}}>                                                            
                        <option value={0}>Selecione uma loja</option>
                        {values.lojas.map(l => <option selected={l.id==values.produto.idLoja} key={l.id} value={l.id}>{l.nome}</option>)}
                    </select>                     
                    <label style={{whiteSpace:"nowrap", fontSize:"8pt"}} className="p-1 mt-3" htmlFor='imagem'>Foto do produto :</label>
                    <input id='imagem' className={"form-control form-control-sm mb-3"} label="Foto: " placeholder="foto" type="file" accept='image/*' onChange={event => {event.preventDefault();setValues({...values, produto:{...values.produto, imagem:event.target.files[0]}});}}/>                                    
                    {values.produto.imagemPath&&<img style={{width:"8em", height:"8em"}} src={process.env.REACT_APP_MELI_DOMAIN+values.produto.imagemPath}/>}
                    {values.produto.imagem&&<img style={{width:"8em", height:"8em"}} src={URL.createObjectURL(values.produto.imagem)}/>}            
                    <input disabled={!verificaProduto()} type="submit" value="enviar" className="btn btn-sm btn-success mt-2"/>    
                    <input disabled={!verificaProduto()} onClick={event => {event.preventDefault();setValues({...values, produto:{preco:"", quantidade:"", titulo:"", lojaDTO:{id:"", nome:""}}})}} type="submit" className="btn btn-sm btn-primary mt-2" value="Limpar"/>                        
                </fieldset>
            </form>
            <div className="table-responsive mt-3">
                <label htmlFor='lojas'>Loja</label>
                <select id="lojas" style={{borderRadius:"0.9em"}} className='col form-control form-control-sm mt-3' onChange={async event=>{event.preventDefault();setValues({...values, produtos:(await axios.get(process.env.REACT_APP_MELI_DOMAIN+(event.target.value>0?"/loja/produto/loja/"+event.target.value:"/loja/produto"))).data})}}>                                                            
                    <option value={0}>Todos</option>
                    {values.lojas.map((value, index) => <option selected={id==value.id} key={index} value={value.id}>{value.nome}</option>)}
                </select> 
                <table className="table mt-4">     
                    <thead className="thead-light">
                        <tr className="table-light">
                            <th scope="col">ID/SKU</th>
                            <th scope="col">Título</th>
                            <th scope="col">Preço</th>
                            <th scope="col">Qtd</th>
                            <th scope="col">Meli</th>  
                            <th scope="col">Amazon</th>  
                            <th scope="col">Shopee</th>  
                        </tr>
                    </thead> 
                    <tbody> 
                        {/* <tr><td>{values.produtos.map(p=>p.quantidade).reduce((sumQtd, a) => sumQtd + a, 0)}</td></tr> */}
                        {values.produtos.map(p=>
                            <tr key={p.id} style={{cursor:"pointer", whiteSpace: "nowrap"}} onClick={event=>{event.preventDefault();window.scrollTo(0, 0);setValues({...values, produto:{...p, loja:p.lojaDTO}});document.getElementsByClassName("conteudo")[0].scrollTo(0, 0)}}>
                                <td>{p.id}</td>
                                <td><img style={{width:"2em", height:"2em"}} src={process.env.REACT_APP_MELI_DOMAIN+p.imagemPath}/></td>                            
                                <td style={{fontWeight: "bold"}}>{p.titulo}</td>                                                             
                                <td>{"R$ "+p.preco}</td>
                                <td>{p.quantidade}</td>
                                <td><Link onClick={event=>event.stopPropagation()} target="_blank" to={"/anuncios/"+0+"/"+p.id} className="btn-link">Anuncios</Link></td>
                                <td></td>
                                <td></td>                                
                                <td><button className="btn btn-sm btn-danger" onClick={event=>{event.preventDefault();axios.delete(process.env.REACT_APP_MELI_DOMAIN+"/produto/"+p.id).then(r=>axios.get(process.env.REACT_APP_MELI_DOMAIN+"/produto/all").then(res => {setValues({...values, produtos:res.data, produto:{preco:"", quantidade:"", titulo:""}})}))}}>X</button></td>
                            </tr>
                        )}               
                    </tbody>    
                </table>       
            </div>    
        </div>
    );
}

export default Produtos
