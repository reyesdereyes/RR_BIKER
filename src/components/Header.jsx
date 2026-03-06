import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaMotorcycle, FaMapMarkerAlt, FaEnvelope, FaSearch, FaShoppingCart, FaBolt } from "react-icons/fa";
import logo from "../assets/logo.svg";
import "../css/Header.css";

const HeaderBar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions] = useState([
    "Casco full face", "Guantes racing", "Batería lithium", "Neumático sport", 
    "Cadena moto", "Filtro aceite", "Bujía iridium", "Pastillas freno"
  ]);
  const [filtered, setFiltered] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [highlightStyle, setHighlightStyle] = useState({ width: 0, left: 0, visible: false });

  const wrapperRef = useRef(null);
  const searchRef = useRef(null);
  const navListRef = useRef(null);
  const linkRefs = useRef({});

  useEffect(() => {
    const savedCart = localStorage.getItem('rrbikerCart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCartItems(items);
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rrbikerCart', JSON.stringify(cartItems));
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
  }, [cartItems]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setCartOpen(false);
        setFiltered([]);
        setOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const moveHighlightToKey = useCallback((key) => {
    const navList = navListRef.current;
    const linkEl = linkRefs.current[key];
    if (!navList || !linkEl) return;

    const itemRect = linkEl.getBoundingClientRect();
    const navRect = navList.getBoundingClientRect();
    const width = itemRect.width;
    const left = itemRect.left - navRect.left;

    setHighlightStyle({ width, left, visible: true });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => moveHighlightToKey("inicio"), 100);
    return () => clearTimeout(t);
  }, [moveHighlightToKey]);

  const onSearchChange = (value) => {
    setSearchQuery(value);
    if (!value) {
      setFiltered([]);
      setActiveIndex(-1);
      return;
    }
    const f = suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()));
    setFiltered(f);
    setActiveIndex(f.length ? 0 : -1);
  };

  const handleSearchKey = (e) => {
    if (!filtered.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) {
        setSearchQuery(filtered[activeIndex]);
        setFiltered([]);
      }
    } else if (e.key === "Escape") {
      setFiltered([]);
    }
  };

  const navItems = [
    { key: "inicio", label: "INICIO", to: "/" },
    { key: "productos", label: "PRODUCTOS", to: "/productos" },
    { key: "servicio", label: "SERVICIO", to: "/servicio" },
    { key: "contacto", label: "CONTACTO", to: "/contacto" },
    // enlace rápido a la zona de administración
    { key: "login", label: "ADMIN", to: "/login" }
  ];

  return (
    <>
      <header className={`hdr-root ${scrolled ? "scrolled" : ""}`} ref={wrapperRef}>
        {/* BARRA SUPERIOR */}
        <div className="hdr-top-bar">
          <div className="container">
            <span className="top-text"><FaMotorcycle /> ESPECIALISTAS EN MOTOS DE ALTA CILINDRADA</span>
            <span className="top-text"><FaMapMarkerAlt /> GUACARA, CARABOBO</span>
            <span className="top-text"><FaEnvelope /> ventas.rrbiker@gmail.com</span>
            <span className="top-text highlight"><FaBolt /> SERVICIO 24H</span>
          </div>
        </div>

        {/* HEADER PRINCIPAL */}
        <div className="hdr-main">
          <div className="container hdr-inner">
            
            {/* LOGO MEJORADO */}
            <div className="hdr-logo-area">
              <Link to="/" className="hdr-logo-link">
                <div className="logo-box">
                  <div className="logo-glow"></div>
                  <img src={logo} alt="RR Biker" className="logo-img" loading="eager" />
                  <div className="logo-ring"></div>
                </div>
              </Link>
            </div>

            {/* NAVEGACIÓN DESKTOP */}
            <nav className={`hdr-nav ${open ? "open" : ""}`}>
              <div className="nav-inner" ref={navListRef}>
                <span
                  className="nav-highlight-bar"
                  style={{
                    width: `${highlightStyle.width}px`,
                    transform: `translateX(${highlightStyle.left}px)`,
                    opacity: highlightStyle.visible ? 1 : 0,
                  }}
                />
                <ul className="nav-list">
                  {navItems.map(({ key, label, to }) => (
                    <li key={key} className="nav-item">
                      <Link
                        to={to}
                        className="nav-link"
                        ref={el => (linkRefs.current[key] = el)}
                        onMouseEnter={() => moveHighlightToKey(key)}
                        onClick={() => {
                          moveHighlightToKey(key);
                          setOpen(false);
                        }}
                      >
                        <span className="nav-num">0{navItems.indexOf(navItems.find(n => n.key === key)) + 1}</span>
                        <span className="nav-label">{label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* ACCIONES */}
            <div className="hdr-actions">
              
              {/* BUSCADOR */}
              <div className="hdr-search">
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  onKeyDown={handleSearchKey}
                  className="search-input"
                  placeholder="BUSCAR REPUESTOS..."
                />
                <button className="search-btn" aria-label="Buscar">
                  <FaSearch />
                </button>
                
                {filtered.length > 0 && (
                  <ul className="search-dropdown">
                    {filtered.map((s, idx) => (
                      <li
                        key={s}
                        className={`search-item ${idx === activeIndex ? "active" : ""}`}
                        onMouseDown={ev => {
                          ev.preventDefault();
                          setSearchQuery(s);
                          setFiltered([]);
                        }}
                      >
                        <span className="item-icon"><FaSearch /></span>
                        <span className="item-text">{s}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* CARRITO */}
              <button
                className={`hdr-cart ${cartOpen ? "open" : ""}`}
                onClick={e => {
                  e.stopPropagation();
                  setCartOpen(s => !s);
                  setCartPulse(true);
                  setTimeout(() => setCartPulse(false), 900);
                }}
                aria-label="Carrito"
              >
                <div className="cart-icon-wrap">
                  <FaShoppingCart />
                  {cartCount > 0 && (
                    <span className={`cart-count ${cartPulse ? "pulse" : ""}`}>
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="cart-text">CARRITO</span>
              </button>

              {/* MINI CARRITO */}
              {cartOpen && (
                <div className={`mini-cart-panel ${cartCount === 0 ? "empty" : ""}`}>
                  {cartCount === 0 ? (
                    <div className="cart-empty-state">
                      <div className="empty-icon"><FaShoppingCart /></div>
                      <h4>TU CARRITO ESTÁ VACÍO</h4>
                      <p>Explora nuestros productos premium</p>
                      <Link to="/productos" className="btn-cart-action" onClick={() => setCartOpen(false)}>
                        VER CATÁLOGO
                      </Link>
                    </div>
                  ) : (
                    <div className="cart-content">
                      <div className="cart-header">
                        <span className="cart-title">TU CARRITO</span>
                        <span className="cart-items-count">{cartCount} ITEMS</span>
                      </div>
                      <Link to="/carrito" className="btn-cart-action primary" onClick={() => setCartOpen(false)}>
                        VER CARRITO COMPLETO <FaArrowRight />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* HAMBURGUESA */}
              <button
                className={`hdr-hamburger ${open ? "active" : ""}`}
                onClick={() => setOpen(!open)}
                aria-label="Menú"
              >
                <span className="h-line"></span>
                <span className="h-line"></span>
                <span className="h-line"></span>
              </button>
            </div>
          </div>
        </div>

        {/* LÍNEA DECORATIVA */}
        <div className="hdr-deco-line">
          <div className="deco-progress"></div>
        </div>
      </header>

      {open && <div className="hdr-overlay" onClick={() => setOpen(false)}></div>}
    </>
  );
};

export default HeaderBar;