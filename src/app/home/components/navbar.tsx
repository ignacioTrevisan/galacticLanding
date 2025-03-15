"use client";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const Navbar = () => {
    const router = useTransitionRouter();
    const [navVisible, setNavVisible] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                pseudoElement: "::view-transition-new(root)",
            }
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setNavVisible(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        if (isMobileMenuOpen) {
            const timer = setTimeout(() => {
                setIsMobileMenuOpen(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isMobileMenuOpen])


    const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
            setIsMobileMenuOpen(false); // Cerrar menú móvil al hacer clic
        } else {
            router.push(sectionId === "hero" ? "/" : sectionId, { onTransitionReady: slideinOut });
        }
    };

    return (
        <nav className="absolute top-0 left-0 w-full z-50 px-5 py-4 text-white backdrop-blur-md">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex flex-col animacionPorDefecto">
                    <p className="cursor-pointer text-lg font-bold">{`Galactic`}</p>
                    <p className="cursor-pointer text-sm">{`<Code>`}</p>
                </div>

                {/* Botón hamburguesa para móvil */}
                <button
                    className="md:hidden z-50"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                        <span className="block w-6 h-0.5 bg-white mb-1 transition-all"></span>
                        <span className="block w-6 h-0.5 bg-white mb-1 transition-all"></span>
                        <span className="block w-6 h-0.5 bg-white transition-all"></span>
                    </div>
                </button>

                {/* Menú de navegación */}
                <div
                    className={`${navVisible ? "animate__animated animate__fadeIn animate__slow" : "hidden"
                        } md:flex md:items-center md:gap-6 ${isMobileMenuOpen
                            ? "flex flex-col absolute top-full left-0 w-full p-5"
                            : "hidden"
                        } md:relative md:bg-transparent md:p-0`}
                >
                    <button
                        className="py-2 md:py-0 hover:text-gray-300 transition-colors"
                        onClick={() => {
                            window.location.replace('/');
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        Inicio
                    </button>
                    <Link
                        href="#servicios"
                        className="py-2 md:py-0 hover:text-gray-300 transition-colors"
                        onClick={(e) => handleScrollToSection(e, "servicios")}
                    >
                        Nuestros servicios
                    </Link>
                    <Link
                        href="#clientes"
                        className="py-2 md:py-0 hover:text-gray-300 transition-colors"
                        onClick={(e) => handleScrollToSection(e, "clientes")}
                    >
                        Nuestros clientes
                    </Link>
                </div>
            </div>
        </nav>
    );
};