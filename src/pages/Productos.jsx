import React, { useState, useEffect } from 'react';
import  supabase  from '../conf/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../css/producto.css';

const Productos = () => {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

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
      // Obtener categorías activas
      const { data: categoriasData, error: catError } = await supabase
        .from('categorias')
        .select('*')
        .eq('activa', true)
        .order('orden');

      if (catError) throw catError;

      // Contar productos por categoría
      const { data: productosCount, error: countError } = await supabase
        .from('productos')
        .select('categoria_id', { count: 'exact' })
        .eq('activo', true);

      if (countError) throw countError;

      // Contar productos por cada categoría
      const conteos = {};
      const { data: allProductos, error: prodError } = await supabase
        .from('productos')
        .select('categoria_id')
        .eq('activo', true);

      if (prodError) throw prodError;

      allProductos.forEach(prod => {
        conteos[prod.categoria_id] = (conteos[prod.categoria_id] || 0) + 1;
      });

      const totalProductos = allProductos.length;

      const categoriasFormateadas = [
        { 
          id: 'todos', 
          nombre: 'TODOS', 
          icono: '🏍️', 
          slug: 'todos', 
          count: totalProductos 
        },
        ...categoriasData.map(cat => ({
          id: cat.slug,
          nombre: cat.nombre.toUpperCase(),
          icono: cat.icono || '🏍️',
          slug: cat.slug,
          count: conteos[cat.id] || 0
        }))
      ];

      setCategorias(categoriasFormateadas);
      setTotalCount(totalProductos);
    } catch (err) {
      console.error('Error cargando categorías:', err);
      setError('Error al cargar categorías: ' + err.message);
    }
  };

  // Cargar productos - CORREGIDO para usar tablas reales
  const loadProductos = async (categoriaSlug) => {
    setLoading(true);
    setError(null);

    try {
      // Construir query base con joins a categorías, marcas y stats
      let query = supabase
        .from('productos')
        .select(`
          *,
          categorias!inner(nombre, slug, icono),
          marcas(nombre, logo),
          producto_stats(rating, total_reviews, total_vistas, total_ventas)
        `)
        .eq('activo', true)
        .order('destacado', { ascending: false })
        .order('orden_destacado', { ascending: true });

      // Filtrar por categoría si no es 'todos'
      if (categoriaSlug !== 'todos') {
        query = query.eq('categorias.slug', categoriaSlug);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log('Productos cargados:', data); // Debug

      const productosFormateados = data.map(prod => {
        // Construir URL de imagen si existe
        let imagenUrl = null;
        if (prod.imagen_principal) {
          const { data: urlData } = supabase
            .storage
            .from('productos')
            .getPublicUrl(prod.imagen_principal);
          imagenUrl = urlData?.publicUrl || null;
        }

        return {
          id: prod.id,
          nombre: prod.nombre,
          categoria: prod.categorias?.slug,
          categoriaNombre: prod.categorias?.nombre,
          categoriaIcono: prod.categorias?.icono,
          precio: parseFloat(prod.precio) || 0,
          precioAntes: prod.precio_anterior ? parseFloat(prod.precio_anterior) : null,
          imagen: prod.categorias?.icono || '🏍️',
          imagenReal: prod.imagen_principal,
          imagenUrl: imagenUrl,
          badge: prod.badge,
          rating: parseFloat(prod.producto_stats?.[0]?.rating) || 5.0,
          reviews: prod.producto_stats?.[0]?.total_reviews || 0,
          specs: prod.especificaciones || [],
          stock: prod.stock || 0,
          marca: prod.marcas?.nombre || null,
          marcaLogo: prod.marcas?.logo || null,
          slug: prod.slug,
          destacado: prod.destacado,
          sku: prod.sku
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

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    document.querySelector('.products-showcase')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  // Función para subir imágenes
  const subirImagen = async (file, productoId) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productoId}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase
        .storage
        .from('productos')
        .upload(`imagenes/${fileName}`, file);

      if (error) throw error;
      
      // Actualizar producto con nueva imagen
      await supabase
        .from('productos')
        .update({ imagen_principal: data.path })
        .eq('id', productoId);
        
      return data.path;
    } catch (err) {
      console.error('Error subiendo imagen:', err);
      throw err;
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '½'}
        {'☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
      </>
    );
  };

  if (error) {
    return (
      <>
        <Header />
        <div className="error-container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>😕 {error}</h2>
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
              <span className="h-num">{totalCount}+</span>
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
                <option>Más Vendidos</option>
                <option>Mejor Valorados</option>
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
                >
                  {prod.badge && (
                    <div className={`prod-badge ${prod.badge.toLowerCase().replace(/\s+/g, '-')}`}>
                      {prod.badge}
                    </div>
                  )}

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
                          {prod.categoriaIcono || prod.imagen}
                        </span>
                      )}
                      <div className="image-overlay">
                        <button className="quick-view">VISTA RÁPIDA</button>
                      </div>
                    </div>
                    <div className="stock-indicator">
                      <span className={`stock-dot ${prod.stock < 10 ? 'low' : ''}`}></span>
                      {prod.stock < 10 ? `¡SOLO ${prod.stock}!` : 'EN STOCK'}
                    </div>
                  </div>

                  <div className="prod-info">
                    <div className="prod-rating">
                      <span className="stars">{renderStars(prod.rating)}</span>
                      <span className="rating-num">{prod.rating}</span>
                      <span className="reviews">({prod.reviews})</span>
                    </div>
                    
                    {prod.marca && (
                      <span className="prod-brand">{prod.marca}</span>
                    )}
                    
                    <h4 className="prod-name">{prod.nombre}</h4>
                    
                    <div className="prod-specs">
                      {Array.isArray(prod.specs) && prod.specs.map((spec, i) => (
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
                <span className="page-num">12</span>
              </div>
              <button className="page-btn next">SIGUIENTE →</button>
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