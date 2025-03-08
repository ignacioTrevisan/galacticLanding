"use client"
import 'animate.css';
import { useState, useEffect } from 'react';
import './primerSeccion.css'

export default function Home() {
  const [id, setId] = useState('1');
  const [visible, setVisible] = useState(true);
  const maxFrames = 100;

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
        } else {
          const ultimoDigito = +frame.toString().slice(-1);
          if (frame > 95) {
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
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">Tu negocio merece una web de otro planeta</h1>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl mt-4">Creamos experiencias digitales que llevan tu marca a nuevas galaxias</h2>
            </div>
          </div>

          {/* Segundo título con diseño responsivo */}
          <div className="mt-10 w-full fixed h-screen flex flex-col justify-center items-center z-10 px-4 md:px-8 overflow-hidden"
            style={{ opacity: 0 }}
            id="segundoTitulo">
            <img src="/glitch.png" alt="" className="relative z-10 opacity-0 w-1 self-end" id="efectoGlitch" width={5} height={5} />
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">Galactic</h1>
              <h3 className="text-center text-[#adadad] text-xl sm:text-2xl md:text-3xl">{`<Code />`}</h3>
            </div>
            <div className="mt-8 sm:mt-12 z-50">
              <button
                className="text-white py-2 px-4 border-0  hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer z-40"
                onClick={() => { setVisible(false); window.location.replace('/inicio') }}>
                Comienza tu viaje
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* {!visible && <ContenedorSecundario />} */}
    </div>
  );
}