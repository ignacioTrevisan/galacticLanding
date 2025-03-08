"use client";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const Navbar = () => {
    const router = useTransitionRouter();
    const [navVisible, setNavVisible] = useState(false);

    // Función para la transición personalizada
    const slideinOut = () => {
        document.documentElement.animate(
            [
                {
                    opacity: 1,
                    transform: "translateY(0)",
                },
                {
                    opacity: 0.1,
                    transform: "translateY(-100%)",
                },
            ],
            {
                duration: 1500,
                easing: "cubic-bezier(0.87,0,0.13,1)",
                fill: "forwards",
                pseudoElement: "::view-transition-old(root)",
            }
        );

        document.documentElement.animate(
            [
                {
                    clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
                },
                {
                    clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
                },
            ],
            {
                duration: 1500,
                easing: "cubic-bezier(0.87,0,0.13,1)",
                fill: "forwards",
                pseudoElement: "::view-transition-new(root)", // Cambié a "new" para el nuevo contenido
            }
        );
    };

    // Mostrar el navbar después de 4 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            setNavVisible(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Función para manejar el scroll suave o la navegación
    const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        const section = document.getElementById(sectionId);
        if (section) {
            // Si la sección existe, desplazarse suavemente
            section.scrollIntoView({ behavior: "smooth" });
        } else {
            // Si no, navegar a la ruta con la transición
            router.push(sectionId === "hero" ? "/" : sectionId, { onTransitionReady: slideinOut });
        }
    };

    return (
        <div
            className={`flex flex-col justify-start px-5 text-sm absolute top-10 w-full z-50 text-white`}
            id="probando"
        >
            <div className="self-start flex-col absolute animacionPorDefecto">
                <p className="cursor-pointer">{`Galactic`}</p>
                <p className="cursor-pointer">{`<Code>`}</p>
            </div>
            <div
                className={`self-end flex gap-3 ${navVisible ? "animate__animated animate__fadeIn animate__slow" : "hidden"
                    }`}
            >
                <button

                    className="cursor-pointer"
                    onClick={() => window.location.replace('/')}
                >
                    Inicio
                </button>


                <Link
                    href="#servicios"
                    className="cursor-pointer"
                    onClick={(e) => handleScrollToSection(e, "servicios")}
                >
                    Nuestros servicios
                </Link>
                <Link
                    href="#clientes"
                    className="cursor-pointer"
                    onClick={(e) => handleScrollToSection(e, "clientes")}
                >
                    Nuestros clientes
                </Link>
            </div>
        </div>
    );
};