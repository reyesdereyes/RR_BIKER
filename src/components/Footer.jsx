import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/footer.css';

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
    <footer className="ftr-root">
      {/* TOP BAR */}
      <div className="ftr-top-bar">
        <div className="ftr-container">
          <div className="ftr-top-content">
            <div className="ftr-top-badge">🏍️ DESDE 2009</div>
            <div className="ftr-top-text">LA PASIÓN POR LAS DOS RUEDAS</div>
            <div className="ftr-top-stats">
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
      <div className="ftr-main">
        <div className="ftr-container">
          <div className="ftr-grid">
            
            {/* BRAND COLUMN */}
            <div className="ftr-brand">
              <div className="ftr-brand-header">
                <div className="ftr-logo">
                  <span className="ftr-logo-icon">🏍️</span>
                  <div className="ftr-logo-text">
                    <span className="ftr-logo-main">RR</span>
                    <span className="ftr-logo-accent">BIKER</span>
                  </div>
                </div>
                <div className="ftr-logo-tag">GUACARA • VENEZUELA</div>
              </div>
              
              <p className="ftr-brand-desc">
                Especialistas en equipamiento premium y repuestos de alta performance para motocicletas. 
                Tu moto merece lo mejor, nosotros lo hacemos posible.
              </p>

              <div className="ftr-brand-features">
                <div className="ftr-feature-item">
                  <span className="ftr-feature-check">✓</span>
                  <span>Garantía extendida</span>
                </div>
                <div className="ftr-feature-item">
                  <span className="ftr-feature-check">✓</span>
                  <span>Envíos nacionales</span>
                </div>
                <div className="ftr-feature-item">
                  <span className="ftr-feature-check">✓</span>
                  <span>Soporte técnico</span>
                </div>
              </div>
            </div>

            {/* NAVIGATION COLUMN */}
            <div className="ftr-nav">
              <h4 className="ftr-title">
                <span className="ftr-title-line"></span>
                NAVEGACIÓN
              </h4>
              <ul className="ftr-nav-list">
                {navLinks.map((link, idx) => (
                  <li key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                    <Link to={link.to} className="ftr-nav-link">
                      <span className="ftr-link-icon">{link.icon}</span>
                      <span className="ftr-link-text">{link.label}</span>
                      <span className="ftr-link-arrow">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT COLUMN */}
            <div className="ftr-contact">
              <h4 className="ftr-title">
                <span className="ftr-title-line"></span>
                CONTACTO DIRECTO
              </h4>
              <ul className="ftr-contact-list">
                {contactInfo.map((item, idx) => (
                  <li key={idx} className="ftr-contact-item">
                    <span className="ftr-contact-icon">{item.icon}</span>
                    <div className="ftr-contact-data">
                      <span className="ftr-data-label">{item.label}</span>
                      {item.link ? (
                        <a href={item.link} className="ftr-data-value ftr-link">{item.value}</a>
                      ) : (
                        <span className="ftr-data-value">{item.value}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* NEWSLETTER COLUMN */}
            <div className="ftr-newsletter">
              <h4 className="ftr-title">
                <span className="ftr-title-line"></span>
                CLUB RR BIKER
              </h4>
              
              <div className="ftr-newsletter-box">
                <p className="ftr-newsletter-desc">
                  Únete a nuestro club exclusivo y recibe:
                </p>
                <ul className="ftr-newsletter-benefits">
                  <li>🔥 Ofertas flash antes que nadie</li>
                  <li>🏁 Eventos y track days</li>
                  <li>💡 Tips de mantenimiento</li>
                  <li>🎁 Sorteos mensuales</li>
                </ul>

                {subscribed ? (
                  <div className="ftr-subscribe-success">
                    <span className="ftr-success-icon">✓</span>
                    <span>¡Bienvenido al club!</span>
                  </div>
                ) : (
                  <form className="ftr-subscribe-form" onSubmit={handleSubscribe}>
                    <div className="ftr-input-group">
                      <input 
                        type="email" 
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <div className="ftr-input-focus"></div>
                    </div>
                    <button type="submit" className="ftr-subscribe-btn">
                      <span className="ftr-btn-text">UNIRME</span>
                      <span className="ftr-btn-icon">→</span>
                    </button>
                  </form>
                )}
              </div>

              {/* SOCIAL LINKS */}
              <div className="ftr-social">
                <span className="ftr-social-label">SÍGUENOS:</span>
                <div className="ftr-social-icons">
                  {socialLinks.map((social, idx) => (
                    <a 
                      key={idx} 
                      href={social.url} 
                      className="ftr-social-icon"
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
      <div className="ftr-bottom">
        <div className="ftr-container">
          <div className="ftr-bottom-content">
            <div className="ftr-bottom-left">
              <span className="ftr-copyright">
                © {new Date().getFullYear()} RR BIKER
              </span>
              <span className="ftr-separator">|</span>
              <span className="ftr-rights">TODOS LOS DERECHOS RESERVADOS</span>
            </div>
            
            <div className="ftr-bottom-center">
              <div className="ftr-payment">
                <span className="ftr-payment-icon">💳</span>
                <span className="ftr-payment-icon">💰</span>
                <span className="ftr-payment-icon">📱</span>
                <span className="ftr-payment-text">PAGO SEGURO</span>
              </div>
            </div>

            <div className="ftr-bottom-right">
              <Link to="/privacidad" className="ftr-legal-link">PRIVACIDAD</Link>
              <span className="ftr-separator">•</span>
              <Link to="/terminos" className="ftr-legal-link">TÉRMINOS</Link>
              <span className="ftr-separator">•</span>
              <Link to="/faq" className="ftr-legal-link">FAQ</Link>
            </div>
          </div>
        </div>
      </div>

      {/* DECORATIVE ELEMENT */}
      <div className="ftr-deco">
        <div className="ftr-deco-line"></div>
        <div className="ftr-deco-text">RR BIKER • DESDE 2009 • GUACARA, VENEZUELA</div>
        <div className="ftr-deco-line"></div>
      </div>
    </footer>
  );
};

export default Footer;