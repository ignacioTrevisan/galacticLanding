"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { redirect } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

interface Client {
    id: number;
    name: string;
    description: string;
    image: string;
}

interface ClientCardProps {
    client: Client;
    containerId: string;
    className: string;
    url: string
}

const ClientCard: React.FC<ClientCardProps> = ({ client, containerId, className, url }) => {
    const cardRef = useRef(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar si estamos en móvil
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

    useEffect(() => {
        // Configuración inicial - tarjetas rotadas de espalda
        gsap.set(cardRef.current, {
            rotationY: 180,
            transformStyle: "preserve-3d",
            perspective: 1000,
            opacity: 0,
            scale: 0.6,
            y: isMobile ? 40 : 0, // Offset inicial para móvil para deslizamiento hacia arriba
        });

        // Obtener el contenedor
        const container = document.getElementById(containerId);
        if (!container) return;

        // Configurar diferentes puntos de activación para móvil
        const startPosition = isMobile ? "top 90%" : "top -140%";
        const endPosition = isMobile ? "top 40%" : "top -20%";

        // Crear timeline para la animación
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: startPosition,
                end: endPosition,
                toggleActions: "play none none none", // Modificado para no revertir automáticamente
                scrub: isMobile ? 0.5 : false, // Mantener un scrub suave para móvil
                onEnter: () => console.log("Entrando a la sección de clientes"),
                onLeaveBack: () => console.log("Saliendo de la sección de clientes"),
            },
            delay: isMobile ? client.id * 0.3 : client.id * 0.2, // Retraso escalonado mayor en móvil
        });

        // Verificar si ya debe estar visible (ayuda en móvil)
        const shouldBeVisible = () => {
            const containerRect = container.getBoundingClientRect();
            return containerRect.top < window.innerHeight * 0.8;
        };

        // En móvil, si ya debería ser visible, mostrar con animación suave
        if (isMobile && shouldBeVisible()) {
            // Efecto de fade-in más suave para móvil
            gsap.to(cardRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                rotationY: 0,
                duration: 1.2, // Duración más larga para una aparición más suave
                ease: "power2.out", // Ease suave para aparición gradual
                stagger: 0.15, // Efecto escalonado si hay múltiples elementos
                onComplete: () => setIsFlipped(true)
            });
        } else {
            // Animación de entrada diferenciada para móvil y desktop
            if (isMobile) {
                // Versión móvil: fade in + slide up más suave
                tl.to(cardRef.current, {
                    opacity: 1,
                    y: 0,
                    scale: 0.9, // Escala ligeramente menor inicialmente
                    duration: 0.7,
                    ease: "power2.out",
                }).to(
                    cardRef.current,
                    {
                        scale: 1,
                        rotationY: 0,
                        duration: 0.8,
                        ease: "back.out(2)", // Efecto de rebote más sutil
                        onComplete: () => setIsFlipped(true),
                    },
                    "-=0.3"
                );
            } else {
                // Versión desktop: mantener la animación original
                tl.to(cardRef.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: "power9.out",
                }).to(
                    cardRef.current,
                    {
                        rotationY: 0,
                        duration: 1.2,
                        ease: "back.out(4.5)",
                        onComplete: () => setIsFlipped(true),
                    },
                    "-=0.2"
                );
            }
        }

        // Guardar la referencia al timeline para limpiarlo después
        timelineRef.current = tl;

        // Añadir efecto de flotar continuo (más sutil en móvil)
        const floatAmount = isMobile ? 3 : 8; // Reducido aún más para móvil
        const floatDuration = isMobile ? "random(4, 6)" : "random(3, 5)"; // Más lento en móvil

        const floatingAnimation = gsap.to(cardRef.current, {
            y: `random(-${floatAmount}, ${floatAmount})`,
            x: `random(-${floatAmount / 2}, ${floatAmount / 2})`,
            rotation: isMobile ? "random(-1, 1)" : "random(-2, 2)", // Rotación más sutil en móvil
            duration: floatDuration,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.8, // Esperar a que termine la animación inicial
        });

        // Nuevo observador específico para el efecto de salida en móvil
        if (isMobile) {
            // Crear un nuevo ScrollTrigger específico para la salida
            ScrollTrigger.create({
                trigger: container,
                start: "top 10%", // Comenzar cuando la parte superior del contenedor está al 10% de la ventana
                end: "bottom 0%", // Terminar cuando la parte inferior del contenedor está en la parte inferior de la ventana
                onLeave: () => {
                    // Animación de salida suave cuando el usuario hace scroll hacia abajo
                    if (cardRef.current) {
                        gsap.to(cardRef.current, {
                            opacity: 0,
                            y: -20, // Desplazamiento hacia arriba
                            duration: 0.2, // Duración larga para salida suave
                            ease: "power2.out",
                            clearProps: false, // No limpiar propiedades
                        });
                    }
                },
                onLeaveBack: () => {
                    // Animación de salida suave cuando el usuario hace scroll hacia arriba
                    if (cardRef.current) {
                        gsap.to(cardRef.current, {
                            opacity: 0,
                            y: 20, // Desplazamiento hacia abajo
                            duration: 0.2, // Duración larga para salida suave
                            ease: "power2.out",
                            clearProps: false, // No limpiar propiedades
                        });
                    }
                },
                onEnter: () => {
                    // Volver a mostrar cuando entra de nuevo
                    if (cardRef.current) {
                        gsap.to(cardRef.current, {
                            opacity: 1,
                            y: 0,
                            duration: 1.2,
                            ease: "power2.out",
                        });
                    }
                },
                onEnterBack: () => {
                    // Volver a mostrar cuando entra de nuevo
                    if (cardRef.current) {
                        gsap.to(cardRef.current, {
                            opacity: 1,
                            y: 0,
                            duration: 1.2,
                            ease: "power2.out",
                        });
                    }
                }
            });
        }

        // Añadir listener para pausar/reanudar animación flotante cuando no está visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                floatingAnimation.play();
            } else {
                floatingAnimation.pause();
            }
        }, { threshold: 0.1 });

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            // Limpiar animaciones
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
            if (floatingAnimation) {
                floatingAnimation.kill();
            }
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, [client.id, containerId, isMobile]);

    // Efecto hover (desactivado en móvil)
    const handleMouseEnter = () => {
        if (isMobile) return;
        setIsHovered(true);
        gsap.to(cardRef.current, {
            scale: 1.05,
            duration: 0.5,
            ease: "power2.out",
        });
    };

    const handleMouseLeave = () => {
        if (isMobile) return;
        setIsHovered(false);
        gsap.to(cardRef.current, {
            scale: 1,
            boxShadow: "0 0 10px rgba(106, 13, 173, 0.3)",
            duration: 0.5,
            ease: "power2.in",
        });
    };

    return (
        <div
            ref={cardRef}
            className={`client-card bg-black border border-[#6A0DAD] rounded-lg overflow-hidden w-full aspect-square relative cursor-pointer shadow-lg ${className}`}
            style={{
                boxShadow: "0 0 10px rgba(106, 13, 173, 0.3)",
                transformStyle: "preserve-3d",
            }}
            onClick={() => redirect(url)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Cara frontal */}
            <div
                className="absolute inset-0 w-full h-full flex flex-col justify-between p-4 backface-hidden"
                style={{
                    backfaceVisibility: "hidden",
                    transform: isFlipped ? "rotateY(0deg)" : "rotateY(180deg)",
                    transition: "transform 0.8s ease",
                    pointerEvents: 'fill'
                }}

            >
                <div className="h-4/5 mb-2 overflow-hidden rounded-md">
                    <img
                        src={client.image}
                        alt={client.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="text-center">
                    <h3 >{client.name}</h3>

                    <p className="text-white text-sm">{client.description}</p>
                </div>
            </div>

            {/* Cara trasera */}
            <div
                className="absolute inset-0 w-full h-full flex items-center justify-center backface-hidden bg-gradient-to-br from-[#1A1A40] to-black"
                style={{
                    backfaceVisibility: "hidden",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transition: "transform 0.8s ease",
                }}
            >
                <div className="space-star w-4 h-4 bg-white rounded-full opacity-80"></div>
            </div>

            {/* Efecto brillo en hover (solo en desktop) */}
            {isHovered && !isMobile && (
                <div
                    className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#6A0DAD] opacity-30 z-10 pointer-events-none"
                    style={{
                        mixBlendMode: "overlay",
                    }}
                ></div>
            )}

            {/* Partículas espaciales */}
            <div className="particle-container absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(isMobile ? 3 : 5)].map((_, i) => (
                    <div
                        key={i}
                        className="particle absolute bg-white rounded-full hover:scale-50"
                        style={{
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.8 + 0.2,
                            animation: `float ${Math.random() * 3 + 2}s linear infinite`,
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default ClientCard;