"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "../home/components/navbar";
import "./inicio.css";
import '../components/outro.css'
import 'animate.css';
import { ReactLenis } from '@studio-freight/react-lenis';
// import ClientCard from "@/components/clientCard";
gsap.registerPlugin(useGSAP, ScrollTrigger);

interface CardProps {
    title: string;
    copy: string;
    index: number;
}

const Card = ({ title, copy, index }: CardProps) => {
    const [isLargeImage, setIsLargeImage] = useState(false);
    return (
        <div className="card z-50" id={`card-${index + 1}`}>
            <div className="card-inner">
                <div className="card-content">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl">{title}</h1>
                    <p className="text-sm sm:text-base md:text-lg">{copy}</p>
                </div>
                <div
                    className={isLargeImage ? "card-img-grande" : "card-img"}
                    onClick={() => setIsLargeImage(!isLargeImage)}
                >
                    <img
                        src={`/cards/cards-${index + 1}.jpg`}
                        className="rounded-xl w-full h-full object-cover"
                        alt={title}
                    />
                </div>
            </div>
        </div>
    );
};

export default function Template() {
    const container = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [showScrollMessage, setShowScrollMessage] = useState(false);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
    const [isMessageShowed, setisMessageShowed] = useState(false)
    // Manejo del mensaje de scroll
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollMessage(false);
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }

            scrollTimeout.current = setTimeout(() => {
                if (isMessageShowed === true) return;
                setisMessageShowed(true)
                setShowScrollMessage(true);
            }, 15000); // 2 segundos
        };

        window.addEventListener('scroll', handleScroll);

        // Iniciar el timeout cuando se carga la página
        scrollTimeout.current = setTimeout(() => {
            if (isMessageShowed === true) return;
            setisMessageShowed(true)
            setShowScrollMessage(true);
        }, 5000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, []);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    useGSAP(() => {
        ScrollTrigger.getAll().forEach(st => st.kill());
        if (isMobile) {
            const cards = gsap.utils.toArray<HTMLDivElement>(".card");
            cards.forEach((card) => {
                gsap.set(card, { clearProps: "all" });
                const cardInner = card.querySelector(".card-inner");
                if (cardInner) {
                    gsap.set(cardInner, { clearProps: "all" });
                }
            });
            return;
        }

        const cards = gsap.utils.toArray<HTMLDivElement>(".card");

        ScrollTrigger.create({
            trigger: cards[0],
            start: "top 35%",
            endTrigger: cards[cards.length - 1],
            end: "top 30%",
            pin: ".intro",
            pinSpacing: false,
        });

        cards.forEach((card, index) => {
            const isLastCard = index === cards.length - 1;
            const cardInner = card.querySelector(".card-inner");

            if (!isLastCard) {
                ScrollTrigger.create({
                    trigger: card,
                    start: "top 35%",
                    endTrigger: ".outro",
                    end: "top 65%",
                    pin: true,
                    pinSpacing: false,
                });
            }

            gsap.to(cardInner, {
                y: `-${(cards.length - index) * 14}vh`,
                ease: "none",
                scrollTrigger: {
                    trigger: card,
                    start: "top 35%",
                    endTrigger: ".outro",
                    end: "top 65%",
                    scrub: true,
                },
            });
        });
    }, { scope: container, dependencies: [isMobile] });

    const cards = [
        {
            title: "Órbita Personal",
            copy: "Una página web minimalista y elegante para profesionales o freelancers que quieren destacar su marca personal. Ideal para portfolios, blogs o currículums digitales con un diseño limpio y estelar.",
        },
        {
            title: "Nebulosa Empresarial",
            copy: "Una web completa para pequeñas y medianas empresas que buscan una presencia digital profesional. Incluye secciones como 'quiénes somos', servicios y contacto, con un toque futurista y optimización SEO.",
        },
        {
            title: "Cohete E-Commerce",
            copy: "Una tienda online diseñada para despegar ventas. Perfecta para negocios que venden productos o servicios, con carrito de compras, pasarelas de pago y un diseño visual que brilla como una galaxia.",
        },
        {
            title: "Estación de Contenidos",
            copy: "Una plataforma dinámica para creadores de contenido, como blogs o sitios de noticias. Con un diseño adaptable y efectos visuales que llevan la experiencia de lectura a otro planeta.",
        },
    ];

    const [outroVisible, setOutroVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const contenedor = document.getElementById("contenedorSecundario") as HTMLDivElement;
            const video = document.getElementById("video") as HTMLVideoElement;
            const imagen = document.getElementById("imagenOutro") as HTMLImageElement;
            const continuara = document.getElementById('titulo') as HTMLTitleElement;

            if (!contenedor || !video || !imagen) return;

            if (isMobile) {
                const cardsElements = document.querySelectorAll('.card');
                cardsElements.forEach(card => {
                    (card as HTMLElement).style.transform = 'none';
                    const inner = card.querySelector('.card-inner');
                    if (inner) {
                        (inner as HTMLElement).style.transform = 'none';
                    }
                });
            }

            const mitadDeScroll = contenedor.scrollHeight / 7;
            const posicionActualDeScroll = window.scrollY;
            const fraccionDeScroll = posicionActualDeScroll / mitadDeScroll;
            const valor = fraccionDeScroll > 1 ? 1 : fraccionDeScroll;
            const opacidad = (1 - valor) * 100;

            video.style.opacity = `${opacidad.toString().split(".")[0]}%`;

            const cardsSection = document.querySelector('.cards') as HTMLElement;
            const cardsSectionBottom = cardsSection ? cardsSection.getBoundingClientRect().bottom : 0;

            const factorMultiplicador = isMobile ? 1.5 : 5;
            const factorOpacidad = isMobile ? 1 : 4;

            const puntoInicioFrames = isMobile
                ? posicionActualDeScroll + cardsSectionBottom - (window.innerHeight / 2)
                : contenedor.scrollHeight - (window.innerHeight * factorMultiplicador);

            const puntoInicioOpacidad = isMobile
                ? posicionActualDeScroll + cardsSectionBottom - window.innerHeight
                : contenedor.scrollHeight - (window.innerHeight * factorOpacidad);

            if (posicionActualDeScroll > puntoInicioFrames) {
                const distanciaRecorrida = posicionActualDeScroll - puntoInicioFrames;
                const totalDistancia = isMobile ? window.innerHeight * 1.5 : window.innerHeight * factorMultiplicador;
                const progreso = distanciaRecorrida / totalDistancia;
                const frame = Math.min(140, Math.max(1, Math.floor(progreso * 139) + 1));

                const idStr = frame.toString().padStart(3, "0");
                imagen.src = `/asteroidesFrames/ezgif-frame-${idStr}.jpg`;

                // Calcular la opacidad de la imagen basada en el frame
                // Comenzamos el desvanecimiento en el frame 70 y terminamos en el frame 120
                const fadeStartFrame = 70;
                const fadeEndFrame = 120;

                if (frame >= fadeStartFrame) {
                    // Calcular la opacidad basada en el progreso de frame
                    const fadeProgress = (frame - fadeStartFrame) / (fadeEndFrame - fadeStartFrame);
                    // Limitar el progreso entre 0 y 1
                    const clampedProgress = Math.min(1, Math.max(0, fadeProgress));
                    // Calcular la opacidad (de 1 a 0)
                    const imageOpacity = 1 - clampedProgress;

                    // Aplicar la opacidad a la imagen
                    imagen.style.opacity = imageOpacity.toString();

                    // Asegurarse de que el texto siempre está visible
                    continuara.style.opacity = '1';
                } else {
                    // Antes del inicio del desvanecimiento, tanto la imagen como el texto están completamente visibles
                    imagen.style.opacity = '1';
                    continuara.style.opacity = '1';
                }
            }

            if (posicionActualDeScroll <= puntoInicioOpacidad) {
                imagen.style.opacity = "0";
                setOutroVisible(false);
            } else {
                setOutroVisible(true);
                // No establecer la opacidad aquí ya que se maneja en la lógica anterior
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMobile]);

    // const clients = [
    //     {
    //         id: 1,
    //         name: "ViaCertatur",
    //         image: "/clients/1.jpg",
    //         description: "Lading page personalizable para negocio organizador de viajes",
    //         url: 'https://www.viacertatur.com/'
    //     },
    //     {
    //         id: 2,
    //         name: "Teslo Shop",
    //         image: "/clients/2.png",
    //         description: "E-comerce con funcionalidades completas integrado con paypal.",
    //         url: 'https://tesloshoptrev.vercel.app/'
    //     },
    //     {
    //         id: 3,
    //         name: "Cine Click",
    //         image: "/clients/3.png",
    //         description: "Gestor de cartelera con compras en landing incluida",
    //         url: 'https://cine-click-zeta.vercel.app/'
    //     },
    //     {
    //         id: 4,
    //         name: "Share your spot",
    //         image: "/clients/4.png",
    //         description: "Localizador en tiempo real y reproductor de ubicacion",
    //         url: '#'
    //     }
    // ];
    const Lenis = ReactLenis as unknown as React.FC<{ root?: boolean; children: React.ReactNode }>;

    return (
        <Lenis root>
            <Navbar />

            <div className="bodyContainer animate__animated animate__fadeIn" ref={container} id="contenedorSecundario">
                <section className="hero">
                    <video
                        src="https://res.cloudinary.com/nachotrevisan/video/upload/v1741385181/Video2_qwjjty.mp4"
                        className="fixed z-30 top-0 w-full h-full object-cover"
                        id="video"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </section>
                <section className="intro px-4" id="intro">
                    <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                        No dejes tu negocio a la deriva en el espacio digital
                    </h1>
                </section>

                <section className={`cards relative z-50 ${isMobile ? 'mobile-cards' : ''}`} id='servicios'>
                    {cards.map((c, index) => (
                        <Card {...c} index={index} key={index} />
                    ))}
                </section>

                <section className={`outro text-[#6A0DAD] px-4 transition-all w-full pointer-events-none`} id='clientes'
                    style={{ opacity: outroVisible ? 1 : 0, pointerEvents: 'fill' }}>
                    <div id="outroContainer" className="relative">
                        <div
                            className="z-10 sticky top-10 text-white transition-opacity duration-5000 mb-6 md:mb-12"
                            style={{ opacity: outroVisible ? 1 : 0 }}
                        >
                            {/* <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Nuestros clientes</h1> */}
                        </div>
                        <div
                            className={`client-cards-container sticky top-40 z-20 transition-opacity duration-5000 w-full mx-auto`}
                            style={{ opacity: outroVisible ? 1 : 0 }}
                            id="clientsContainer"
                        >
                            <h1 className="text-4xl sm:text-6xl text-white text-center transition-all duration-4000" id='titulo'>Continuara...</h1>
                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                {clients.map((client) => (
                                    <ClientCard
                                        key={client.id}
                                        client={client}
                                        url={client.url}
                                        containerId="clientsContainer"
                                        className="animate__animated animate__fadeIn animate__slower"
                                    />
                                ))}
                            </div> */}
                        </div>
                        <img
                            src="/asteroidesFrames/ezgif-frame-001.jpg"
                            alt=""
                            className={`top-0 w-full h-full object-cover ${!outroVisible ? 'hidden' : 'fixed'}`}
                            id='imagenOutro'
                            style={{ transition: "opacity 0.3s ease" }}
                        />
                    </div>
                </section>

                {/* Mensaje de scroll */}
                {showScrollMessage && (
                    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 animate__animated animate__fadeIn">
                        <div className="bg-white/90 text-black px-4 py-2 rounded-full shadow-lg">
                            <p className="text-sm md:text-base">Scrolee hacia abajo</p>
                        </div>
                    </div>
                )}
            </div>
        </Lenis>
    );
}