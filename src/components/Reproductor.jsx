import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Reproductor = () => {
    const [permiso, setPermiso] = useState(false);
    const [pago, setPago] = useState(false);
    const [cuponInput, setCuponInput] = useState("");
    const [tiempo, setTiempo] = useState(false);
    const [verTrailer, setVerTrailer] = useState(true);
    const [error, setError] = useState("");

    const handleCuponInput = async () => {
        if (cuponInput.length > 0) {
            const body = {
                codigo: cuponInput,
            };
            try {
                await fetch("https://normalismorural.com/acceso/api/usar_cupon.php", {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.exito) {
                            localStorage.setItem("normalismo_permiso", true);
                            localStorage.setItem("cupon_normalismo", cuponInput);
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
            await fetch("https://normalismorural.com/acceso/api/obtener_cupon.php", {
                method: "POST",
                body: JSON.stringify({
                    codigo: localStorage.getItem("cupon_normalismo"),
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
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
            setError("Se termino el tiempo, compra otra clave o abandona el sitio.");
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
            setVerTrailer(false);
        }
        if (localStorage.getItem("normalismo_permiso")) {
            loop();
        }
        if(localStorage.getItem('cupon_normalismo')) {
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
        }, 70000);

    }, [tiempo]);

    useEffect(() => {
        setTimeout(() => {
            setError("");
        }, 3000);
    }, [error]);

    return (
        <>
            <div id="video">
                {permiso ? (
                    <iframe
                        src="https://player.vimeo.com/video/745694304?h=d3650cd2a6&amp;app_id=122963\"
                        width="1024"
                        height="600"
                        frameborder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div>
                        {tiempo && verTrailer ? (
                            <div>
                                <iframe
                                    src="https://www.youtube-nocookie.com/embed/mE8TNut5p1E?autoplay=1"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="cupon">
                                <div className="cupon__titulo">
                                    Introduce la clave <br></br> para continuar
                                    viendo
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
                                        <button
                                            onClick={() => handleCuponInput()}
                                        >
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
                                        {pago ? "Ver mi cupon" : "La clave solo dura 24 horas"}
                                    </Link>
                                    {error && (
                                        <div class="alert alert-dismissible alert-danger">
                                            <strong>{error}</strong>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!verTrailer && !permiso ? (
                    <div id="overlay"></div>
                ) : null}
            </div>
        </>
    );
};

export default Reproductor;
