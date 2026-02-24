import React, { useState, useEffect, useRef } from "react";
import "../css/whatsapp.css"; // Asegúrate de crear este archivo con los estilos necesarios

const Mensaje = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const chatRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowBadge(false); // al abrir se quita el badge
  };

  const closeChat = () => setIsOpen(false);

  // Cerrar si se hace click afuera
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (chatRef.current && !chatRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleEsc);

    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const phoneNumber = "584241234567";
  const message = encodeURIComponent(
    "¡Hola! 👋🏍️ Estoy interesado en sus servicios de RR BIKER. ¿Me pueden dar información?"
  );

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className={`rr-biker-whatsapp ${isOpen ? "is-open" : ""}`} ref={chatRef}>
      
      {/* Ventana de Chat */}
      <div className="whatsapp-window">
        <div className="whatsapp-header">
          <div className="header-info">
            <span className="online-dot"></span>
            <div className="header-text">
              <strong>RR BIKER</strong>
              <span>En línea ahora</span>
            </div>
          </div>

          <button className="close-btn" onClick={closeChat}>
            ✕
          </button>
        </div>

        <div className="whatsapp-body">
          <div className="message-bubble">
            ¡Hola! 🏍️ Bienvenido a <strong>RR BIKER</strong>. <br />
            ¿Cómo podemos ayudarte con tu moto hoy?
          </div>

          <div className="message-bubble second-msg">
            Escríbenos y con gusto te atendemos 🚀
          </div>
        </div>

        <div className="whatsapp-footer">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="send-btn"
          >
            <img
              src="https://img.icons8.com/?size=100&id=QkXeKixybttw&format=png"
              alt="ws-icon"
              width="22"
            />
            Iniciar Chat
          </a>
        </div>
      </div>

      {/* Botón Flotante */}
      <button className="whatsapp-float-btn" onClick={toggleChat}>
        <img
          src="https://img.icons8.com/?size=100&id=QkXeKixybttw&format=png"
          alt="WhatsApp Logo"
          className="float-icon-img"
        />

        {showBadge && !isOpen && <span className="notif-badge">1</span>}
      </button>
    </div>
  );
};

export default Mensaje;
