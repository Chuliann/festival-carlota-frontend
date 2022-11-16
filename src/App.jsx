import { useEffect, useState } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Reproductor from "./components/Reproductor.jsx";
import Comprar from './components/Comprar.jsx';
import Mensaje from './components/Mensaje.jsx';
import Ingreso from './components/Ingreso.jsx';


import cartel from "./imgp/cartel.png";
import boton from "./imgp/boton.png";

function App() {

  const [pregunta, setPregunta] = useState(0);
  const [activarPagina, setActivarPagina] = useState(false);
  const [activarSeccion, setActivarSeccion] = useState(false);
  const [respErronea, setRespErronea] = useState(false);

  const handleCuestionario = () => {
    if(pregunta === 1) {
      setActivarSeccion(true);
      localStorage.setItem("respondio", true);
    } else {
      setRespErronea(true);
    }
  }

  useEffect(() => {
    if(respErronea) {
      setTimeout(() => {
        setRespErronea(false);
      }, 3000)
    }
  }, [respErronea]);

  useEffect(() => {
    
    const respondio = localStorage.getItem("respondio");
    if(respondio) setActivarSeccion(true);

    const ingresoCodigo = localStorage.getItem("ingreso");
    if(ingresoCodigo) setActivarPagina(true);
  }, [])

  return (
      <Router>
        <Routes>
          <Route index path='/' element={activarPagina ? (
            <>
            {!activarSeccion ? (
              <div className='entrar'>
              <div className='descripcion'>
                <div className='info'>
                  <div className='info-titulo'>
                    <h2>Preestreno de</h2>
                    <h1>La piedra <br></br> en el zapato</h1>
                    <p>para Normalistas Rurales</p>
                    <div className='cont-precio sitio'>
                      <span>Precio:</span>  <p> Contribución voluntaria</p>
                    </div>
                  </div>
                </div>
                <div className='contenedor_cartel'>
                  <div className='cont-precio celular'>
                    <span>Precio:</span><p> Contribución voluntaria</p>
                  </div>
                  <img src={cartel} alt="cartel"></img>
                </div>
              </div>
              <div className='cuestionario__pregunta'>
                <p>Responde a esta pregunta para acceder <br></br> a la página del video: </p>
  
              </div>
              <div className='cuestionario'>
                <p>¿En que año se fundo la FECSM?</p>
                <div className='cuestionario__botones'>
                  <button className={`boton ${pregunta === 1 ? "btn__activo" : ""}`} onClick={() => setPregunta(1)}>1935</button>
                  <button className={`boton ${pregunta === 2 ? "btn__activo" : ""}`} onClick={() => setPregunta(2)}>1985</button>
                  <button className={`boton ${pregunta === 3 ? "btn__activo" : ""}`} onClick={() => setPregunta(3)}>1995</button>
                </div>
                <button className='cuestionario__enviar' onClick={() => handleCuestionario()}><img src={boton} alt="boton"></img></button>
              </div>
              <div className='celular espacio__blanco'></div>
              {respErronea ? (<Mensaje tipo={"fracaso"}>Respuesta erronea</Mensaje>) :
                null
              }
            </div>
            ) : (
              <Reproductor />
            )}
          </>
          ) : (
            <Ingreso setActivarPagina={setActivarPagina} />
          )} />

        <Route path='/comprar' element={<Comprar />} />


      </Routes>
    </Router>
  )
}

export default App
