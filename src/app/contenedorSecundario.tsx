"use client"
import Image from "next/image";
import 'animate.css';
import { useState, useEffect, useRef } from 'react';
import './primerSeccion.css'
import './segundaSeccion.css'
import 'animate.css';

export default function ContenedorSecundario() {
    const [id, setId] = useState('1');
    const [visible, setVisible] = useState(false);
    const [navVisible, setNavVisible] = useState(false);
    const maxFrames = 100;

    useEffect(() => {
        setVisible(true);
        const contenedor = document.getElementById('contenedorSecundario');
        const imagen = document.getElementById('imagen') as HTMLImageElement;
        const primerTexto = document.getElementById('primerTitulo') as HTMLDivElement;
        const segundoTexto = document.getElementById('segundoTitulo') as HTMLDivElement;
        const textoParaGlitch = document.getElementById('efectoGlitch') as HTMLDivElement;
        window.scrollTo(0, 0);

        const handleScroll = () => {
            if (!contenedor || !imagen) return;

            const maxScroll = contenedor.scrollHeight - window.innerHeight;
            const mitadDeScroll = contenedor.scrollHeight / 2;
            const posicionActualDeScroll = window.scrollY;
            const fraccionDeScroll = posicionActualDeScroll / mitadDeScroll;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setNavVisible(true);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="contenedorPadre bg-black w-full h-full animate__animated animate__fadeIn animate__delay-2s animate__slow" id="contenedorPadre">
            <div className={`w-full contenedorSecundario flex justify-center bg-black ${visible ? 'block' : 'hidden'}`} id="contenedorIniciar">
                <div className="flex flex-col justify-end relative h-screen bg-black text-white text-5xl">
                    <div className={`flex flex-col justify-start px-5 text-sm fixed top-10 w-full z-30 }`}>
                        <div className='self-start flex-col absolute animacionPorDefecto'>
                            <p className='cursor-pointer'>{`Galactic`}</p>
                            <p className='cursor-pointer'>{`<Code>`}</p>
                        </div>
                        <div className={`self-end flex gap-3 ${navVisible ? 'animate__animated animate__fadeIn animate__slow' : 'hidden'}`}>
                            <p className='cursor-pointer'>Inicio</p>
                            <p className='cursor-pointer'>Porfolio</p>
                            <p className='cursor-pointer'>Servicios</p>
                            <p className='cursor-pointer'>Blog</p>
                            <p className='cursor-pointer'>Equipo</p>
                        </div>
                    </div>
                    <video src="/video2.mp4" className="absolute top-0" autoPlay loop muted></video>
                    <div className={`contenedor self-end w-full mb-5 h-32`}>
                        <p className="texto text-7xl">No dejes tu negocio a la deriva en el espacio digital</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
