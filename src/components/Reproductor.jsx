import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Reproductor = () => {
    const [permiso, setPermiso] = useState(false);
    const [pago, setPago] = useState(false);
    const [cuponInput, setCuponInput] = useState("");
    const [tiempo, setTiempo] = useState(false);
    const [verFragmento, setVerFragmento] = useState(true);
    const [error, setError] = useState("");

    const handleCuponInput = async () => {
        if (cuponInput.length > 0) {
            const body = {
                codigo: cuponInput,
            };
            try {
                await fetch(
                    "https://normalismorural.com/acceso/api/usar_cupon.php",
                    {
                        method: "POST",
                        body: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.exito) {
                            localStorage.setItem("normalismo_permiso", true);
                            localStorage.setItem(
                                "cupon_normalismo",
                                cuponInput
                            );
                            setPermiso(true);
                        } else {
                            setError(data.error);
                        }
                    });
            } catch (error) {
                console.log(error);
            }
        }
    };

    const chequearCupon = async () => {
        try {
            await fetch(
                "https://normalismorural.com/acceso/api/obtener_cupon.php",
                {
                    method: "POST",
                    body: JSON.stringify({
                        codigo: localStorage.getItem("cupon_normalismo"),
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
                .then((response) => response.json())
                .then((data) => handlePelicula(data.diferencia));
        } catch (error) {
            console.log(error);
        }
    };

    const handlePelicula = (valor) => {
        if (valor < 24) {
            setPermiso(true);
        } else {
            setPermiso(false);
            setError(
                "Se termino el tiempo, compra otra clave o abandona el sitio."
            );
        }
    };

    const loop = () => {
        setInterval(() => {
            chequearCupon();
        }, 600000);
    };

    useEffect(() => {
        setTiempo(true);
        if (localStorage.getItem("entro")) {
            setVerFragmento(false);
        }
        if (localStorage.getItem("normalismo_permiso")) {
            loop();
        }
        if (localStorage.getItem("cupon_normalismo")) {
            setPago(true);
        }
    }, []);

    useEffect(() => {
        if (localStorage.getItem("normalismo_permiso")) {
            loop();
        }
    }, [permiso]);

    useEffect(() => {
        setTimeout(() => {
            setTiempo(false);
            localStorage.setItem("entro", true);
            setVerFragmento(false);
        }, 30000);
    }, [tiempo]);

    useEffect(() => {
        setTimeout(() => {
            setError("");
        }, 3000);
    }, [error]);

    return (
        <>
            <div id="video">
                {permiso || verFragmento  ? (
                    <iframe
                        src="https://player.vimeo.com/video/745694304?h=d3650cd2a6&amp;app_id=122963\"
                        width="1024"
                        height="600"
                        frameborder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    ></iframe>
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
                                    type="text"
                                    placeholder="XX-XXXX-XX"
                                    onChange={(e) =>
                                        setCuponInput(e.target.value)
                                    }
                                />
                                <button onClick={() => handleCuponInput()}>
                                    Ingresar
                                </button>
                            </div>
                            <p>
                                {" "}
                                <b>B)</b> Comprar Clave
                            </p>
                            <Link className="cupon__boton" to="/comprar">
                                {pago
                                    ? "Ver mi cupon"
                                    : "La clave tiene una validez de 24 horas"}
                            </Link>
                            {error && (
                                <div class="alert alert-dismissible alert-danger">
                                    <strong>{error}</strong>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!verFragmento && !permiso ? <div id="overlay"></div> : null}
            </div>
        </>
    );
};

export default Reproductor;
