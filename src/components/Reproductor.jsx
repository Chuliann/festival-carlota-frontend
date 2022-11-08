import { useState, useEffect } from "react";
import {Link} from "react-router-dom";

const Reproductor = () => {
    const [pago, setPago] = useState(false);
    const [cuponInput, setCuponInput] = useState("");
    const [tiempo, setTiempo] = useState(false);
    const [video, setVideo] = useState("");

    const handleCuponInput = () => {
        console.log(cuponInput);
    };

    const handleCompra = () => {
        

        fetch("http://localhost/api/create-checkout-session.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(precioInput),
        })
        .then(response => response.json())
        .then(data => console.log(data));
    };



    useEffect(() => {
        setTiempo(true);
        const llamarVideo = async () => {
            await fetch("https://vimeo.com/api/oembed.json?url=https://vimeo.com/745694304/d3650cd2a6")
            .then(response => response.json())
            .then(data => console.log(data));
        }
        llamarVideo();
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setTiempo(false);
        }, 5000);
    }, [tiempo])

    return (
        <>
            <div id="video">
            {tiempo ? (
                <div>
                    <iframe src="https://player.vimeo.com/video/745694304?h=d3650cd2a6&amp;app_id=122963" width="auto" height="auto" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                </div>
            ) : (
                <div className="cupon">
                <div className="cupon__titulo">
                    Introduce la clave <br></br> para continuar viendo
                </div>
                <div className="cupon__cuerpo">
                    <p>
                        {" "}
                        <b>A)</b> Introducir Clave{" "}
                    </p>
                    <div className="cupon__ingresar">
                        <input
                            type="number"
                            placeholder="XX-XXXX-XX"
                            onChange={(e) => setCuponInput(e.target.value)}
                        />
                        <button onClick={() => handleCuponInput()}>
                            Ingresar
                        </button>
                    </div>
                    <p>
                        {" "}
                        <b>B)</b> Comprar Clave
                    </p>
                    <Link
                        className="cupon__boton"
                        to="/comprar"
                    >
                        La clave solo dura 6 horas
                    </Link>
                </div>
            </div>
            )}
            
            {!tiempo ? <div id="overlay"></div> : null}
            </div>
        </>
    );
};

export default Reproductor;
