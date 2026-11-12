import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useLocation } from 'react-router-dom';
import './menu-opcoes.css'; // Importe o CSS que criamos
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const MenuOpcoes = forwardRef(({onDeletar, rotaEdicao}, ref) => {
    const history = useHistory();
    const location = useLocation();
    const [lojaSelecionada, setLojaSelecionada] = useState(null);
    const [posicaoMenu, setPosicaoMenu] = useState({ top: 0, left: 0 });
    const [menuAberto, setMenuAberto] = useState(false);
    const dialogRef = useRef(null);
    const timeoutFecharRef = useRef(null);

    const fechar = () => {
        setMenuAberto(false);
        timeoutFecharRef.current = setTimeout(() => {
            dialogRef.current?.close();
            setLojaSelecionada(null);
        }, 200);
    };

    const toggle = (event, loja) => {
        event.stopPropagation();
        if (menuAberto && lojaSelecionada?.id === loja.id) {
            fechar();
            return;
        }

        if (timeoutFecharRef.current) 
            clearTimeout(timeoutFecharRef.current);

        const rect = event.currentTarget.getBoundingClientRect();
        const larguraMenu = 170;

        setPosicaoMenu({top: rect.bottom + 4, left: rect.right-larguraMenu<10?10:rect.right-larguraMenu});
        setLojaSelecionada(loja);

        if (dialogRef.current) {
            if (!dialogRef.current.open) 
                dialogRef.current.show();
            
            requestAnimationFrame(() => setMenuAberto(true));
        }
    };

    useImperativeHandle(ref, () => ({toggle, fechar}));

    useEffect(() => {
        const handleFecharExterno = (e) => 
            menuAberto && dialogRef.current && !dialogRef.current.contains(e.target)?fechar():undefined
        window.addEventListener('click', handleFecharExterno);
        window.addEventListener('scroll', fechar, true);
        return () => {
            window.removeEventListener('click', handleFecharExterno);
            window.removeEventListener('scroll', fechar, true);
        };
    }, [menuAberto]);

    const handleCliqueEditar = () => {
        if (!lojaSelecionada) return;
        fechar();
        const destino = rotaEdicao || location.pathname;

        if (location.pathname === destino) {
            const novosParams = new URLSearchParams(location.search);
            novosParams.set('id', lojaSelecionada.id);
            history.push({pathname: location.pathname, search: `?${novosParams.toString()}` });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else 
            history.push(`${destino}?id=${lojaSelecionada.id}`);
        
    };

    const handleCliqueDeletar = () => {
        if (onDeletar && lojaSelecionada) 
            onDeletar(lojaSelecionada);
        
        fechar();
    };

    return (
        <dialog ref={dialogRef} className={`modal-opcoes ${menuAberto ? 'aberto' : ''}`} style={{ top: `${posicaoMenu.top}px`, left: `${posicaoMenu.left}px` }}>
            {lojaSelecionada && (
                <div className="modal-opcoes-lista">
                    {lojaSelecionada?.isAdmin||lojaSelecionada?.isDono?(
                        <>
                            <button type="button" onClick={handleCliqueEditar}>
                                ✏️ Editar
                            </button>
                            <button type="button" className="opcao-deletar" onClick={handleCliqueDeletar}>
                                🗑️ Deletar
                            </button>
                        </>
                    ) : (
                        <>
                            <button type="button" onClick={() => { navigator.clipboard.writeText(window.location.href); fechar(); }}>
                                🔗 Compartilhar
                            </button>
                            <button type="button" className="opcao-deletar" onClick={() => { console.log("Denunciar", lojaSelecionada.id); fechar(); }}>
                                🚩 Denunciar
                            </button>
                        </>
                    )}
                </div>
            )}
        </dialog>
    );
});

export default MenuOpcoes;