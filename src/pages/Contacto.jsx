import React, { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Contacto.css";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    motivo: '',
    mensaje: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
  };

  const teamMembers = [
    {
      nombre: "Carlos 'El Jefe' Rodríguez",
      cargo: "CEO & Fundador",
      foto: "👨‍💼",
      telefono: "+58 412-1234567",
      experiencia: "15 años"
    },
    {
      nombre: "María González",
      cargo: "Directora de Ventas",
      foto: "👩‍💼",
      telefono: "+58 412-7654321",
      experiencia: "8 años"
    },
    {
      nombre: "Luis 'Mecánico' Martínez",
      cargo: "Jefe de Taller",
      foto: "👨‍🔧",
      telefono: "+58 414-9876543",
      experiencia: "12 años"
    },
    {
      nombre: "Ana Pereira",
      cargo: "Especialista Repuestos",
      foto: "🏍️",
      telefono: "+58 416-1122334",
      experiencia: "6 años"
    }
  ];

  const horarios = [
    { dia: "LUN - VIE", hora: "08:00 - 18:00", estado: "abierto" },
    { dia: "SÁBADOS", hora: "09:00 - 16:00", estado: "abierto" },
    { dia: "DOMINGOS", hora: "CERRADO", estado: "cerrado" }
  ];

  const features = [
    { icon: "🅿️", title: "PARKING PRIVADO", desc: "Seguridad 24/7 para tu moto" },
    { icon: "☕", title: "LOUNGE VIP", desc: "Área de espera con amenities" },
    { icon: "💳", title: "PAGO FLEXIBLE", desc: "Múltiples métodos de pago" },
    { icon: "🚚", title: "DELIVERY RÁPIDO", desc: "Cobertura en todo Guacara" }
  ];

  return (
    <>
      <Header />

      {/* HERO AGRESIVO */}
      <section className="contacto-hero-v2">
        <div className="hero-bg-pattern"></div>
        <div className="container hero-content-v2">
          <div className="hero-badge">📍 UBICACIÓN</div>
          <h1 className="hero-title-v2">
            RR BIKER <span className="text-outline">HEADQUARTERS</span>
          </h1>
          <p className="hero-subtitle-v2">
            CENTRO DE OPERACIONES GUACARA • CARABOBO
          </p>
          <div className="hero-stats-bar">
            <div className="stat-item-v2">
              <span className="stat-num-v2">10+</span>
              <span className="stat-label-v2">AÑOS</span>
            </div>
            <div className="divider"></div>
            <div className="stat-item-v2">
              <span className="stat-num-v2">24/7</span>
              <span className="stat-label-v2">SOPORTE</span>
            </div>
            <div className="divider"></div>
            <div className="stat-item-v2">
              <span className="stat-num-v2">#1</span>
              <span className="stat-label-v2">EN VENTAS</span>
            </div>
          </div>
        </div>
        <div className="hero-deco-line"></div>
      </section>

      {/* SECCIÓN PRINCIPAL - SPLIT DESIGN */}
      <section className="contacto-main-v2">
        <div className="container main-grid-v2">
          
          {/* COLUMNA IZQUIERDA - INFO */}
          <div className="info-column-v2">
            <div className="section-header-v2">
              <span className="section-number">01</span>
              <h2 className="section-title-v2">INFORMACIÓN DEL LOCAL</h2>
            </div>

            {/* Foto del Local con Marco Agresivo */}
            <div className="local-showcase">
              <div className="photo-frame">
                <div className="corner-deco top-left"></div>
                <div className="corner-deco top-right"></div>
                <div className="corner-deco bottom-left"></div>
                <div className="corner-deco bottom-right"></div>
                <div className="photo-content">
                  <span className="photo-icon">🏍️</span>
                  <p>FACHADA PRINCIPAL</p>
                  <small>Av. Bolívar, Guacara</small>
                </div>
                <div className="photo-overlay">
                  <span className="overlay-text">RR BIKER STORE</span>
                </div>
              </div>
            </div>

            {/* Datos de Contacto Estilo Racing */}
            <div className="data-grid-v2">
              <div className="data-card-v2">
                <div className="data-icon-box">
                  <span>📍</span>
                </div>
                <div className="data-content">
                  <h4>DIRECCIÓN EXACTA</h4>
                  <p>Calle Principal entre Av. Bolívar y Carabobo</p>
                  <p className="data-sub">Edificio RR Biker, Planta Baja</p>
                  <span className="data-tag">GUACARA, CARABOBO</span>
                </div>
              </div>

              <div className="data-card-v2">
                <div className="data-icon-box">
                  <span>📞</span>
                </div>
                <div className="data-content">
                  <h4>TELÉFONOS DIRECTOS</h4>
                  <p className="phone-main">+58 241-1234567</p>
                  <p className="phone-ws">WS: +58 412-1234567</p>
                </div>
              </div>

              <div className="data-card-v2">
                <div className="data-icon-box">
                  <span>✉️</span>
                </div>
                <div className="data-content">
                  <h4>CORREOS</h4>
                  <p>ventas@rrbiker.com</p>
                  <p>taller@rrbiker.com</p>
                </div>
              </div>
            </div>

            {/* Horarios Estilo Pit Board */}
            <div className="horarios-pit">
              <div className="pit-header">
                <span className="pit-icon">🏁</span>
                <h3>HORARIO DE BOXES</h3>
              </div>
              <div className="pit-board">
                {horarios.map((h, idx) => (
                  <div key={idx} className={`pit-row ${h.estado}`}>
                    <span className="pit-day">{h.dia}</span>
                    <span className="pit-time">{h.hora}</span>
                    <span className={`pit-status ${h.estado}`}>
                      {h.estado === 'abierto' ? '●' : '○'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA - MAPA Y FORM */}
          <div className="interactive-column-v2">
            <div className="section-header-v2">
              <span className="section-number">02</span>
              <h2 className="section-title-v2">UBICACIÓN & CONTACTO</h2>
            </div>

            {/* Mapa Container */}
            <div className="map-container-v2">
              <div className="map-frame">
                <div className="map-header">
                  <span className="map-coords">10.2354° N, 67.8789° W</span>
                  <span className="map-zoom">ZOOM: 16x</span>
                </div>
                <div className="map-body">
                  <span className="map-icon">🗺️</span>
                  <p>MAPA INTERACTIVO</p>
                  <button className="btn-mapa">CÓMO LLEGAR →</button>
                </div>
                <div className="map-grain"></div>
              </div>
            </div>

            {/* Formulario Estilo Ficha Técnica */}
            <div className="form-container-v2">
              <div className="form-header-v2">
                <div className="form-badge">FORMULARIO DE CONTACTO</div>
                <div className="form-id">ID: RR-2024-CONT</div>
              </div>
              
              <form onSubmit={handleSubmit} className="form-v2">
                <div className="form-row-v2">
                  <div className="input-group-v2">
                    <label>NOMBRE COMPLETO *</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Juan Pérez"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="input-group-v2">
                    <label>TELÉFONO *</label>
                    <input 
                      type="tel" 
                      placeholder="0412-1234567"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className="input-group-v2 full">
                  <label>CORREO ELECTRÓNICO *</label>
                  <input 
                    type="email" 
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>

                <div className="input-group-v2 full">
                  <label>MOTIVO DE CONTACTO *</label>
                  <select 
                    value={formData.motivo}
                    onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                    required
                  >
                    <option value="">SELECCIONAR OPCIÓN</option>
                    <option value="repuestos">CONSULTA DE REPUESTOS</option>
                    <option value="taller">AGENDAR SERVICIO TÉCNICO</option>
                    <option value="garantia">RECLAMO DE GARANTÍA</option>
                    <option value="mayor">VENTA AL MAYOR</option>
                    <option value="otro">OTRO</option>
                  </select>
                </div>

                <div className="input-group-v2 full">
                  <label>MENSAJE / DETALLES</label>
                  <textarea 
                    rows="4" 
                    placeholder="Describe tu consulta aquí..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit-v2">
                  <span className="btn-text">ENVIAR MENSAJE</span>
                  <span className="btn-icon">→</span>
                  <div className="btn-glow"></div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN EQUIPO - GRID AGRESIVO */}
      <section className="equipo-section-v2">
        <div className="container">
          <div className="section-header-v2 centered">
            <span className="section-number">03</span>
            <h2 className="section-title-v2">EQUIPO DE PIT STOP</h2>
            <p className="section-subtitle">PROFESIONALES CERTIFICADOS</p>
          </div>

          <div className="equipo-grid-v2">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="team-card-v2">
                <div className="team-number">0{idx + 1}</div>
                <div className="team-photo-v2">
                  <div className="photo-ring"></div>
                  <span className="team-avatar">{member.foto}</span>
                  <div className="exp-badge">{member.experiencia}</div>
                </div>
                <div className="team-info-v2">
                  <h4>{member.nombre}</h4>
                  <span className="team-role">{member.cargo}</span>
                  <a href={`tel:${member.telefono}`} className="team-contact">
                    <span className="ws-icon">📱</span>
                    {member.telefono}
                  </a>
                </div>
                <div className="team-bar"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES BAR */}
      <section className="features-bar-v2">
        <div className="container features-grid-v2">
          {features.map((f, idx) => (
            <div key={idx} className="feature-item-v2">
              <div className="feature-icon-v2">{f.icon}</div>
              <div className="feature-text-v2">
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
              {idx < features.length - 1 && <div className="feature-divider"></div>}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contacto;