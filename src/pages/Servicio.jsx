import React, { useState, useEffect, useRef } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Servicio.css";

const Servicio = () => {
  const [activeService, setActiveService] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const servicios = [
    {
      id: 1,
      codigo: "01",
      icono: "🔧",
      titulo: "Mantenimiento General",
      descripcion: "Servicio completo de revisión y mantenimiento preventivo para todas las marcas y modelos de motocicletas.",
      caracteristicas: ["Cambio de aceite sintético", "Revisión de frenos ABS", "Ajuste de cadena KMC", "Revisión eléctrica"],
      precio: "$50",
      tiempo: "2-3 horas",
      garantia: "30 días",
      popular: true
    },
    {
      id: 2,
      codigo: "02",
      icono: "⚡",
      titulo: "Reparación de Motor",
      descripcion: "Diagnóstico y reparación especializada de motores 2T y 4T con garantía extendida.",
      caracteristicas: ["Rectificación de cilindros", "Cambio de anillos OEM", "Revisión de culata", "Calibración de válvulas"],
      precio: "Cotizar",
      tiempo: "1-3 días",
      garantia: "90 días",
      popular: false
    },
    {
      id: 3,
      codigo: "03",
      icono: "🛞",
      titulo: "Cambio de Cauchos",
      descripcion: "Venta e instalación de neumáticos de alta gama con balanceo computarizado.",
      caracteristicas: ["Michelin Power RS", "Pirelli Diablo Rosso", "Dunlop SportSmart", "Balanceo digital"],
      precio: "$80",
      tiempo: "1 hora",
      garantia: "60 días",
      popular: true
    },
    {
      id: 4,
      codigo: "04",
      icono: "🎨",
      titulo: "Pintura y Body",
      descripcion: "Restauración profesional con cabina de pintura controlada y personalización total.",
      caracteristicas: ["Pintura poliuretano", "Soldadura TIG/MIG", "Enderezado chasis", "Aerografía"],
      precio: "$120",
      tiempo: "3-7 días",
      garantia: "1 año",
      popular: false
    },
    {
      id: 5,
      codigo: "05",
      icono: "⚙️",
      titulo: "Sistema de Transmisión",
      descripcion: "Reemplazo completo de kit de arrastre con componentes de competición.",
      caracteristicas: ["Piñón Renthal", "Corona AFAM", "Cadena RK X-Ring", "Lubricación cerámica"],
      precio: "$60",
      tiempo: "1.5 horas",
      garantia: "45 días",
      popular: false
    },
    {
      id: 6,
      codigo: "06",
      icono: "🔋",
      titulo: "Sistema Eléctrico",
      descripcion: "Diagnóstico con scanner profesional y solución de fallas complejas.",
      caracteristicas: ["Baterías Yuasa", "Reguladores Mosfet", "Arranques de alto torque", "Luces LED"],
      precio: "$30",
      tiempo: "1-2 horas",
      garantia: "60 días",
      popular: false
    }
  ];

  const stats = [
    { num: "15+", label: "AÑOS", sub: "Experiencia" },
    { num: "5000+", label: "MOTOS", sub: "Reparadas" },
    { num: "50+", label: "MARCAS", sub: "Atendidas" },
    { num: "24H", label: "EXPRESS", sub: "Servicio" }
  ];

  const garantias = [
    { icono: "🏆", titulo: "GARANTÍA REAL", desc: "Hasta 1 año en mano de obra" },
    { icono: "⚙️", titulo: "REPUESTOS OEM", desc: "Originales y alternativas premium" },
    { icono: "🔍", titulo: "DIAGNÓSTICO FREE", desc: "Sin compromiso de compra" },
    { icono: "⏱️", titulo: "ENTREGA PUNTUAL", desc: "Cumplimos o devolvemos" }
  ];

  const tallerFeatures = [
    { icon: "🏭", title: "INSTALACIONES", desc: "500m² equipados" },
    { icon: "🔧", title: "EQUIPAMIENTO", desc: "Herramientas Snap-on" },
    { icon: "👨‍🔧", title: "PERSONAL", desc: "Mecánicos certificados" },
    { icon: "📊", title: "TECNOLOGÍA", desc: "Diagnóstico computarizado" }
  ];

  return (
    <>
      <Header />
      
      {/* HERO SECTION */}
      <section className="srv-hero" ref={heroRef}>
        <div className="srv-hero-bg" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <div className="srv-hero-grid"></div>
          <div className="srv-hero-glow"></div>
        </div>
        
        <div className="container srv-hero-content">
          <div className="srv-hero-badge">🏁 SERVICIO TÉCNICO</div>
          
          <h1 className="srv-hero-title">
            <span className="srv-title-line">TALLER DE</span>
            <span className="srv-title-line red">ALTA PERFORMANCE</span>
          </h1>
          
          <p className="srv-hero-sub">
            Especialistas en motocicletas de alta cilindrada. 
            Tecnología de punta + Mecánicos certificados.
          </p>
          
          <div className="srv-hero-cta">
            <a href="#servicios" className="srv-btn-primary">
              <span>VER SERVICIOS</span>
              <span className="srv-btn-arrow">↓</span>
            </a>
            <a href="#cotizar" className="srv-btn-secondary">
              <span className="srv-btn-icon">📞</span>
              <span>EMERGENCIA 24H</span>
            </a>
          </div>

          <div className="srv-hero-visual">
            <div className="srv-visual-ring"></div>
            <div className="srv-visual-ring ring-2"></div>
            <div className="srv-visual-center">🏭</div>
            <div className="srv-visual-orbit srv-orbit-1">🔧</div>
            <div className="srv-visual-orbit srv-orbit-2">⚡</div>
            <div className="srv-visual-orbit srv-orbit-3">🏁</div>
          </div>
        </div>

        <div className="srv-hero-deco">
          <div className="srv-deco-line"></div>
          <span className="srv-deco-text">RR BIKER • GUACARA • DESDE 2009</span>
          <div className="srv-deco-line"></div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="srv-stats">
        <div className="container">
          <div className="srv-stats-bar">
            {stats.map((stat, idx) => (
              <div key={idx} className="srv-stat-box">
                <div className="srv-stat-sep">{idx > 0 && "//"}</div>
                <div className="srv-stat-content">
                  <span className="srv-stat-value">{stat.num}</span>
                  <div className="srv-stat-text">
                    <span className="srv-stat-label">{stat.label}</span>
                    <span className="srv-stat-sub">{stat.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="srv-stats-glow"></div>
      </section>

      {/* SERVICIOS GRID */}
      <section className="srv-servicios" id="servicios">
        <div className="container">
          <div className="srv-section-header">
            <span className="srv-section-tag">CATÁLOGO</span>
            <h2 className="srv-section-title">SERVICIOS ESPECIALIZADOS</h2>
            <div className="srv-title-underline"></div>
          </div>

          <div className="srv-services-grid">
            {servicios.map((srv, idx) => (
              <div 
                key={srv.id} 
                className={`srv-service-card ${srv.popular ? 'popular' : ''}`}
                onMouseEnter={() => setActiveService(srv.id)}
                onMouseLeave={() => setActiveService(null)}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {srv.popular && <div className="srv-popular-badge">🔥 POPULAR</div>}
                
                <div className="srv-card-header">
                  <span className="srv-card-code">{srv.codigo}</span>
                  <div className="srv-card-icon">{srv.icono}</div>
                </div>

                <div className="srv-card-body">
                  <h3>{srv.titulo}</h3>
                  <p>{srv.descripcion}</p>
                  
                  <ul className="srv-card-specs">
                    {srv.caracteristicas.map((feat, i) => (
                      <li key={i}>
                        <span>▸</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="srv-card-footer">
                  <div className="srv-price-block">
                    <span className="srv-price-label">DESDE</span>
                    <span className="srv-price-value">{srv.precio}</span>
                  </div>
                  <div className="srv-card-meta">
                    <span>⏱️ {srv.tiempo}</span>
                    <span>🛡️ {srv.garantia}</span>
                  </div>
                  <button className="srv-card-btn">
                    SOLICITAR
                    <span>→</span>
                  </button>
                </div>

                <div className="srv-card-shine"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TALLER FEATURES */}
      <section className="srv-taller">
        <div className="container">
          <div className="srv-taller-grid">
            <div className="srv-taller-visual">
              <div className="srv-visual-frame">
                <div className="srv-visual-content">
                  <span>🏭</span>
                  <p>NUESTRAS INSTALACIONES</p>
                </div>
                <div className="srv-visual-stat">
                  <span>500</span>
                  <small>m²</small>
                </div>
              </div>
            </div>
            
            <div className="srv-taller-info">
              <span className="srv-taller-tag">INFRAESTRUCTURA</span>
              <h2>TALLER EQUIPADO<br/><span>PARA LA EXCELENCIA</span></h2>
              
              <div className="srv-taller-features">
                {tallerFeatures.map((feat, idx) => (
                  <div key={idx} className="srv-taller-item">
                    <div className="srv-taller-icon">{feat.icon}</div>
                    <div className="srv-taller-text">
                      <h4>{feat.title}</h4>
                      <p>{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GARANTÍAS */}
      <section className="srv-garantias">
        <div className="container">
          <div className="srv-garantias-header">
            <span className="srv-section-tag">CONFIANZA</span>
            <h2 className="srv-section-title">POR QUÉ ELEGIRNOS</h2>
            <div className="srv-title-underline"></div>
          </div>
          
          <div className="srv-garantias-grid">
            {garantias.map((g, idx) => (
              <div key={idx} className="srv-garantia-card">
                <div className="srv-garantia-icon">{g.icono}</div>
                <h3>{g.titulo}</h3>
                <p>{g.desc}</p>
                <div className="srv-garantia-bar"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="srv-cta" id="cotizar">
        <div className="container">
          <div className="srv-cta-box">
            <div className="srv-cta-badge">⚡ RESPUESTA INMEDIATA</div>
            <h2>¿NECESITAS UNA COTIZACIÓN?</h2>
            <p>Déjanos tus datos y te contactamos en menos de 30 minutos.</p>
            
            <form className="srv-cta-form">
              <div className="srv-form-row">
                <div className="srv-input-group">
                  <input type="text" placeholder="Nombre completo" required />
                  <span className="srv-input-line"></span>
                </div>
                <div className="srv-input-group">
                  <input type="tel" placeholder="Teléfono" required />
                  <span className="srv-input-line"></span>
                </div>
              </div>
              
              <div className="srv-input-group full">
                <select required>
                  <option value="">Tipo de servicio</option>
                  {servicios.map(s => (
                    <option key={s.id} value={s.id}>{s.titulo}</option>
                  ))}
                </select>
                <span className="srv-input-line"></span>
              </div>

              <div className="srv-input-group full">
                <textarea rows="3" placeholder="Describe el problema..."></textarea>
                <span className="srv-input-line"></span>
              </div>

              <button type="submit" className="srv-cta-btn">
                <span>OBTENER COTIZACIÓN</span>
                <span className="srv-btn-shine"></span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Servicio;