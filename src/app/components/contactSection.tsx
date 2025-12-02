"use client";
import { useState, useRef, useEffect } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import "./contactSection.css";

gsap.registerPlugin(ScrollTrigger);

interface ContactSectionProps {
  isVisible?: boolean;
}

export const ContactSection = ({ isVisible = true }: ContactSectionProps) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const contactRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contactRef.current || !contentRef.current) return;

    // Timeline para secuencia de animaciones con pinning
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: contactRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      },
    });

    //Fase 1: Aparece desde abajo
    tl.fromTo(
      contentRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        ease: "none",
      }
    );

    // Fase 2: Se queda pineado en el centro (sin movimiento)
    tl.to(contentRef.current, {
      opacity: 1,

      duration: 1.5, // Controla cuánto "scroll" permanece fijo (aumenta para más scroll)
      ease: "none",
    });

    // Fase 3: Sale hacia arriba y desaparece
    tl.to(contentRef.current, {
      opacity: 0,
      ease: "none",
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === contactRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    setFormData({ nombre: "", email: "", mensaje: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      className="contact-section relative"
      id="contacto"
      ref={contactRef}
      style={{
        pointerEvents: isVisible ? "auto" : "none",
        width: "100%",
        minWidth: "100%",
      }}
    >
      <div
        className="contact-container sticky top-[-100px] z-30"
        ref={contentRef}
      >
        <div className="contact-header">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-1">
            Contactános
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-purple-200 mb-12">
            Despega tu proyecto digital con nosotros
          </p>
        </div>

        <div className="contact-content">
          {/* Información de contacto */}
          <div className="contact-info">
            <div className="info-card">
              <div className="icon-wrapper">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                <a
                  href="mailto:contacto@tuempresa.com"
                  className="text-purple-300 hover:text-purple-100 transition-colors"
                >
                  galacticcodeweb@gmail.com
                </a>
              </div>
            </div>

            <div className="info-card">
              <div className="icon-wrapper">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Teléfono
                </h3>
                <a
                  href="tel:+5491234567890"
                  className="text-purple-300 hover:text-purple-100 transition-colors"
                >
                  +54 9 3455 472377
                </a>
              </div>
            </div>

            <div className="info-card">
              <div className="icon-wrapper">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Ubicación
                </h3>
                <p className="text-purple-300">Villaguay, Entre Ríos, AR</p>
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="nombre" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensaje" className="form-label">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="form-input form-textarea"
                  placeholder="Cuéntanos sobre tu proyecto..."
                />
              </div>

              <button type="submit" className="submit-button">
                <span>Enviar Mensaje</span>
                <Send className="w-5 h-5 ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
