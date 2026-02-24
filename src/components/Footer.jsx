import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            RR<span className="highlight">BIKER</span>
          </div>
          <p className="footer-desc">
            Tu aliado número uno en el camino. Repuestos premium, accesorios de alta gama y el mejor servicio técnico para tu motocicleta en Venezuela.
          </p>
        </div>

        <div className="footer-col links-col">
          <h3>Navegación</h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/productos">Repuestos</Link></li>
            <li><Link to="/servicios">Taller</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

        <div className="footer-col contact-col">
          <h3>Contacto</h3>
          <ul>
            <li>📍 Calle Principal, Guacara</li>
            <li>📞 +58 412-1234567</li>
            <li>✉️ ventas@rrbiker.com</li>
            <li>🕒 Lun-Vie: 8am - 5pm</li>
          </ul>
        </div>

        <div className="footer-col newsletter-col">
          <h3>Únete al Club</h3>
          <p>Recibe ofertas exclusivas y novedades.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Tu correo electrónico" />
            <button type="submit" aria-label="Suscribirse">
              ➔
            </button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} RR Biker. Todos los derechos reservados.</p>
        <div className="footer-legal">
          <span>Privacidad</span> • <span>Términos</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;