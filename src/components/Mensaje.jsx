const Mensaje = ({children, tipo}) => {


    return(
        <div className={`alerta__respuesta ${tipo} alerta__activa`}>
            {children}
        </div>
    ); 
}

export default Mensaje;