import React, { useState, useEffect, useRef } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FaMapMarkerAlt, FaUsers, FaEnvelope, FaPhone, FaWhatsapp, FaInstagram, FaTiktok,
  FaParking, FaCoffee, FaCreditCard, FaTruck, FaCompass, FaCar, FaMotorcycle,
  FaUserTie, FaUser, FaUserSecret, FaCheck, FaWheelchair, FaShieldAlt,
  FaArrowRight,  // ← AGREGADO
  FaTools,       // ← AGREGADO (se usa en el select de motivos)
  FaCogs,        // ← AGREGADO (se usa en el select de motivos)
  FaFlagCheckered // ← AGREGADO (se usa en horarios)
} from 'react-icons/fa';
import "../css/contacto.css";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    motivo: '',
    mensaje: ''
  });
  const [activeTab, setActiveTab] = useState('info');
  const [isVisible, setIsVisible] = useState({ hero: true });
  const [scrollY, setScrollY] = useState(0);
  const sectionRefs = useRef({});

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer para secciones
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.dataset.section]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    Object.entries(sectionRefs.current).forEach(([key, ref]) => {
      if (ref && key !== 'hero') observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
  };

  const teamMembers = [
    {
      nombre: "Carlos 'El Jefe' Rodríguez",
      cargo: "CEO & Fundador",
      foto: <FaUserTie />, // ejecutivo
      telefono: "+58 412-1234567",
      experiencia: "15 años",
      especialidad: "Estrategia & Ventas"
    },
    {
      nombre: "María González",
      cargo: "Directora de Ventas",
      foto: <FaUser />,
      telefono: "+58 412-7654321",
      experiencia: "8 años",
      especialidad: "Atención al Cliente"
    },
    {
      nombre: "Luis 'Mecánico' Martínez",
      cargo: "Jefe de Taller",
      foto: <FaUserSecret />, // placeholder technician
      telefono: "+58 414-9876543",
      experiencia: "12 años",
      especialidad: "Motores 4T"
    },
    {
      nombre: "Ana Pereira",
      cargo: "Especialista Repuestos",
      foto: <FaMotorcycle />,
      telefono: "+58 416-1122334",
      experiencia: "6 años",
      especialidad: "Inventario & Logística"
    }
  ];

  const horarios = [
    { dia: "LUN - VIE", hora: "08:00 - 18:00", estado: "abierto", tag: "FULL" },
    { dia: "SÁBADOS", hora: "09:00 - 14:00", estado: "abierto", tag: "HALF" },
    { dia: "DOMINGOS", hora: "CERRADO", estado: "cerrado", tag: "OFF" }
  ];

  const features = [
    { icon: <FaParking />, title: "PARKING PRIVADO", desc: "Seguridad 24/7" },
    { icon: <FaCoffee />, title: "LOUNGE VIP", desc: "Espera premium" },
    { icon: <FaCreditCard />, title: "PAGO FLEXIBLE", desc: "Múltiples métodos" },
    { icon: <FaTruck />, title: "DELIVERY RÁPIDO", desc: "Cobertura total" }
  ];

  const contactMethods = [
    { icon: <FaMapMarkerAlt />, label: "VISÍTANOS", value: "Calle Principal, Guacara", action: "Ver mapa", link: "#mapa" },
    { icon: <FaPhone />, label: "LLÁMANOS", value: "+58 241-1234567", action: "Llamar ahora", link: "tel:+582411234567" },
    { icon: <FaWhatsapp />, label: "WHATSAPP", value: "+58 412-1234567", action: "Iniciar chat", link: "https://wa.me/584121234567" },
    { icon: <FaEnvelope />, label: "EMAIL", value: "ventas.rrbiker@gmail.com", action: "Enviar correo", link: "mailto:ventas.rrbiker@gmail.com" },
    { icon: <FaInstagram />, label: "INSTAGRAM", value: "@rrodriguez.biker", action: "Visitar", link: "https://instagram.com/rrodriguez.biker" },
    { icon: <FaTiktok />, label: "TIKTOK", value: "@RRBIKER_", action: "Ver perfil", link: "https://www.tiktok.com/@RRBIKER_" }
  ];

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <section className="ctc-hero">
        <div className="ctc-hero-bg" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <div className="ctc-grid-overlay"></div>
          <div className="ctc-hero-glow"></div>
          <div className="ctc-hero-particles"></div>
        </div>
        
        <div className="container ctc-hero-content">
          <div className="ctc-hero-badge visible">
            <span className="ctc-badge-pulse"></span>
            <span className="badge-text">CONTACTO DIRECTO</span>
          </div>
          
          <h1 className="ctc-hero-title visible">
            <span className="ctc-title-line" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
              CONECTA CON
            </span>
            <span className="ctc-title-line accent">
              RR BIKER HQ
            </span>
          </h1>
          
          <p className="ctc-hero-sub visible">
            <FaMapMarkerAlt className="sub-icon" />
            CENTRO DE OPERACIONES • GUACARA, CARABOBO
          </p>

          <div className="ctc-hero-stats visible">
            {[
              { num: "15+", label: "AÑOS", sub: "Experiencia" },
              { num: "24/7", label: "SOPORTE", sub: "Emergencias" },
              { num: "4.9", label: "RATING", sub: "Clientes" }
            ].map((stat, idx) => (
              <div key={idx} className="ctc-stat-item" style={{ animationDelay: `${idx * 0.2}s` }}>
                <span className="ctc-stat-num">{stat.num}</span>
                <div className="ctc-stat-text">
                  <span className="ctc-stat-label">{stat.label}</span>
                  <span className="ctc-stat-sub">{stat.sub}</span>
                </div>
                {idx < 2 && <div className="ctc-stat-divider">//</div>}
              </div>
            ))}
          </div>

          <div className="ctc-scroll-hint">
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
            <span>SCROLL</span>
          </div>
        </div>

        <div className="ctc-hero-deco">
          <div className="ctc-deco-line"></div>
          <span className="ctc-deco-text">10.229223° N 67.865707° W</span>
          <div className="ctc-deco-line"></div>
        </div>

        <div className="ctc-corner top-left"></div>
        <div className="ctc-corner top-right"></div>
        <div className="ctc-corner bottom-left"></div>
        <div className="ctc-corner bottom-right"></div>
      </section>

      {/* NAVEGACIÓN TABS */}
      <section className="ctc-tabs-section">
        <div className="container">
          <div className="ctc-tabs">
            {[
              { id: 'info', label: 'INFORMACIÓN', icon: <FaMapMarkerAlt /> },
              { id: 'equipo', label: 'EQUIPO', icon: <FaUsers /> },
              { id: 'formulario', label: 'ESCRÍBENOS', icon: <FaEnvelope /> }
            ].map(tab => (
              <button
                key={tab.id}
                className={`ctc-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="ctc-tab-icon">{tab.icon}</span>
                <span className="ctc-tab-label">{tab.label}</span>
                {activeTab === tab.id && <div className="ctc-tab-glow"></div>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENIDO DINÁMICO */}
      <section className="ctc-content" data-section="content" ref={el => sectionRefs.current.content = el}>
        <div className="container">
          
          {/* TAB: INFORMACIÓN */}
          {activeTab === 'info' && (
            <div className={`ctc-info-grid ${isVisible.content ? 'visible' : ''}`}>
              
              {/* Mapa Principal Mejorado */}
              <div className="ctc-map-container">
                <div className="ctc-map-frame">
                  <div className="ctc-map-header">
                    <div className="ctc-map-coords">
                      <span className="coords-label">LAT</span>
                      <span className="coords-value">10.229223° N</span>
                      <span className="coords-divider">|</span>
                      <span className="coords-label">LONG</span>
                      <span className="coords-value">67.865707° W</span>
                    </div>
                    <div className="ctc-map-status">
                      <span className="status-dot"></span>
                      <span className="status-text">ABIERTO AHORA</span>
                    </div>
                  </div>
                  
                  {/* Dirección escrita destacada */}
                  <div className="ctc-map-address">
                      <div className="address-icon"><FaMotorcycle /></div>
                    <div className="address-content">
                      <h4>RR BIKER HEADQUARTERS</h4>
                      <p className="address-street">Calle Principal entre Av. Bolívar y Calle Miranda</p>
                      <p className="address-zone">Sector Centro, Guacara, Edo. Carabobo</p>
                      <p className="address-landmark"><FaMapMarkerAlt /> Frente a la Plaza Bolívar, al lado del Centro Comercial Guacara Plaza</p>
                      <div className="address-meta">
                        <span className="meta-badge"><FaParking /> Parking Privado</span>
                        <span className="meta-badge"><FaWheelchair /> Accesible</span>
                        <span className="meta-badge"><FaShieldAlt /> Seguridad 24/7</span>
                      </div>
                    </div>
                  </div>

                  <div className="ctc-map-body">
                    <iframe
                      title="RR Biker Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.1234567890123!2d-67.865707!3d10.229223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDEzJzQ1LjIiTiA2N8KwNTEnNTYuNSJX!5e0!3m2!1ses!2sve!4v1234567890123!5m2!1ses!2sve"
                      width="100%"
                      height="350"
                      style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  
                  <div className="ctc-map-footer">
                    <a 
                      href="https://www.google.com/maps/dir/?api=1&destination=10.229223,-67.865707" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="map-directions-btn"
                    >
                      <span className="btn-icon"><FaCompass /></span>
                      <span className="btn-text">COMO LLEGAR</span>
                      <span className="btn-arrow"><FaArrowRight /></span>
                    </a>
                    <a 
                      href="https://waze.com/ul?ll=10.229223,-67.865707&navigate=yes" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="map-waze-btn"
                    >
                      <span className="btn-icon"><FaCar /></span>
                      <span className="btn-text">ABRIR EN WAZE</span>
                    </a>
                  </div>
                  
                  <div className="ctc-map-grain"></div>
                </div>
              </div>

              {/* Métodos de Contacto */}
              <div className="ctc-methods">
                <h3 className="ctc-section-label">CANALES DIRECTOS</h3>
                {contactMethods.map((method, idx) => (
                  <a 
                    key={idx} 
                    href={method.link}
                    className="ctc-method-card" 
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="method-icon">{method.icon}</div>
                    <div className="method-content">
                      <span className="method-label">{method.label}</span>
                      <span className="method-value">{method.value}</span>
                    </div>
                    <span className="method-action">{method.action}</span>
                    <div className="method-shine"></div>
                  </a>
                ))}
              </div>

              {/* Horarios Estilo Pit Board */}
              <div className="ctc-schedule">
                <div className="schedule-header">
                  <span className="schedule-icon"><FaFlagCheckered /></span>
                  <h3>HORARIO DE OPERACIONES</h3>
                  <span className="schedule-status">EN SERVICIO</span>
                </div>
                <div className="pit-board">
                  {horarios.map((h, idx) => (
                    <div key={idx} className={`pit-row ${h.estado}`}>
                      <div className="pit-info">
                        <span className="pit-tag">{h.tag}</span>
                        <span className="pit-day">{h.dia}</span>
                      </div>
                      <div className="pit-time">
                        <span className="time-value">{h.hora}</span>
                        <span className={`time-status ${h.estado}`}>
                          {h.estado === 'abierto' ? '● OPERATIVO' : '○ CERRADO'}
                        </span>
                      </div>
                      <div className="pit-bar"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Grid */}
              <div className="ctc-features-mini">
                {features.map((f, idx) => (
                  <div key={idx} className="ctc-feature-item">
                    <div className="feature-icon-box">{f.icon}</div>
                    <div className="feature-text">
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EQUIPO */}
          {activeTab === 'equipo' && (
            <div className="ctc-team-section" data-section="team" ref={el => sectionRefs.current.team = el}>
              <div className={`ctc-team-header ${isVisible.team ? 'visible' : ''}`}>
                <span className="ctc-section-tag">PIT CREW</span>
                <h2>EQUIPO DE ALTA PERFORMANCE</h2>
                <p>Profesionales certificados listos para atenderte</p>
              </div>

              <div className="ctc-team-grid">
                {teamMembers.map((member, idx) => (
                  <div 
                    key={idx} 
                    className={`ctc-team-card ${isVisible.team ? 'visible' : ''}`}
                    style={{ transitionDelay: `${idx * 0.15}s` }}
                  >
                    <div className="team-rank">0{idx + 1}</div>
                    <div className="team-visual">
                      <div className="team-avatar-ring"></div>
                      <div className="team-avatar">{member.foto}</div>
                      <div className="team-exp-badge">
                        <span className="exp-num">{member.experiencia.split(' ')[0]}</span>
                        <span className="exp-text">AÑOS</span>
                      </div>
                    </div>
                    <div className="team-info">
                      <h4>{member.nombre}</h4>
                      <span className="team-role">{member.cargo}</span>
                      <span className="team-spec">{member.especialidad}</span>
                      <a href={`https://wa.me/${member.telefono.replace(/\D/g,'')}`} className="team-contact-btn" target="_blank" rel="noopener noreferrer">
                        <FaPhone />
                        Contactar
                      </a>
                    </div>
                    <div className="team-accent-bar"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FORMULARIO */}
          {activeTab === 'formulario' && (
            <div className="ctc-form-section">
              <div className="ctc-form-container">
                <div className="form-header">
                  <div className="form-badge">
                    <span className="badge-icon"><FaEnvelope /></span>
                    <span className="badge-text">NUEVO MENSAJE</span>
                  </div>
                  <div className="form-meta">
                    <span className="meta-item">ID: RR-2024-FORM</span>
                    <span className="meta-item">PRIORIDAD: ALTA</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="ctc-form">
                  <div className="form-row">
                    <div className="input-group">
                      <label>
                        <span className="label-icon"><FaUser /></span>
                        NOMBRE COMPLETO *
                      </label>
                      <input 
                        type="text" 
                        placeholder="Ej: Juan Pérez"
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        required 
                      />
                      <div className="input-line"></div>
                    </div>
                    
                    <div className="input-group">
                      <label>
                        <span className="label-icon"><FaPhone /></span>
                        TELÉFONO *
                      </label>
                      <input 
                        type="tel" 
                        placeholder="0412-1234567"
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                        required 
                      />
                      <div className="input-line"></div>
                    </div>
                  </div>

                  <div className="input-group full">
                    <label>
                      <span className="label-icon"><FaEnvelope /></span>
                      CORREO ELECTRÓNICO *
                    </label>
                    <input 
                      type="email" 
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                    <div className="input-line"></div>
                  </div>

                  <div className="input-group full">
                    <label>
                      <span className="label-icon">🎯</span>
                      MOTIVO DE CONTACTO *
                    </label>
                    <div className="select-wrapper">
                      <select 
                        value={formData.motivo}
                        onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                        required
                      >
                        <option value="">SELECCIONAR MOTIVO</option>
                        <option value="repuestos"><FaTools /> CONSULTA DE REPUESTOS</option>
                        <option value="taller"><FaCogs /> AGENDAR SERVICIO TÉCNICO</option>
                        <option value="garantia">🛡️ RECLAMO DE GARANTÍA</option>
                        <option value="mayor">📦 VENTA AL MAYOR</option>
                        <option value="otro">❓ OTRA CONSULTA</option>
                      </select>
                      <div className="input-line"></div>
                    </div>
                  </div>

                  <div className="input-group full">
                    <label>
                      <span className="label-icon">📝</span>
                      DETALLES DE TU CONSULTA
                    </label>
                    <textarea 
                      rows="5" 
                      placeholder="Describe tu consulta con el mayor detalle posible..."
                      value={formData.mensaje}
                      onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                    ></textarea>
                    <div className="input-line"></div>
                  </div>

                  <button type="submit" className="ctc-submit-btn">
                    <span className="btn-content">
                      <span className="btn-icon">🚀</span>
                      <span className="btn-text">ENVIAR MENSAJE</span>
                    </span>
                    <div className="btn-shine"></div>
                    <div className="btn-glow"></div>
                  </button>
                </form>
              </div>

              <div className="ctc-form-sidebar">
                <div className="sidebar-card">
                  <h4>¿POR QUÉ ESCRIBIRNOS?</h4>
                  <ul>
                    <li>✓ Respuesta en menos de 2 horas</li>
                    <li>✓ Asesoría técnica especializada</li>
                    <li>✓ Cotizaciones sin compromiso</li>
                    <li>✓ Seguimiento de tu caso</li>
                  </ul>
                </div>
                <div className="sidebar-card urgent">
                  <span className="urgent-icon">🚨</span>
                  <h4>¿EMERGENCIA?</h4>
                  <p>Para casos urgentes fuera de horario, llama directo:</p>
                  <a href="tel:+584121234567" className="urgent-phone">+58 412-1234567</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="ctc-cta">
        <div className="container">
          <div className="cta-box">
            <div className="cta-badge"><FaMotorcycle /> RR BIKER</div>
            <h2>¿PREFIERES VISITARNOS?</h2>
            <p>Estamos en Guacara listos para recibirte. Parking privado disponible.</p>
            <div className="cta-actions">
              <a href="https://www.google.com/maps/dir/?api=1&destination=10.229223,-67.865707" target="_blank" rel="noopener noreferrer" className="cta-btn primary">
                <span><FaMapMarkerAlt /></span>
                CÓMO LLEGAR
              </a>
              <a href="tel:+582411234567" className="cta-btn secondary">
                <span><FaPhone /></span>
                LLAMAR AHORA
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contacto;