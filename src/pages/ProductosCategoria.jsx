import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../conf/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaMotorcycle, FaExclamationTriangle, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import '../css/producto.css';

const ProductosCategoria = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarCategoriaYProductos();
  }, [slug]);

  const cargarCategoriaYProductos = async () => {
    try {
      setLoading(true);
      
      // Obtener info de la categoría
      const { data: catData, error: catError } = await supabase
        .from('categorias')
        .select('*')
        .eq('slug', slug)
        .single();

      if (catError) throw catError;
      setCategoria(catData);

      // Obtener productos de esa categoría
      const { data: prodData, error: prodError } = await supabase
        .from('productos')
        .select('*')
        .eq('categoria_id', catData.id)
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (prodError) throw prodError;
      setProductos(prodData || []);
      
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (producto) => {
    navigate(`/producto/${producto.id}`);
  };

  if (error) {
    return (
      <>
        <Header />
        <div className="error-container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2><FaExclamationTriangle /> {error}</h2>
          <button onClick={() => navigate('/productos')} className="btn-retry">
            Volver a Productos
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      {/* Hero de Categoría */}
      <section className="prod-hero" style={{ minHeight: '40vh' }}>
        <div className="prod-hero-bg">
          <div className="grid-overlay"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="container prod-hero-content">
          <button 
            onClick={() => navigate('/productos')}
            style={{
              background: 'transparent',
              border: '1px solid #F60C14',
              color: '#F60C14',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <FaArrowLeft /> Volver al Catálogo
          </button>
          
          <h1 className="prod-hero-title">
            <span className="title-red">{categoria?.nombre?.toUpperCase()}</span>
          </h1>
          <p className="prod-hero-sub">
            {categoria?.descripcion || `Todos los productos de ${categoria?.nombre}`}
          </p>
          <div className="hero-stats">
            <div className="h-stat">
              <span className="h-num">{productos.length}</span>
              <span className="h-label">PRODUCTOS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Productos de la Categoría */}
      <section className="products-showcase">
        <div className="container">
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
                  className="product-card"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  onClick={() => handleProductClick(prod)}
                >
                  <div className="prod-image">
                    <div className="image-frame">
                      {prod.imagen ? (
                        <img 
                          src={prod.imagen} 
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
                    <h4 className="prod-name">{prod.nombre}</h4>
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
                    
                    <div className="prod-footer">
                      <div className="price-block">
                        <span className="price-current">${prod.precio}</span>
                      </div>
                      <button 
                        className="btn-add-cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Agregado:', prod);
                        }}
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
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#fff' }}>
              <p>No hay productos en esta categoría.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ProductosCategoria;