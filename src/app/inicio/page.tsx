"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "../home/components/navbar";
import "./inicio.css";
import "../components/outro.css";
import "animate.css";
import { ReactLenis } from "@studio-freight/react-lenis";
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
  const [isMessageShowed, setisMessageShowed] = useState(false);

  // Manejo del mensaje de scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollMessage(false);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        if (isMessageShowed === true) return;
        setisMessageShowed(true);
        setShowScrollMessage(true);
      }, 15000); // 15 segundos
    };

    window.addEventListener("scroll", handleScroll);

    // Iniciar el timeout cuando se carga la página
    scrollTimeout.current = setTimeout(() => {
      if (isMessageShowed === true) return;
      setisMessageShowed(true);
      setShowScrollMessage(true);
    }, 5000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
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
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useGSAP(
    () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());

      const cards = gsap.utils.toArray<HTMLDivElement>(".card");

      if (isMobile) {
        // Implementación móvil que replica el comportamiento desktop
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

          // Pin cada tarjeta cuando llega a la posición (incluyendo la última)
          ScrollTrigger.create({
            trigger: card,
            start: "top 35%",
            endTrigger: ".outro",
            end: "top 65%",
            pin: true,
            pinSpacing: false,
          });

          // Animación de apilamiento para móvil con lógica especial para la última carta
          if (!isLastCard) {
            gsap.to(cardInner, {
              y: `-${(cards.length - index) * 10}vh`,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 35%",
                endTrigger: ".outro",
                end: "top 65%",
                scrub: true,
              },
            });
          } else {
            // Para la última tarjeta, aplicamos una animación más suave que la mantiene en su lugar
            gsap.to(cardInner, {
              y: 0, // No se mueve verticalmente
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 35%",
                endTrigger: ".outro",
                end: "top 65%",
                scrub: true,
              },
            });
          }

          // Efecto parallax suave para la imagen
          const cardImg = card.querySelector(".card-img, .card-img-grande");
          if (cardImg) {
            gsap.to(cardImg, {
              y: -20, // Reducido para móvil
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            });
          }

          // Efecto de fade para el contenido
          const cardContent = card.querySelector(".card-content");
          if (cardContent) {
            gsap.fromTo(
              cardContent,
              { opacity: 0.8, y: 10 },
              {
                opacity: 1,
                y: 0,
                scrollTrigger: {
                  trigger: card,
                  start: "top 60%",
                  end: "top 40%",
                  scrub: 1,
                },
              }
            );
          }
        });

        return;
      }

      // Efecto desktop original (sin cambios)
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
    },
    { scope: container, dependencies: [isMobile] }
  );

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

  const imageCache: { [key: string]: HTMLImageElement } = {};

  function preloadImages() {
    for (let i = 1; i <= 140; i++) {
      const idStr = i.toString().padStart(3, "0");
      const img = new Image();
      img.src = `/asteroidesFramesWebP/ezgif-frame-${idStr}.webp`;
      imageCache[idStr] = img;
    }
  }

  useEffect(() => {
    // Llamar a la función de precarga al inicio
    preloadImages();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const contenedor = document.getElementById(
        "contenedorSecundario"
      ) as HTMLDivElement;
      const video = document.getElementById("video") as HTMLVideoElement;
      const imagen = document.getElementById("imagenOutro") as HTMLImageElement;
      const continuara = document.getElementById("titulo") as HTMLTitleElement;

      if (!contenedor || !video || !imagen) return;

      // Calculamos la opacidad del video basado en el scroll
      const mitadDeScroll = contenedor.scrollHeight / 7;
      const posicionActualDeScroll = window.scrollY;
      const fraccionDeScroll = posicionActualDeScroll / mitadDeScroll;
      const valor = fraccionDeScroll > 1 ? 1 : fraccionDeScroll;
      const opacidad = (1 - valor) * 100;

      video.style.opacity = `${Math.floor(opacidad)}%`;

      const cardsSection = document.querySelector(".cards") as HTMLElement;
      const cardsSectionBottom = cardsSection
        ? cardsSection.getBoundingClientRect().bottom
        : 0;

      // Ajustes mejorados para móvil y desktop
      const factorMultiplicador = isMobile ? 1.2 : 5;
      const factorOpacidad = isMobile ? 0.8 : 4;

      // Puntos de activación mejorados para móvil
      const puntoInicioFrames = isMobile
        ? posicionActualDeScroll + cardsSectionBottom - window.innerHeight / 2
        : contenedor.scrollHeight - window.innerHeight * factorMultiplicador;

      const puntoInicioOpacidad = isMobile
        ? posicionActualDeScroll + cardsSectionBottom - window.innerHeight * 0.8
        : contenedor.scrollHeight - window.innerHeight * factorOpacidad;

      if (posicionActualDeScroll > puntoInicioFrames) {
        const distanciaRecorrida = posicionActualDeScroll - puntoInicioFrames;
        // Ajuste mejorado del total de distancia para móvil
        const totalDistancia = isMobile
          ? window.innerHeight * 1.5
          : window.innerHeight * factorMultiplicador;
        const progreso = distanciaRecorrida / totalDistancia;
        const frame = Math.min(
          140,
          Math.max(1, Math.floor(progreso * 139) + 1)
        );

        const idStr = frame.toString().padStart(3, "0");
        imagen.src =
          imageCache[idStr]?.src ||
          `/asteroidesFramesWebP/ezgif-frame-${idStr}.webp`;

        // Ajuste mejorado de los frames para el desvanecimiento
        const fadeStartFrame = isMobile ? 70 : 70;
        const fadeEndFrame = isMobile ? 120 : 120;

        if (frame >= fadeStartFrame) {
          const fadeProgress =
            (frame - fadeStartFrame) / (fadeEndFrame - fadeStartFrame);
          const clampedProgress = Math.min(1, Math.max(0, fadeProgress));
          const imageOpacity = 1 - clampedProgress;

          imagen.style.opacity = imageOpacity.toString();
          continuara.style.opacity = "1";
        } else {
          imagen.style.opacity = "1";
          continuara.style.opacity = "1";
        }
      }

      if (posicionActualDeScroll <= puntoInicioOpacidad) {
        imagen.style.opacity = "0";
        setOutroVisible(false);
      } else {
        setOutroVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const Lenis = ReactLenis as unknown as React.FC<{
    root?: boolean;
    children: React.ReactNode;
  }>;

  return (
    <Lenis root>
      <Navbar />

      <div
        className="bodyContainer animate__animated animate__fadeIn"
        ref={container}
        id="contenedorSecundario"
      >
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

        <section className={`cards relative z-50`} id="servicios">
          {cards.map((c, index) => (
            <Card {...c} index={index} key={index} />
          ))}
        </section>

        <section
          className={`outro text-[#6A0DAD] px-4 transition-all w-full pointer-events-none`}
          id="clientes"
          style={{
            opacity: outroVisible ? 1 : 0,
            pointerEvents: outroVisible ? "auto" : "none",
          }}
        >
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
              <h1
                className="text-4xl sm:text-6xl text-white text-center transition-all duration-4000"
                id="titulo"
              >
                Continuara...
              </h1>
            </div>
            <img
              src="/asteroidesFrames/ezgif-frame-001.webp"
              alt=""
              className={`top-0 w-full h-full object-cover ${
                !outroVisible ? "hidden" : "fixed"
              }`}
              id="imagenOutro"
              style={{ transition: "opacity 0.3s ease" }}
            />
          </div>
        </section>

        {/* Mensaje de scroll */}
        {showScrollMessage && (
          <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 animate__animated animate__fadeIn">
            <div className="bg-white/90 text-black px-4 py-2 rounded-full shadow-lg">
              <p className="text-sm md:text-base">Scrollea hacia abajo</p>
            </div>
          </div>
        )}
      </div>
    </Lenis>
  );
}
