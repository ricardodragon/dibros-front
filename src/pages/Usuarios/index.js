import "./usuarios.css"

function usuarios(){
    return (
        <div>
            <table id="tabelaspec">
                

                <tr><td>Usuario</td><td>Permissão</td><td></td></tr>
                <tr><td>Gabriela</td><td>USER</td><td><div className="btn btn-danger"></div></td></tr>
                
               


            </table>
            <form>
                <h1>Indentificação usuario</h1>
                <fieldset id="usuario"><legend>Campos Obrigatórios</legend>
                    <p>Email: <input type="text"></input></p>
                    <p>Senha: <input type="text"></input></p>
                </fieldset>    
            </form>
        </div>
    )
}

export default usuarios