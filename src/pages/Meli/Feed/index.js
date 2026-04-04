import Template from "../../../estrutura/Template"
import Contas from "../Contas"
import './feed.css'

function Feed(props){

    const redirectMeli = () => {                
        const uriRedirect = 'https://dibros.com.br/meli/contas'
        window.location.href = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=5401911184235214&redirect_uri=${uriRedirect}`;
    }

    return (
        <Template>
            <header style={{textAlign:"center"}}>
                <h1>contas mercado livre</h1>
            </header>
            <div className="tabs-feed">
                <section id="contas" className="tab">
                    <Contas/>
                    <input style={{cursor:"pointer", float: "right", position: "absolute", right: "6%", bottom: "6%", backgroundColor:"yellow"}} onClick={redirectMeli} value="🔗 ADICIONAR CONTA"/>                    
                </section>
            </div>
        </Template>
    )
}
export default Feed