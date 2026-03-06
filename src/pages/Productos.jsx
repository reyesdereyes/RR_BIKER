import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // AGREGADO para navegación
import supabase from '../conf/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaMotorcycle, FaExclamationTriangle, FaArrowRight, FaShoppingCart } from 'react-icons/fa';
import '../css/producto.css';

const Productos = () => {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  
  const navigate = useNavigate(); // AGREGADO para navegación

  // Suscripción realtime
  useEffect(() => {
    const subscription = supabase
      .channel('productos_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'productos' },
        (payload) => {
          console.log('Cambio detectado:', payload);
          loadProductos(activeCategory);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [activeCategory]);

  // Cargar categorías
  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      // MODIFICADO: Usar tu tabla simple de categorias
      const { data: categoriasData, error: catError } = await supabase
        .from('categorias')
        .select('*')
        .eq('activa', true)
        .order('orden');

      if (catError) throw catError;

      // Contar productos por categoría
      const { data: allProductos, error: prodError } = await supabase
        .from('productos')
        .select('categoria_id')
        .eq('activo', true);

      if (prodError) throw prodError;

      // Contar productos por cada categoría
      const conteos = {};
      allProductos.forEach(prod => {
        conteos[prod.categoria_id] = (conteos[prod.categoria_id] || 0) + 1;
      });

      const totalProductos = allProductos.length;

      const categoriasFormateadas = [
        { 
          id: 'todos', 
          nombre: 'TODOS', 
          icono: <FaMotorcycle />, 
          slug: 'todos', 
          count: totalProductos,
          imagen: null
        },
        ...categoriasData.map(cat => ({
          id: cat.id, // MODIFICADO: usar id numérico
          nombre: cat.nombre.toUpperCase(),
          icono: <FaMotorcycle />,
          slug: cat.slug,
          count: conteos[cat.id] || 0,
          imagen: cat.imagen // AGREGADO: imagen de categoría
        }))
      ];

      setCategorias(categoriasFormateadas);
      setTotalCount(totalProductos);
    } catch (err) {
      console.error('Error cargando categorías:', err);
      setError('Error al cargar categorías: ' + err.message);
    }
  };

  // Cargar productos - MODIFICADO para tabla simple
  const loadProductos = async (categoriaId) => {
    setLoading(true);
    setError(null);

    try {
      // MODIFICADO: Query simplificado para tu estructura de tablas
      let query = supabase
        .from('productos')
        .select(`
          *,
          categorias(nombre, slug, imagen)
        `)
        .eq('activo', true)
        .order('created_at', { ascending: false });

      // Filtrar por categoría si no es 'todos'
      if (categoriaId !== 'todos') {
        query = query.eq('categoria_id', categoriaId); // MODIFICADO: filtrar por ID numérico
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log('Productos cargados:', data);

      const productosFormateados = data.map(prod => {
        return {
          id: prod.id,
          nombre: prod.nombre,
          descripcion: prod.descripcion, // AGREGADO
          categoria: prod.categorias?.slug,
          categoriaNombre: prod.categorias?.nombre,
          categoriaId: prod.categoria_id, // AGREGADO para navegación
          precio: parseFloat(prod.precio) || 0,
          // MODIFICADO: usar imagen directa de la tabla
          imagenUrl: prod.imagen || null,
          stock: prod.stock || 0,
          sku: prod.sku || null,
          slug: prod.id.toString() // AGREGADO para URL amigable
        };
      });

      setProductos(productosFormateados);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('Error al cargar productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos cuando cambia categoría
  useEffect(() => {
    if (categorias.length > 0) {
      loadProductos(activeCategory);
    }
  }, [activeCategory, categorias]);

  // MODIFICADO: Navegar a página de categoría en lugar de filtrar local
  const handleCategoryChange = (categoryId) => {
    if (categoryId === 'todos') {
      setActiveCategory('todos');
      loadProductos('todos');
    } else {
      // Navegar a página de categoría específica
      const categoria = categorias.find(c => c.id === categoryId);
      if (categoria) {
        navigate(`/productos-categoria/${categoria.slug}`);
      }
    }
  };

  // AGREGADO: Función para ver detalle de producto
  const handleProductClick = (producto) => {
    navigate(`/producto/${producto.slug || producto.id}`);
  };

  // AGREGADO: Función para agregar al carrito (sin navegar)
  const handleAddToCart = (e, producto) => {
    e.stopPropagation(); // Evitar que se abra el producto
    // Aquí tu lógica de carrito
    console.log('Agregado al carrito:', producto);
  };

  const renderStars = (rating) => {
    // Simplificado ya que no tienes rating en tu tabla
    return '★★★★★';
  };

  if (error) {
    return (
      <>
        <Header />
        <div className="error-container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2><FaExclamationTriangle /> {error}</h2>
          <button 
            onClick={() => {
              loadCategorias();
              loadProductos(activeCategory);
            }} 
            className="btn-retry"
            style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
          >
            Reintentar
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      {/* HERO */}
      <section className="prod-hero">
        <div className="prod-hero-bg">
          <div className="grid-overlay"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="container prod-hero-content">
          <div className="hero-badge"><FaMotorcycle /> CATÁLOGO PREMIUM</div>
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
              <span className="h-num">{totalCount}+</span>
              <span className="h-label">PRODUCTOS</span>
            </div>
            <div className="h-stat">
              <span className="h-num">{categorias.length - 1}+</span>
              <span className="h-label">CATEGORÍAS</span>
            </div>
            <div className="h-stat">
              <span className="h-num">24H</span>
              <span className="h-label">ENVÍO</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
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
                onClick={() => handleCategoryChange(cat.id)}
                disabled={loading}
              >
                <div className="cat-icon-box">
                  {/* MODIFICADO: Mostrar imagen de categoría si existe */}
                  {cat.imagen ? (
                    <img 
                      src={cat.imagen} 
                      alt={cat.nombre}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                    />
                  ) : (
                    <span className="cat-emoji">{cat.icono}</span>
                  )}
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

      {/* PRODUCTOS */}
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
              <span className="results-count">
                {loading ? 'Cargando...' : `${productos.length} resultados`}
              </span>
              <select className="sort-select" disabled={loading}>
                <option>ORDENAR POR</option>
                <option>Precio: Menor a Mayor</option>
                <option>Precio: Mayor a Menor</option>
                <option>Más recientes</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {productos.map((prod, idx) => (
                <div 
                  key={prod.id} 
                  className={`product-card ${hoveredProduct === prod.id ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredProduct(prod.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  onClick={() => handleProductClick(prod)} // AGREGADO: click para ver detalle
                >
                  {/* REMOVIDO: badge ya que no está en tu tabla */}

                  <div className="prod-image">
                    <div className="image-frame">
                      {prod.imagenUrl ? (
                        <img 
                          src={prod.imagenUrl} 
                          alt={prod.nombre}
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-moto.jpg';
                          }}
                        />
                      ) : (
                        <span className="prod-emoji" style={{ fontSize: '4rem' }}>
                          <FaMotorcycle />
                        </span>
                      )}
                      <div className="image-overlay">
                        <button className="quick-view">VER DETALLE</button>
                      </div>
                    </div>
                    <div className="stock-indicator">
                      <span className={`stock-dot ${prod.stock < 10 ? 'low' : ''}`}></span>
                      {prod.stock < 10 ? `¡SOLO ${prod.stock}!` : 'EN STOCK'}
                    </div>
                  </div>

                  <div className="prod-info">
                    <div className="prod-rating">
                      <span className="stars">{renderStars()}</span>
                      {/* Simplificado sin rating numérico */}
                    </div>
                    
                    {/* AGREGADO: SKU si existe */}
                    {prod.sku && (
                      <span className="prod-brand">SKU: {prod.sku}</span>
                    )}
                    
                    <h4 className="prod-name">{prod.nombre}</h4>
                    
                    {/* AGREGADO: Descripción corta */}
                    {prod.descripcion && (
                      <p style={{ 
                        color: 'rgba(255,255,255,0.6)', 
                        fontSize: '0.85rem', 
                        marginBottom: '10px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {prod.descripcion}
                      </p>
                    )}
                    
                    <div className="prod-specs">
                      {/* Simplificado sin specs */}
                      <span className="spec-tag">{prod.categoriaNombre}</span>
                    </div>

                    <div className="prod-footer">
                      <div className="price-block">
                        <span className="price-current">${prod.precio}</span>
                      </div>
                      {/* MODIFICADO: Agregar al carrito sin navegar */}
                      <button 
                        className="btn-add-cart"
                        onClick={(e) => handleAddToCart(e, prod)}
                      >
                        <span className="cart-icon"><FaShoppingCart /></span>
                        <span className="add-text">AGREGAR</span>
                      </button>
                    </div>
                  </div>

                  <div className="card-shine"></div>
                  <div className="card-border"></div>
                </div>
              ))}
            </div>
          )}

          {!loading && productos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p>No se encontraron productos en esta categoría.</p>
            </div>
          )}

          {!loading && productos.length > 0 && (
            <div className="pagination">
              <button className="page-btn prev">← ANTERIOR</button>
              <div className="page-numbers">
                <span className="page-num active">1</span>
                <span className="page-num">2</span>
                <span className="page-num">3</span>
                <span className="page-dots">...</span>
              </div>
              <button className="page-btn next">SIGUIENTE <FaArrowRight /></button>
            </div>
          )}
        </div>
      </section>

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