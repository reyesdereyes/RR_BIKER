import React, { useState, useEffect, useRef } from "react";
import "../css/Whatsapp.css";

const Mensaje = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowBadge(false);
    
    // Simular "escribiendo..." al abrir
    if (!isOpen) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1500);
    }
  };

  const closeChat = () => setIsOpen(false);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, isTyping]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (chatRef.current && !chatRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Mostrar badge después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowBadge(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const phoneNumber = "584241234567";
  const message = encodeURIComponent(
    "¡Hola RR BIKER! 👋🏍️ Estoy interesado en sus servicios. ¿Me pueden dar información?"
  );
  
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`;

  const quickReplies = [
    "Ver catálogo de productos",
    "Agendar cita de servicio",
    "Consultar disponibilidad",
    "Hablar con un asesor"
  ];

  return (
    <>
      {/* Overlay oscuro cuando está abierto */}
      {isOpen && <div className="rr-whatsapp-overlay" onClick={closeChat} />}
      
      <div 
        className={`rr-whatsapp ${isOpen ? "is-open" : ""}`} 
        ref={chatRef}
      >
        {/* Ventana de Chat */}
        <div className="rr-whatsapp-window">
          {/* Header con gradiente */}
          <div className="rr-whatsapp-header">
            <div className="rr-header-pattern"></div>
            <div className="rr-header-content">
              <div className="rr-avatar">
                <span className="rr-avatar-icon">🏍️</span>
                <div className="rr-avatar-status"></div>
              </div>
              
              <div className="rr-header-info">
                <h4 className="rr-header-title">RR BIKER</h4>
                <div className="rr-header-status">
                  {isTyping ? (
                    <span className="rr-typing">
                      <span></span>
                      <span></span>
                      <span></span>
                      escribiendo...
                    </span>
                  ) : (
                    <>
                      <span className="rr-status-dot"></span>
                      En línea ahora
                    </>
                  )}
                </div>
              </div>

              <button className="rr-close-btn" onClick={closeChat} aria-label="Cerrar chat">
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path d="M13 1L1 13M1 1l12 12" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Cuerpo con burbujas animadas */}
          <div className="rr-whatsapp-body">
            <div className="rr-chat-date">Hoy</div>
            
            <div className="rr-message rr-message-incoming">
              <div className="rr-message-bubble">
                <p>¡Hola! 🏍️ Bienvenido a <strong>RR BIKER</strong></p>
                <span className="rr-message-time">Ahora</span>
              </div>
            </div>

            <div className="rr-message rr-message-incoming">
              <div className="rr-message-bubble">
                <p>¿En qué podemos ayudarte con tu moto hoy? Tenemos:</p>
                <ul className="rr-services-list">
                  <li>🔧 Servicio técnico especializado</li>
                  <li>🛒 Repuestos originales</li>
                  <li>🏁 Equipamiento de competición</li>
                </ul>
                <span className="rr-message-time">Ahora</span>
              </div>
            </div>

            {/* Respuestas rápidas */}
            <div className="rr-quick-replies">
              {quickReplies.map((reply, idx) => (
                <a 
                  key={idx}
                  href={`${whatsappLink}%0A%0A*Consulta:*%20${encodeURIComponent(reply)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rr-quick-btn"
                >
                  {reply}
                </a>
              ))}
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Footer con CTA potente */}
          <div className="rr-whatsapp-footer">
            <div className="rr-footer-secure">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>Chatea seguro por WhatsApp</span>
            </div>
            
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rr-send-btn"
            >
              <span className="rr-btn-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </span>
              <span className="rr-btn-text">Iniciar conversación</span>
              <span className="rr-btn-arrow">→</span>
            </a>
          </div>
        </div>

        {/* Botón Flotante con animación de pulso */}
        <button 
          className="rr-whatsapp-float" 
          onClick={toggleChat}
          aria-label={isOpen ? "Cerrar chat" : "Abrir chat de WhatsApp"}
        >
          <div className="rr-float-bg"></div>
          <div className="rr-float-ring"></div>
          
          <div className="rr-float-icon">
            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            )}
          </div>

          {/* Badge de notificación con animación */}
          {showBadge && !isOpen && (
            <span className="rr-notif-badge">
              <span className="rr-badge-pulse"></span>
              <span className="rr-badge-num">1</span>
            </span>
          )}
        </button>
      </div>
    </>
  );
};

export default Mensaje;