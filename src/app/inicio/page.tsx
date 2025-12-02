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
import { ContactSection } from "../components/contactSection";
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
  const [showContact] = useState(true); // Siempre montado para GSAP

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

      // Configuración global para mejorar el rendimiento
      ScrollTrigger.config({
        limitCallbacks: true, // Limita callbacks para mejor rendimiento
      });

      // Configurar refresh más suave
      ScrollTrigger.addEventListener("refresh", () => {
        ScrollTrigger.getAll().forEach((st) => st.update());
      });

      // Refresh ScrollTrigger para evitar conflictos
      ScrollTrigger.refresh();

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
          anticipatePin: 1, // Ayuda a prevenir saltos
        });

        cards.forEach((card, index) => {
          const cardInner = card.querySelector(".card-inner");

          // Pin cada tarjeta cuando llega a la posición (todas iguales, incluyendo la última)
          ScrollTrigger.create({
            trigger: card,
            start: "top 35%",
            endTrigger: ".outro",
            end: "top 65%", // Todas las cartas terminan igual
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            fastScrollEnd: true, // Mejora para scroll rápido
          });

          // Animación de apilamiento para móvil (todas iguales)
          gsap.to(cardInner, {
            y: `-${(cards.length - index) * 10}vh`,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 35%",
              endTrigger: ".outro",
              end: "top 65%", // Todas terminan en el mismo punto
              scrub: 0.5, // Añadir un pequeño lag para suavizar
              invalidateOnRefresh: true,
            },
          });

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
                invalidateOnRefresh: true, // Recalcula en resize
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
                  invalidateOnRefresh: true, // Recalcula en resize
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
        const cardInner = card.querySelector(".card-inner");

        // Todas las cartas, incluyendo la última, se tratan igual
        ScrollTrigger.create({
          trigger: card,
          start: "top 35%",
          endTrigger: ".outro",
          end: "top 65%",
          pin: true,
          pinSpacing: false,
        });

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
  const [lastFrame, setLastFrame] = useState(1);

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
    preloadImages();
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const contenedor = document.getElementById(
            "contenedorSecundario"
          ) as HTMLDivElement;
          const video = document.getElementById("video") as HTMLVideoElement;
          const imagen = document.getElementById(
            "imagenOutro"
          ) as HTMLImageElement;
          const continuara = document.getElementById(
            "titulo"
          ) as HTMLTitleElement;

          if (!contenedor || !video || !imagen || !continuara) {
            ticking = false;
            return;
          }

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

          // Las imágenes empiezan justo después de las cards
          const puntoInicioFrames = isMobile
            ? posicionActualDeScroll + cardsSectionBottom
            : posicionActualDeScroll + cardsSectionBottom;

          const puntoInicioOpacidad = puntoInicioFrames - window.innerHeight;

          if (posicionActualDeScroll > puntoInicioFrames) {
            setOutroVisible(true); // Activar outro cuando empiezan los frames

            const distanciaRecorrida =
              posicionActualDeScroll - puntoInicioFrames;
            const totalDistancia = window.innerHeight * 3; // 3 pantallas para completar la animación

            const progreso = distanciaRecorrida / totalDistancia;

            const smoothProgress = Math.min(1, Math.max(0, progreso));
            const frame = Math.min(
              140,
              Math.max(1, Math.floor(smoothProgress * 139) + 1)
            );

            // Actualizar el frame (ahora permite retroceso)
            setLastFrame(frame);

            const idStr = frame.toString().padStart(3, "0");

            imagen.src =
              imageCache[idStr]?.src ||
              `/asteroidesFramesWebP/ezgif-frame-${idStr}.webp`;

            // "Continuara..." aparece gradualmente desde el frame 1 al 30
            if (frame <= 30) {
              const fadeInProgress = frame / 20; // 0 a 1
              continuara.style.opacity = fadeInProgress.toString();
            }
            // "Continuara..." se mantiene visible del frame 30 al 50
            else if (frame > 20 && frame <= 35) {
              continuara.style.opacity = "1";
            }
            // "Continuara..." se desvanece del frame 50 al 80
            // mientras ContactSection ya está apareciendo desde abajo (controlado por GSAP)
            else if (frame > 35 && frame <= 50) {
              const fadeOutProgress = (frame * 2 - 50) / 30; // 0 a 1
              continuara.style.opacity = (1 - fadeOutProgress).toString();
            }
            // Después del frame 80, completamente invisible
            else if (frame > 80) {
              continuara.style.opacity = "0";
            }
          } else {
            // Mantener el último frame
            const idStr = lastFrame.toString().padStart(3, "0");
            imagen.src =
              imageCache[idStr]?.src ||
              `/asteroidesFramesWebP/ezgif-frame-${idStr}.webp`;
          }

          // Controlar visibilidad del outro
          if (posicionActualDeScroll > puntoInicioOpacidad) {
            setOutroVisible(true);
            imagen.style.opacity = "1";
          } else {
            setOutroVisible(false);
            imagen.style.opacity = "0";
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, lastFrame]);

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
          className={`outro text-[#6A0DAD] h-full min-h-max px-4 transition-all w-full pointer-events-none`}
          id="clientes"
          style={{
            opacity: outroVisible ? 1 : 0,
            pointerEvents: outroVisible ? "auto" : "none",
          }}
        >
          <div id="outroContainer" className="relative h-full min-h-max">
            <div
              className="z-10 sticky top-10 text-white transition-opacity duration-5000 mb-6 md:mb-12"
              style={{ opacity: outroVisible ? 1 : 0 }}
            ></div>
            <div
              className={`client-cards-container sticky top-40 w-full mx-auto`}
              id="clientsContainer"
              style={{ zIndex: 50 }}
            >
              <h1
                className="text-4xl sm:text-6xl text-white text-center"
                id="titulo"
                style={{ opacity: 0, transition: "opacity 0.3s ease" }}
              >
                Continuara...
              </h1>
            </div>
            <img
              src="/asteroidesFrames/ezgif-frame-001.webp"
              alt=""
              className={`top-0 w-full min-w-full h-full object-cover ${
                !outroVisible ? "hidden" : "fixed"
              }`}
              id="imagenOutro"
              style={{ transition: "opacity 0.3s ease", zIndex: 25 }}
            />
          </div>
          <div className="absolute  w-full">
            <ContactSection isVisible={showContact} />
          </div>
        </section>

        {/* ContactSection sin wrapper - se maneja con su propio CSS */}

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
