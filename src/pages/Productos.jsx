import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../css/producto.css';

const Productos = () => {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const categorias = [
    { id: 'todos', nombre: 'TODOS', icono: '🏍️', count: 124 },
    { id: 'cascos', nombre: 'CASCOS', icono: '🪖', count: 24 },
    { id: 'accesorios', nombre: 'ACCESORIOS', icono: '🧤', count: 45 },
    { id: 'repuestos', nombre: 'REPUESTOS', icono: '⚙️', count: 38 },
    { id: 'neumaticos', nombre: 'NEUMÁTICOS', icono: '🛞', count: 12 },
    { id: 'lubricantes', nombre: 'LUBRICANTES', icono: '🛢️', count: 15 }
  ];

  const productos = [
    {
      id: 1,
      nombre: "Casco AGV Pista GP RR",
      categoria: "cascos",
      precio: 1200,
      precioAntes: 1450,
      imagen: "🪖",
      badge: "NUEVO",
      rating: 4.9,
      reviews: 128,
      specs: ["Carbono", "Pinlock", "ECE 22.06"],
      stock: 5
    },
    {
      id: 2,
      nombre: "Guantes Alpinestars GP Pro",
      categoria: "accesorios",
      precio: 280,
      precioAntes: null,
      imagen: "🧤",
      badge: "TOP VENTAS",
      rating: 4.8,
      reviews: 89,
      specs: ["Piel kangaroo", "TPU", "Ventilado"],
      stock: 12
    },
    {
      id: 3,
      nombre: "Kit Transmisión DID ZVM-X",
      categoria: "repuestos",
      precio: 320,
      precioAntes: 380,
      imagen: "⛓️",
      badge: "OFERTA",
      rating: 4.9,
      reviews: 256,
      specs: ["X-Ring", "Acero 520", "15/42T"],
      stock: 8
    },
    {
      id: 4,
      nombre: "Neumático Michelin Power 5",
      categoria: "neumaticos",
      precio: 180,
      precioAntes: null,
      imagen: "🛞",
      badge: null,
      rating: 4.7,
      reviews: 67,
      specs: ["120/70 ZR17", "2CT+", "HyperSport"],
      stock: 20
    },
    {
      id: 5,
      nombre: "Aceite Motul 7100 10W40",
      categoria: "lubricantes",
      precio: 45,
      precioAntes: 55,
      imagen: "🛢️",
      badge: "PACK x4",
      rating: 4.8,
      reviews: 412,
      specs: ["100% Sintético", "API SN", "4T"],
      stock: 50
    },
    {
      id: 6,
      nombre: "Casco Shoei X-Spirit 3",
      categoria: "cascos",
      precio: 950,
      precioAntes: null,
      imagen: "🪖",
      badge: "PREMIUM",
      rating: 4.9,
      reviews: 95,
      specs: ["AIM+", "CWF-1", "5 capas"],
      stock: 3
    },
    {
      id: 7,
      nombre: "Chaqueta Dainese Racing 3",
      categoria: "accesorios",
      precio: 650,
      precioAntes: 780,
      imagen: "🧥",
      badge: "OFERTA",
      rating: 4.7,
      reviews: 45,
      specs: ["Tutú cowhide", "Composite", "CE 2"],
      stock: 7
    },
    {
      id: 8,
      nombre: "Batería Yuasa YTZ14S",
      categoria: "repuestos",
      precio: 120,
      precioAntes: null,
      imagen: "🔋",
      badge: null,
      rating: 4.6,
      reviews: 178,
      specs: ["12V 11.2Ah", "AGM", "Sin mantenimiento"],
      stock: 15
    }
  ];

  const productosFiltrados = activeCategory === 'todos' 
    ? productos 
    : productos.filter(p => p.categoria === activeCategory);

  return (
    <>
      <Header />
      
      {/* HERO PRODUCTOS */}
      <section className="prod-hero">
        <div className="prod-hero-bg">
          <div className="grid-overlay"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="container prod-hero-content">
          <div className="hero-badge">🏍️ CATÁLOGO PREMIUM</div>
          <h1 className="prod-hero-title">
            <span className="title-dark">REPUESTOS &</span>
            <span className="title-red">ACCESORIOS</span>
          </h1>
          <p className="prod-hero-sub">
            Equipamiento profesional para motocicletas de alta cilindrada. 
            Marcas originales con garantía oficial.
          </p>
          <div className="hero-stats">
            <div className="h-stat">
              <span className="h-num">500+</span>
              <span className="h-label">PRODUCTOS</span>
            </div>
            <div className="h-stat">
              <span className="h-num">50+</span>
              <span className="h-label">MARCAS</span>
            </div>
            <div className="h-stat">
              <span className="h-num">24H</span>
              <span className="h-label">ENVÍO</span>
            </div>
          </div>
        </div>
        <div className="hero-deco-line"></div>
      </section>

      {/* PANEL DE CATEGORÍAS */}
      <section className="cat-panel">
        <div className="container">
          <div className="cat-header">
            <span className="cat-section-tag">NAVEGACIÓN</span>
            <h2 className="cat-section-title">CATEGORÍAS DESTACADAS</h2>
          </div>
          
          <div className="cat-grid">
            {categorias.map(cat => (
              <button
                key={cat.id}
                className={`cat-card ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <div className="cat-icon-box">
                  <span className="cat-emoji">{cat.icono}</span>
                  <div className="cat-glow"></div>
                </div>
                <div className="cat-info">
                  <span className="cat-name">{cat.nombre}</span>
                  <span className="cat-count">{cat.count} items</span>
                </div>
                {activeCategory === cat.id && <div className="cat-active-bar"></div>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTOS GRID */}
      <section className="products-showcase">
        <div className="container">
          <div className="showcase-header">
            <div className="showcase-title">
              <span className="title-line"></span>
              <h3>
                {activeCategory === 'todos' ? 'TODOS LOS PRODUCTOS' : 
                  categorias.find(c => c.id === activeCategory)?.nombre}
              </h3>
              <span className="title-line"></span>
            </div>
            <div className="showcase-filters">
              <span className="results-count">{productosFiltrados.length} resultados</span>
              <select className="sort-select">
                <option>ORDENAR POR</option>
                <option>Precio: Menor a Mayor</option>
                <option>Precio: Mayor a Menor</option>
                <option>Más Vendidos</option>
                <option>Mejor Valorados</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {productosFiltrados.map((prod, idx) => (
              <div 
                key={prod.id} 
                className={`product-card ${hoveredProduct === prod.id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredProduct(prod.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* BADGE */}
                {prod.badge && (
                  <div className={`prod-badge ${prod.badge.toLowerCase().replace(' ', '-')}`}>
                    {prod.badge}
                  </div>
                )}

                {/* IMAGEN */}
                <div className="prod-image">
                  <div className="image-frame">
                    <span className="prod-emoji">{prod.imagen}</span>
                    <div className="image-overlay">
                      <button className="quick-view">VISTA RÁPIDA</button>
                    </div>
                  </div>
                  <div className="stock-indicator">
                    <span className={`stock-dot ${prod.stock < 10 ? 'low' : ''}`}></span>
                    {prod.stock < 10 ? `¡SOLO ${prod.stock}!` : 'EN STOCK'}
                  </div>
                </div>

                {/* INFO */}
                <div className="prod-info">
                  <div className="prod-rating">
                    <span className="stars">{'★'.repeat(Math.floor(prod.rating))}</span>
                    <span className="rating-num">{prod.rating}</span>
                    <span className="reviews">({prod.reviews})</span>
                  </div>
                  
                  <h4 className="prod-name">{prod.nombre}</h4>
                  
                  <div className="prod-specs">
                    {prod.specs.map((spec, i) => (
                      <span key={i} className="spec-tag">{spec}</span>
                    ))}
                  </div>

                  <div className="prod-footer">
                    <div className="price-block">
                      {prod.precioAntes && (
                        <span className="price-old">${prod.precioAntes}</span>
                      )}
                      <span className="price-current">${prod.precio}</span>
                    </div>
                    <button className="btn-add-cart">
                      <span className="cart-icon">🛒</span>
                      <span className="add-text">AGREGAR</span>
                    </button>
                  </div>
                </div>

                {/* EFECTOS */}
                <div className="card-shine"></div>
                <div className="card-border"></div>
              </div>
            ))}
          </div>

          {/* PAGINACIÓN */}
          <div className="pagination">
            <button className="page-btn prev">← ANTERIOR</button>
            <div className="page-numbers">
              <span className="page-num active">1</span>
              <span className="page-num">2</span>
              <span className="page-num">3</span>
              <span className="page-dots">...</span>
              <span className="page-num">12</span>
            </div>
            <button className="page-btn next">SIGUIENTE →</button>
          </div>
        </div>
      </section>

      {/* NEWSLETTER BAR */}
      <section className="prod-newsletter">
        <div className="container">
          <div className="news-content">
            <div className="news-text">
              <h3>🔔 OFERTAS EXCLUSIVAS</h3>
              <p>Suscríbete y recibe descuentos de hasta 30% en repuestos premium</p>
            </div>
            <form className="news-form">
              <input type="email" placeholder="Tu correo electrónico" />
              <button type="submit">SUSCRIBIRSE</button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Productos;