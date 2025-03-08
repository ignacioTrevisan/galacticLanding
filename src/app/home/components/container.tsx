"use client"
import 'animate.css';
import { useState, useEffect } from 'react';
import './primerSeccion.css'
import Link from "next/link";
export default function Home() {
    const [id, setId] = useState('1');
    const [visible, setVisible] = useState(true)
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

            // Interpolación para la escala: de 0.7 a 1
            const scale = 0.9 + ((frame - 1) / (maxFrames - 1)) * 0.3;
            // Aplico la escala al elemento que desees; en este ejemplo a primerTexto
            primerTexto.style.transform = `scale(${scale})`;
            console.log(posicionActualDeScroll)
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
        <div className="contenedorPadre bg-black w-full h-full " id="contenedorPadre">

            <div className={`w-full contenedorIniciar bg-black ${visible ? 'block' : 'hidden'}`} id="contenedorIniciar">

                <div id='scrollPath' />
                <div id='progressBar' />

                <div className="flex flex-col justify-end w-full relative h-screen bg-black text-white text-5xl overflow-hidden">
                    <div className="fixed top-0 w-full min-h-screen bg-black z-1 "
                        style={{ opacity: `${+id * 1.5}%` }}
                    ></div>
                    <img src={`/frames2/ezgif-frame-001.jpg`} id="imagen" />
                    <div className={` mt-10 w-full fixed h-screen  flex-row justify-center pb-5 gap-y-3 items-center  z-10
        
        overflow-hidden flex  }
        `} id="primerTitulo"
                        style={{ opacity: 0 }}>
                        <div className="absolute ">
                            <h1 className="text-[48px]">Tu negocio merece una web de otro planeta</h1>
                            <h2 className="text-[24px] text-center">Creamos experiencias digitales que llevan tu marca a nuevas galaxias
                            </h2>
                        </div>
                    </div>
                    <div className={` mt-10 w-full fixed h-screen  flex-row justify-center pb-5 gap-y-3 items-center  z-10
        
        overflow-hidden flex }
        `}
                        style={{ opacity: 0 }}
                        id="segundoTitulo"
                    >



                        <img src="/glitch.png" alt="" className=" relative z-10 opacity-0  w-1 self-end " id="efectoGlitch" width={5} height={5} />
                        <div className="absolute flex flex-col justify-center" >
                            <h1 className="text-[72px] ">Galactic</h1>
                            <h3 className="text-center text-[#adadad] text-[32px]">{`<Code />`}
                            </h3>
                        </div>
                        <Link href={'/home'} className="text-white self-end cursor-pointer z-40" onClick={() => setVisible(false)}>Comienza tu viaje</Link>
                    </div>

                </div >
            </div>


        </div>
    );
}
