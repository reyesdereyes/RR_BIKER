import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const navLinks = [
    { to: "/", label: "INICIO", icon: "🏠" },
    { to: "/productos", label: "REPUESTOS", icon: "🔧" },
    { to: "/servicios", label: "TALLER", icon: "⚙️" },
    { to: "/contacto", label: "CONTACTO", icon: "📍" }
  ];

  const contactInfo = [
    { icon: "📍", label: "DIRECCIÓN", value: "Calle Principal, Guacara, Carabobo" },
    { icon: "📞", label: "TELÉFONO", value: "+58 412-1234567", link: "tel:+584121234567" },
    { icon: "✉️", label: "EMAIL", value: "ventas@rrbiker.com", link: "mailto:ventas@rrbiker.com" },
    { icon: "🕒", label: "HORARIO", value: "Lun-Vie: 8am - 6pm | Sáb: 9am - 2pm" }
  ];

  const socialLinks = [
    { icon: "📘", label: "Facebook", url: "#" },
    { icon: "📸", label: "Instagram", url: "#" },
    { icon: "🎵", label: "TikTok", url: "#" },
    { icon: "💬", label: "WhatsApp", url: "https://wa.me/584121234567" }
  ];

  return (
    <footer className="rr-footer">
      {/* TOP BAR */}
      <div className="rr-footer-top">
        <div className="container">
          <div className="footer-top-content">
            <div className="top-badge">🏍️ DESDE 2009</div>
            <div className="top-text">LA PASIÓN POR LAS DOS RUEDAS</div>
            <div className="top-stats">
              <span>15+ AÑOS</span>
              <span>•</span>
              <span>5000+ CLIENTES</span>
              <span>•</span>
              <span>24/7 SOPORTE</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="rr-footer-main">
        <div className="container">
          <div className="footer-grid">
            
            {/* BRAND COLUMN */}
            <div className="footer-brand">
              <div className="brand-header">
                <div className="brand-logo">
                  <span className="logo-icon">🏍️</span>
                  <div className="logo-text">
                    <span className="logo-main">RR</span>
                    <span className="logo-accent">BIKER</span>
                  </div>
                </div>
                <div className="brand-tag">GUACARA • VENEZUELA</div>
              </div>
              
              <p className="brand-desc">
                Especialistas en equipamiento premium y repuestos de alta performance para motocicletas. 
                Tu moto merece lo mejor, nosotros lo hacemos posible.
              </p>

              <div className="brand-features">
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Garantía extendida</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Envíos nacionales</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Soporte técnico</span>
                </div>
              </div>
            </div>

            {/* NAVIGATION COLUMN */}
            <div className="footer-nav">
              <h4 className="footer-title">
                <span className="title-line"></span>
                NAVEGACIÓN
              </h4>
              <ul className="nav-list">
                {navLinks.map((link, idx) => (
                  <li key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                    <Link to={link.to} className="nav-link">
                      <span className="link-icon">{link.icon}</span>
                      <span className="link-text">{link.label}</span>
                      <span className="link-arrow">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT COLUMN */}
            <div className="footer-contact">
              <h4 className="footer-title">
                <span className="title-line"></span>
                CONTACTO DIRECTO
              </h4>
              <ul className="contact-list">
                {contactInfo.map((item, idx) => (
                  <li key={idx} className="contact-item">
                    <span className="contact-icon">{item.icon}</span>
                    <div className="contact-data">
                      <span className="data-label">{item.label}</span>
                      {item.link ? (
                        <a href={item.link} className="data-value link">{item.value}</a>
                      ) : (
                        <span className="data-value">{item.value}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* NEWSLETTER COLUMN */}
            <div className="footer-newsletter">
              <h4 className="footer-title">
                <span className="title-line"></span>
                CLUB RR BIKER
              </h4>
              
              <div className="newsletter-box">
                <p className="newsletter-desc">
                  Únete a nuestro club exclusivo y recibe:
                </p>
                <ul className="newsletter-benefits">
                  <li>🔥 Ofertas flash antes que nadie</li>
                  <li>🏁 Eventos y track days</li>
                  <li>💡 Tips de mantenimiento</li>
                  <li>🎁 Sorteos mensuales</li>
                </ul>

                {subscribed ? (
                  <div className="subscribe-success">
                    <span className="success-icon">✓</span>
                    <span>¡Bienvenido al club!</span>
                  </div>
                ) : (
                  <form className="subscribe-form" onSubmit={handleSubscribe}>
                    <div className="input-group">
                      <input 
                        type="email" 
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <div className="input-focus"></div>
                    </div>
                    <button type="submit" className="subscribe-btn">
                      <span className="btn-text">UNIRME</span>
                      <span className="btn-icon">→</span>
                    </button>
                  </form>
                )}
              </div>

              {/* SOCIAL LINKS */}
              <div className="social-links">
                <span className="social-label">SÍGUENOS:</span>
                <div className="social-icons">
                  {socialLinks.map((social, idx) => (
                    <a 
                      key={idx} 
                      href={social.url} 
                      className="social-icon"
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="rr-footer-bottom">
        <div className="container">
          <div className="bottom-content">
            <div className="bottom-left">
              <span className="copyright">
                © {new Date().getFullYear()} RR BIKER
              </span>
              <span className="separator">|</span>
              <span className="rights">TODOS LOS DERECHOS RESERVADOS</span>
            </div>
            
            <div className="bottom-center">
              <div className="payment-methods">
                <span className="payment-icon">💳</span>
                <span className="payment-icon">💰</span>
                <span className="payment-icon">📱</span>
                <span className="payment-text">PAGO SEGURO</span>
              </div>
            </div>

            <div className="bottom-right">
              <Link to="/privacidad" className="legal-link">PRIVACIDAD</Link>
              <span className="separator">•</span>
              <Link to="/terminos" className="legal-link">TÉRMINOS</Link>
              <span className="separator">•</span>
              <Link to="/faq" className="legal-link">FAQ</Link>
            </div>
          </div>
        </div>
      </div>

      {/* DECORATIVE ELEMENT */}
      <div className="footer-deco">
        <div className="deco-line"></div>
        <div className="deco-text">RR BIKER • DESDE 2009 • GUACARA, VENEZUELA</div>
        <div className="deco-line"></div>
      </div>
    </footer>
  );
};

export default Footer;