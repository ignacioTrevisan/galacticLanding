"use client"
import 'animate.css';
import { useState, useEffect } from 'react';
import './segundaSeccion.css'
import 'animate.css';

export default function ContenedorSecundario() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const contenedor = document.getElementById('contenedorSecundario') as HTMLDivElement;
        const video = document.getElementById('video') as HTMLVideoElement;
        window.scrollTo(0, 0);

        const handleScroll = () => {
            if (!contenedor) return;
            console.log('scroll')

            const mitadDeScroll = contenedor.scrollHeight / 2;
            const posicionActualDeScroll = window.scrollY;
            const fraccionDeScroll = posicionActualDeScroll / mitadDeScroll;
            const valor = fraccionDeScroll > 1 ? 1 : fraccionDeScroll
            const opacidad = (1 - valor) * 100
            console.log(opacidad.toString().split('.')[0])
            video.style.opacity = `${opacidad.toString().split('.')[0]}%`
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    return (
        <div className={`w-full contenedorSecundario flex justify-center bg-black ${visible ? 'block' : 'hidden'} animate__animated animate__fadeIn animate__delay-2s animate__slow`} id="contenedorSecundario">
            <div className="flex flex-col justify-end relative h-screen bg-black text-white text-5xl" id='video'>
                <video src="https://res.cloudinary.com/nachotrevisan/video/upload/v1741385181/Video2_qwjjty.mp4" className=" fixed top-0" autoPlay loop muted></video>
                <div className={`contenedor self-end w-full mb-5 h-32`}>
                    <p className="texto text-7xl">No dejes tu negocio a la deriva en el espacio digital</p>
                </div>
            </div>
        </div>
    );
}
