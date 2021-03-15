import Header from "../Header"
import Menu from "../Menu"
import Footer from "../Footer"
import "./template.css"

function Template(props){
    return (
        <>
            <Header/>
            <Menu/>
            <div className="conteudo">
                {props.children}
            </div>
            <Footer/>
        </>
    )
}

export default Template