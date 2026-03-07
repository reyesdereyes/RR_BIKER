import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Mensaje from "../components/Mensaje";
import { 
  FaHardHat, 
  FaHandPaper, 
  FaTshirt,      // ← Cambiado de FaJacket a FaTshirt
  FaCog, 
  FaCircle,      // ← Cambiado de FaTire a FaCircle (o usa FaDotCircle)
  FaOilCan, 
  FaMotorcycle, 
  FaFire, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaClock, 
  FaWhatsapp, 
  FaEnvelope, 
  FaArrowRight, 
  FaLink,
  FaShieldAlt,   // Alternativa para chaquetas
  FaVest         // Otra alternativa para chaquetas
} from 'react-icons/fa';
import "../css/Inicio.css";

const Inicio = () => {
  const [scrollY, setScrollY] = useState(0);
  const animatedRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1 }
    );

    animatedRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !animatedRefs.current.includes(el)) {
      animatedRefs.current.push(el);
    }
  };

  const categorias = [
    { nombre: "CASCOS", icono: <FaHardHat />, count: "45", img: <FaHardHat /> },
    { nombre: "GUANTES", icono: <FaHandPaper />, count: "32", img: <FaHandPaper /> },
    { nombre: "CHAQUETAS", icono: <FaVest />, count: "28", img: <FaVest /> },  // ← Cambiado a FaVest
    { nombre: "REPUESTOS", icono: <FaCog />, count: "156", img: <FaCog /> },
    { nombre: "NEUMÁTICOS", icono: <FaCircle />, count: "24", img: <FaCircle /> },  // ← Cambiado a FaCircle
    { nombre: "LUBRICANTES", icono: <FaOilCan />, count: "18", img: <FaOilCan /> }
  ];

  const stats = [
    { v: "15+", l: "AÑOS", sub: "Experiencia" },
    { v: "5K+", l: "PRODUCTOS", sub: "En catálogo" },
    { v: "24H", l: "DELIVERY", sub: "Express" },
    { v: "99%", l: "SATISFACCIÓN", sub: "Clientes" }
  ];

  const productosDestacados = [
    { id: 1, nombre: "Casco AGV Pista GP RR", precio: 1200, badge: "NUEVO", img: <FaHardHat /> },
    { id: 2, nombre: "Guantes Alpinestars GP", precio: 280, badge: "TOP", img: <FaHandPaper /> },
    { id: 3, nombre: "Kit Cadena DID ZVM-X", precio: 320, badge: "OFERTA", img: <FaLink /> },
    { id: 4, nombre: "Chaqueta Dainese Racing", precio: 650, badge: null, img: <FaVest /> }  // ← Cambiado a FaVest
  ];

  return (
    <>
      <Header />

      <br />
      <br />

      {/* HERO SECTION - PARALLAX */}
      <section className="ini-hero">
        <div className="ini-hero-bg" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <div className="ini-hero-grid"></div>
          <div className="ini-hero-glow"></div>
        </div>
        
        <div className="container ini-hero-content">
          <div className="ini-hero-badge"><FaMotorcycle /> DESDE 2009</div>
          
          <h1 className="ini-hero-title">
            <span className="ini-title-line">TODO PARA TU</span>
            <span className="ini-title-line red">MOTO NIVEL PRO</span>
          </h1>
          
          <p className="ini-hero-sub">
            Equipamiento premium y repuestos originales para motocicletas 
            de alta cilindrada. Envíos garantizados a todo el país.
          </p>
          
          <div className="ini-hero-cta">
            <Link to="/productos" className="ini-btn-primary">
              <span>EXPLORAR CATÁLOGO</span>
              <span className="ini-btn-arrow"><FaArrowRight /></span>
            </Link>
            <Link to="/productos?ofertas=1" className="ini-btn-secondary">
              <span className="btn-icon"><FaFire /></span>
              <span>OFERTAS</span>
            </Link>
          </div>

          <div className="ini-hero-visual">
            <div className="ini-visual-ring"></div>
            <div className="ini-visual-ring ring-2"></div>
            <div className="ini-visual-center"><FaMotorcycle /></div>
            <div className="ini-visual-orbit ini-orbit-1"><FaCog /></div>
            <div className="ini-visual-orbit ini-orbit-2"><FaFire /></div>
            <div className="ini-visual-orbit ini-orbit-3"><FaMapMarkerAlt /></div>
          </div>
        </div>

        <div className="ini-hero-deco">
          <div className="ini-deco-line"></div>
          <span className="ini-deco-text">RR BIKER • GUACARA • VENEZUELA</span>
          <div className="ini-deco-line"></div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="ini-categorias" ref={addToRefs}>
        <div className="container">
          <div className="ini-section-header">
            <span className="ini-section-tag">NAVEGA</span>
            <h2 className="ini-section-title">CATEGORÍAS DESTACADAS</h2>
            <div className="ini-title-underline"></div>
          </div>

          <div className="ini-cat-grid">
            {categorias.map((cat, idx) => (
              <Link 
                key={cat.nombre} 
                to={`/productos?categoria=${cat.nombre.toLowerCase()}`}
                className="ini-cat-card"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="ini-cat-number">0{idx + 1}</div>
                <div className="ini-cat-icon-wrap">
                  <span className="ini-cat-emoji">{cat.img}</span>
                  <div className="ini-cat-glow"></div>
                </div>
                <div className="ini-cat-info">
                  <h3>{cat.nombre}</h3>
                  <span className="ini-cat-count">{cat.count} PRODUCTOS</span>
                </div>
                <div className="ini-cat-arrow"><FaArrowRight /></div>
                <div className="ini-cat-border"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="ini-stats" ref={addToRefs}>
        <div className="container">
          <div className="ini-stats-bar">
            {stats.map((s, i) => (
              <div key={i} className="ini-stat-box">
                <div className="ini-stat-sep">{i > 0 && "//"}</div>
                <div className="ini-stat-content">
                  <span className="ini-stat-value">{s.v}</span>
                  <div className="ini-stat-text">
                    <span className="ini-stat-label">{s.l}</span>
                    <span className="ini-stat-sub">{s.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="ini-stats-glow"></div>
      </section>

      {/* DESTACADOS */}
      <section className="ini-destacados" ref={addToRefs}>
        <div className="container">
          <div className="ini-destacados-layout">
            
            <aside className="ini-destacados-info">
              <div className="ini-info-box">
                <div className="ini-info-header">
                  <div className="ini-logo-mini"><FaMotorcycle /> RR BIKER</div>
                  <div className="ini-badges-row">
                    <span className="ini-badge-hot"><FaFire /> TOP VENTAS</span>
                    <span className="ini-badge-premium">PREMIUM</span>
                  </div>
                </div>
                
                <h2 className="ini-info-title">
                  EQUIPAMIENTO<br/>
                  <span className="highlight">SELECCIONADO</span>
                </h2>
                
                <p className="ini-info-desc">
                  Curaduría exclusiva de productos que garantizan 
                  rendimiento máximo y seguridad de nivel profesional.
                </p>

                <div className="ini-features">
                  <div className="ini-feat-item">
                    <div className="ini-feat-icon">✓</div>
                    <span>Garantía extendida 1 año</span>
                  </div>
                  <div className="ini-feat-item">
                    <div className="ini-feat-icon">✓</div>
                    <span>Soporte técnico especializado</span>
                  </div>
                  <div className="ini-feat-item">
                    <div className="ini-feat-icon">✓</div>
                    <span>Cambios sin costo 30 días</span>
                  </div>
                </div>

                <Link to="/productos" className="ini-btn-action">
                  VER TODO <FaArrowRight />
                </Link>
              </div>
            </aside>

            <div className="ini-destacados-grid">
              <div className="ini-grid-header">
                <h3>NOVEDADES</h3>
                <div className="ini-header-line"></div>
              </div>

              <div className="ini-productos-grid">
                {productosDestacados.map((prod) => (
                  <div key={prod.id} className="ini-mini-card">
                    {prod.badge && (
                      <div className={`ini-mini-badge ${prod.badge.toLowerCase()}`}>
                        {prod.badge}
                      </div>
                    )}
                    <div className="ini-mini-img">{prod.img}</div>
                    <div className="ini-mini-info">
                      <h4>{prod.nombre}</h4>
                      <div className="ini-mini-footer">
                        <span className="ini-mini-price">${prod.precio}</span>
                        <button className="ini-mini-add">+</button>
                      </div>
                    </div>
                    <div className="ini-mini-shine"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="ini-contacto">
        <div className="container">
          <div className="ini-contacto-split">
            
            <div className="ini-contacto-info">
              <span className="ini-contacto-tag"><FaMapMarkerAlt /> VISÍTANOS</span>
              <h2>¿HABLAMOS?</h2>
              <p className="ini-contacto-sub">
                Estamos en Guacara listos para asesorarte 
                con tu compra o servicio técnico.
              </p>

              <div className="ini-contacto-items">
                <div className="ini-contact-item">
                  <div className="ini-item-icon"><FaMapMarkerAlt /></div>
                  <div className="ini-item-text">
                    <h4>UBICACIÓN</h4>
                    <p>Calle Principal, Centro de Guacara<br/>Carabobo, Venezuela</p>
                  </div>
                </div>

                <div className="ini-contact-item">
                  <div className="ini-item-icon"><FaPhone /></div>
                  <div className="ini-item-text">
                    <h4>TELÉFONO / WHATSAPP</h4>
                    <p>+58 241-1234567<br/>+58 412-1234567</p>
                  </div>
                </div>

                <div className="ini-contact-item">
                  <div className="ini-item-icon"><FaClock /></div>
                  <div className="ini-item-text">
                    <h4>HORARIO</h4>
                    <p>Lun-Vie: 8:00AM - 6:00PM<br/>Sáb: 9:00AM - 4:00PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="ini-contacto-form">
              <div className="ini-form-header">
                <span className="ini-form-tag"><FaEnvelope /> CONTACTO RÁPIDO</span>
                <h3>ESCRÍBENOS</h3>
              </div>
              
              <form className="ini-form">
                <div className="ini-form-row">
                  <div className="ini-input-group">
                    <input type="text" placeholder="Nombre" required />
                    <span className="ini-input-line"></span>
                  </div>
                  <div className="ini-input-group">
                    <input type="tel" placeholder="Teléfono" required />
                    <span className="ini-input-line"></span>
                  </div>
                </div>
                
                <div className="ini-input-group full">
                  <input type="email" placeholder="Correo electrónico" required />
                  <span className="ini-input-line"></span>
                </div>
                
                <div className="ini-input-group full">
                  <textarea placeholder="¿En qué podemos ayudarte?" rows="4" required></textarea>
                  <span className="ini-input-line"></span>
                </div>
                
                <button type="submit" className="ini-btn-submit">
                  <span>ENVIAR MENSAJE</span>
                  <span className="ini-btn-shine"></span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Mensaje />
      <Footer />
    </>
  );
};

export default Inicio;