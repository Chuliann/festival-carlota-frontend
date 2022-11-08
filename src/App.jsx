import { useEffect, useState } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Reproductor from "./components/Reproductor.jsx";
import Comprar from './components/Comprar.jsx';

/* import { chequearCodigo } from './utils/funciones.js'; */

import cartel from "./imgp/cartel.png";
import boton from "./imgp/boton.png";

function App() {

  const [pregunta, setPregunta] = useState(0);
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
  }, [])

  return (
      <Router>
        <Routes>
          <Route index path='/' element={!activarSeccion ? (
            <div className='entrar'>
            <div className='descripcion'>
              <div className='info'>
                <div className='info-titulo'>
                  <h2>Preestreno de</h2>
                  <h1>La piedra <br></br> en el zapato</h1>
                  <p>para Normalistas Rurales</p>
                  <div className='cont-precio'>
                    <span>Precio:</span>  <p> Contribución voluntaria</p>
                  </div>
                </div>
              </div>
              <img src={cartel} alt="cartel"></img>
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
            {respErronea ? (<Mensaje>Respuesta erronea</Mensaje>) :
              null
            }
          </div>
        ) : 
          <Reproductor />
        } />

        <Route path='/comprar' element={<Comprar />} />
        {/* <Route path='/success' element={<Confirmar />} /> */}


      </Routes>
    </Router>
  )
}

export default App
