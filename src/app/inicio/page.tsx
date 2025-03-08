"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "../home/components/navbar";
import "./inicio.css";
import '../components/outro.css'
import ClientCard from "@/components/clientCard";
import 'animate.css';
import { ReactLenis } from '@studio-freight/react-lenis';
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

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        // Comprobar al cargar
        checkScreenSize();
        // Comprobar cuando cambia el tamaño de la ventana
        window.addEventListener('resize', checkScreenSize);
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    useGSAP(() => {
        // Clear any existing ScrollTriggers to prevent conflicts on re-renders
        ScrollTrigger.getAll().forEach(st => st.kill());
        if (isMobile) {
            // Para móvil, limpiamos cualquier estilo residual de ScrollTrigger
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

        // Pin the intro section
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

            // Skip the last card for pinning but still animate its inner content
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

            // Apply the vertical offset animation to all cards including the last one
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

            if (!contenedor || !video || !imagen) return;


            if (isMobile) {
                // Asegurarnos de que las cards no interfieran con el outro en móvil
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

            // Verificar si las cards terminaron
            const cardsSection = document.querySelector('.cards') as HTMLElement;
            const cardsSectionBottom = cardsSection ? cardsSection.getBoundingClientRect().bottom : 0;

            // Ajustar los puntos de inicio según el tamaño de la pantalla
            const factorMultiplicador = isMobile ? 1.5 : 5; // Reducido para móvil
            const factorOpacidad = isMobile ? 1 : 4; // Reducido para móvil

            // Punto de inicio para los frames - en móvil usar la posición de las cards
            const puntoInicioFrames = isMobile
                ? posicionActualDeScroll + cardsSectionBottom - (window.innerHeight / 2)
                : contenedor.scrollHeight - (window.innerHeight * factorMultiplicador);

            // Punto de inicio para la opacidad - en móvil mostrar justo después de las cards
            const puntoInicioOpacidad = isMobile
                ? posicionActualDeScroll + cardsSectionBottom - window.innerHeight
                : contenedor.scrollHeight - (window.innerHeight * factorOpacidad);

            // Cambiar frames desde el punto de inicio
            if (posicionActualDeScroll > puntoInicioFrames) {
                const distanciaRecorrida = posicionActualDeScroll - puntoInicioFrames;
                const totalDistancia = isMobile ? window.innerHeight * 1.5 : window.innerHeight * factorMultiplicador;
                const progreso = distanciaRecorrida / totalDistancia;
                const frame = Math.min(140, Math.max(1, Math.floor(progreso * 139) + 1));
                const idStr = frame.toString().padStart(3, "0");
                imagen.src = `/asteroidesFrames/ezgif-frame-${idStr}.jpg`;
            }

            // Control de opacidad
            if (posicionActualDeScroll <= puntoInicioOpacidad) {
                imagen.style.opacity = "0";
                setOutroVisible(false);
            } else {
                setOutroVisible(true);
                imagen.style.opacity = "1";
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMobile]);

    const clients = [
        {
            id: 1,
            name: "ViaCertatur",
            image: "/clients/1.jpg",
            description: "Lading page personalizable para negocio organizador de viajes",
            url: 'https://www.viacertatur.com/'
        },
        {
            id: 2,
            name: "Teslo Shop",
            image: "/clients/2.png",
            description: "E-comerce con funcionalidades completas integrado con paypal.",
            url: 'https://tesloshoptrev.vercel.app/'
        },
        {
            id: 3,
            name: "Cine Click",
            image: "/clients/3.png",
            description: "Gestor de cartelera con compras en landing incluida",
            url: 'https://cine-click-zeta.vercel.app/'
        },
        {
            id: 4,
            name: "Share your spot",
            image: "/clients/4.png",
            description: "Localizador en tiempo real y reproductor de ubicacion",
            url: '#'
        }
    ];
    const Lenis = ReactLenis as unknown as React.FC<{ root?: boolean; children: React.ReactNode }>;

    return (
        <Lenis>
            <Navbar />
            <div className="bodyContainer animate__animated animate__fadeIn" ref={container} id="contenedorSecundario" >
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

                {/* Add a specific class for mobile styling */}
                <section className={`cards relative z-50 ${isMobile ? 'mobile-cards' : ''}`} id='servicios'

                >
                    {cards.map((c, index) => (
                        <Card {...c} index={index} key={index} />
                    ))}
                </section>


                <section className={`outro text-[#6A0DAD] px-4 transition-all w-full pointer-events-none`} id='clientes'

                    style={{ opacity: outroVisible ? 1 : 0, pointerEvents: 'fill' }}>
                    <div id="outroContainer" className="relative"
                    >
                        <div
                            className="z-10 sticky top-10 text-white transition-opacity duration-5000 mb-6 md:mb-12"
                            style={{ opacity: outroVisible ? 1 : 0 }}
                        >
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Nuestros clientes</h1>
                        </div>
                        <div
                            className={`client-cards-container sticky top-40 z-20 transition-opacity duration-5000 w-full mx-auto `}
                            style={{ opacity: outroVisible ? 1 : 0 }}
                            id="clientsContainer"

                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8" >
                                {clients.map((client) => (



                                    <ClientCard
                                        key={client.id}
                                        client={client}
                                        url={client.url}
                                        containerId="clientsContainer"
                                        className="animate__animated animate__fadeIn animate__slower"
                                    />


                                ))}
                            </div>
                        </div>
                        <img
                            src="/asteroidesFrames/ezgif-frame-001.jpg"
                            alt=""
                            className={`top-0 w-full h-full object-cover ${!outroVisible ? 'hidden' : 'fixed'}`}
                            id='imagenOutro'
                        />
                    </div>
                </section>
            </div>
        </Lenis>
    );
}