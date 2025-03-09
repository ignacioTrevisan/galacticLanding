"use client"
import 'animate.css';
import { useState, useEffect, useRef } from 'react';
import './primerSeccion.css'

export default function Home() {
  const [id, setId] = useState('1');
  const [visible, setVisible] = useState(true);
  const [showScrollMessage, setShowScrollMessage] = useState(false);
  const maxFrames = 100;
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Manejo del mensaje de scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollMessage(false);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        setShowScrollMessage(true);
      }, 15000); // 2 segundos
    };

    window.addEventListener('scroll', handleScroll);

    // Iniciar el timeout cuando se carga la página
    scrollTimeout.current = setTimeout(() => {
      setShowScrollMessage(true);
    }, 2000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);
  const [yaestaabajo, setYaestaabajo] = useState(false)
  useEffect(() => {
    const contenedor = document.getElementById('contenedorIniciar');
    const imagen = document.getElementById('imagen') as HTMLImageElement;
    const primerTexto = document.getElementById('primerTitulo') as HTMLDivElement;
    const segundoTexto = document.getElementById('segundoTitulo') as HTMLDivElement;
    const textoParaGlitch = document.getElementById('efectoGlitch') as HTMLDivElement;
    const progress = document.getElementById('progressBar') as HTMLDivElement;

    const handleScroll = () => {
      if (!contenedor || !imagen) return;

      const mitadDeScroll = contenedor.scrollHeight;
      const posicionActualDeScroll = window.scrollY;
      const fraccionDeScroll = posicionActualDeScroll / mitadDeScroll;

      progress.style.height = `${posicionActualDeScroll}px`;

      const frame = Math.floor(fraccionDeScroll * maxFrames) || 1;
      setId(frame.toString());
      const idStr = frame.toString().padStart(3, '0');
      imagen.src = `/frames2/ezgif-frame-${idStr}.jpg`;

      // Interpolación para la escala: de 0.9 a 1.2
      const scale = 0.9 + ((frame - 1) / (maxFrames - 1)) * 0.3;
      primerTexto.style.transform = `scale(${scale})`;

      if (frame > 90) {
        if (frame > 99) {
          primerTexto.style.opacity = '0';
          setYaestaabajo(true)
        } else {
          const ultimoDigito = +frame.toString().slice(-1);
          if (frame > 95) {
            setYaestaabajo(true)
            textoParaGlitch.classList.add('glitch');
          } else {
            textoParaGlitch.classList.remove('glitch');
          }
          segundoTexto.style.opacity = ((ultimoDigito * 10) / 100).toString();
          const opacidad = (100 - (ultimoDigito * 10)) / 100;
          primerTexto.style.opacity = opacidad.toString();
        }
      } else {
        segundoTexto.style.opacity = '0';
        primerTexto.style.opacity = (frame < 5 ? 0 : frame / (maxFrames / 2)).toString();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="contenedorPadre bg-black w-full h-full" id="contenedorPadre">
      <div className={`w-full contenedorIniciar bg-black ${visible ? 'block' : 'hidden'}`} id="contenedorIniciar">
        <div id='scrollPath' />
        <div id='progressBar' />
        <div className="flex flex-col justify-end w-full relative h-screen bg-black text-white overflow-hidden">
          <div className="fixed top-0 w-full min-h-screen bg-black z-1"
            style={{ opacity: `${+id * 1.5}%` }}
          ></div>
          <img src={`/frames2/ezgif-frame-001.jpg`} id="imagen" className="object-cover" />

          {/* Primer título con diseño responsivo */}
          <div className="mt-10 w-full fixed h-screen flex flex-col justify-center items-center z-10 px-4 md:px-8 overflow-hidden"
            id="primerTitulo"
            style={{ opacity: 0 }}>
            <div className="text-center w-full mx-auto">
              <h1 className="text-[48px] sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">Tu negocio merece una web de otro planeta</h1>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl mt-4">Creamos experiencias digitales que llevan tu marca a nuevas galaxias</h2>
            </div>
          </div>

          {/* Segundo título con diseño responsivo */}
          <div className="mt-10 w-full fixed h-screen flex flex-col justify-center items-center z-10 px-4 md:px-8 overflow-hidden"
            style={{ opacity: 0 }}
            id="segundoTitulo">
            <img src="/glitch.png" alt="" className="relative z-50 opacity-0 w-1 self-end" id="efectoGlitch" width={5} height={5} />
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">Galactic</h1>
              <h3 className="text-center text-[#adadad] text-xl sm:text-2xl md:text-3xl">{`<Code />`}</h3>
            </div>
            <div className="mt-8 sm:mt-12 z-50">
              <button
                className="text-white bg-black bg-opacity-50 py-3 px-6 rounded-full border border-blue-400 shadow-lg shadow-blue-500/50 hover:bg-indigo-900 hover:text-blue-200 hover:border-blue-300 hover:shadow-blue-400/70 transition-all duration-300 cursor-pointer z-40 font-medium tracking-wider relative"
                onClick={() => { setVisible(false); window.location.replace('/inicio') }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Versión estática del texto */}
                <div
                  className="transition-opacity duration-300"
                  style={{ opacity: isHovered ? 0 : 1 }}
                >
                  Comienza tu viaje
                </div>

                {/* Versión animada con la flecha */}
                <div
                  className="absolute inset-0 flex items-center justify-center px-3"
                  style={{ opacity: isHovered ? 1 : 0 }}
                >
                  <span
                    className="relative whitespace-nowrap transition-all duration-1000"
                    style={{
                      clipPath: isHovered ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)'
                    }}
                  >
                    Comienza tu viaje
                  </span>
                  <span
                    className=" absolute text-blue-300 transition-transform duration-1000"
                    style={{
                      transform: isHovered ? 'translateX(1100%)' : 'translateX(-100%)'
                    }}
                  >
                    &#10095;
                  </span>

                </div>
              </button>
            </div>
          </div>

          {/* Mensaje de scroll */}
          {(showScrollMessage && !yaestaabajo) && (
            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 animate__animated animate__fadeIn">
              <div className="bg-white/90 text-black px-4 py-2 rounded-full shadow-lg">
                <p className="text-sm md:text-base">Scrolee hacia abajo</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* {!visible && <ContenedorSecundario />} */}
    </div>
  );
}