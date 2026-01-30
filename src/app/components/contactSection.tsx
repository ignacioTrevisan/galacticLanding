"use client";
import { useState, useRef, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const contactRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contactRef.current || !contentRef.current) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      gsap.set(contentRef.current, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: contactRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      },
    });

    tl.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, ease: "none" });
    tl.to(contentRef.current, { opacity: 1, duration: 1.5, ease: "none" });
    tl.to(contentRef.current, { opacity: 0, ease: "none" });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === contactRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "¡Mensaje enviado exitosamente! Te contactaremos pronto.",
        });
        setFormData({ nombre: "", email: "", mensaje: "" });
      } else {
        throw new Error(data.error || "Error al enviar el mensaje");
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          "Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.",
      });
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
        className="contact-container md:sticky top-0 md:top-[-100px] z-30"
        ref={contentRef}
      >
        <div className="contact-header">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-1">
            Contactános
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-purple-200 mb-12">
            Despegá tu proyecto digital con nosotros
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="icon-wrapper">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                <a
                  href="mailto:galacticcodeweb@gmail.com"
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
                  href="tel:+5493455472377"
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

          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form">
              {submitStatus.type && (
                <div
                  className={`alert ${submitStatus.type === "success" ? "alert-success" : "alert-error"}`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span>{submitStatus.message}</span>
                </div>
              )}

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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  rows={5}
                  className="form-input form-textarea"
                  placeholder="Cuéntanos sobre tu proyecto..."
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? "Enviando..." : "Enviar Mensaje"}</span>
                <Send className="w-5 h-5 ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
