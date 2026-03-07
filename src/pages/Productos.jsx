import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../conf/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  FaMotorcycle, 
  FaExclamationTriangle, 
  FaShoppingCart,
  FaSearch,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaBox,
  FaArrowRight,
  FaCheck,
  FaDollarSign
} from 'react-icons/fa';
import '../css/producto.css';

const PRODUCTOS_POR_PAGINA = 12;

const Productos = () => {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingCategory, setLoadingCategory] = useState(false);
  
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  
  const [addedProduct, setAddedProduct] = useState(null);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [tasaDolar, setTasaDolar] = useState(null);
  const [loadingTasa, setLoadingTasa] = useState(true);
  
  const categoryScrollRef = useRef(null);
  const observerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasaDolar();
    const interval = setInterval(fetchTasaDolar, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasaDolar = async () => {
    try {
      setLoadingTasa(true);
      const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setTasaDolar(data);
      console.log('Tasa del dólar:', data);
    } catch (err) {
      console.error('Error tasa:', err);
    } finally {
      setLoadingTasa(false);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  useEffect(() => {
    setPage(1);
    setProductos([]);
    setHasMore(true);
    if (categorias.length > 0) {
      loadProductos(activeCategory, searchTerm, 1, true);
    }
  }, [activeCategory, searchTerm, categorias]);

  const lastProductRef = useCallback((node) => {
    if (loadingMore || loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore, loading]);

  useEffect(() => {
    if (page > 1 && hasMore) {
      loadProductos(activeCategory, searchTerm, page, false);
    }
  }, [page]);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const loadCategorias = async () => {
    try {
      const { data: categoriasData, error } = await supabase
        .from('productos_categorias')
        .select('categoria')
        .not('categoria', 'is', null)
        .order('categoria');

      if (error) throw error;

      if (!categoriasData?.length) {
        setCategorias([{ id: 'todos', nombre: 'TODOS', slug: 'todos', count: 0, icono: <FaBox /> }]);
        setTotalCount(0);
        return;
      }

      const categoriasUnicas = [...new Set(categoriasData.map(item => item.categoria))];
      
      const conteos = await Promise.all(
        categoriasUnicas.map(async (cat) => {
          const { count } = await supabase
            .from('productos_categorias')
            .select('codigo', { count: 'exact', head: true })
            .eq('categoria', cat);
          return [cat, count || 0];
        })
      );
      const conteosObj = Object.fromEntries(conteos);

      const { count: total } = await supabase
        .from('productos')
        .select('*', { count: 'exact', head: true });

      const categoriasFormateadas = [
        { id: 'todos', nombre: 'TODOS', slug: 'todos', count: total || 0, icono: <FaBox /> },
        ...categoriasUnicas.map(cat => ({
          id: cat,
          nombre: cat.toUpperCase(),
          slug: cat.toLowerCase().replace(/\s+/g, '-'),
          count: conteosObj[cat] || 0,
          icono: <FaMotorcycle />
        }))
      ];

      setCategorias(categoriasFormateadas);
      setTotalCount(total || 0);
    } catch (err) {
      console.error('Error categorías:', err);
      setCategorias([{ id: 'todos', nombre: 'TODOS', count: 0, icono: <FaBox /> }]);
    }
  };

  // ============================================
  // VUELTA A 2 QUERIES - FUNCIONA COMO ORIGINAL PERO OPTIMIZADO
  // ============================================
  const loadProductos = async (categoria, busqueda = '', pageNum = 1, reset = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    setLoadingCategory(true);

    try {
      const from = (pageNum - 1) * PRODUCTOS_POR_PAGINA;
      const to = from + PRODUCTOS_POR_PAGINA - 1;

      // PASO 1: Obtener códigos y datos básicos de productos_categorias
      let query = supabase
        .from('productos_categorias')
        .select('codigo, nombre, categoria')
        .order('nombre', { ascending: true })
        .range(from, to);

      if (categoria !== 'todos') {
        query = query.eq('categoria', categoria);
      }
      if (busqueda) {
        query = query.or(`nombre.ilike.%${busqueda}%,codigo.ilike.%${busqueda}%`);
      }

      const { data: catData, error: catError, count } = await query;
      if (catError) throw catError;

      console.log('Paso 1 - Cat data:', catData);

      // Unique por código
      const uniqueMap = new Map();
      catData?.forEach(item => {
        if (!uniqueMap.has(item.codigo)) uniqueMap.set(item.codigo, item);
      });
      const uniqueCatProducts = Array.from(uniqueMap.values());

      if (!uniqueCatProducts.length) {
        setHasMore(false);
        if (reset) setProductos([]);
        throw new Error('No hay productos');
      }

      const codigos = uniqueCatProducts.map(p => p.codigo);
      console.log('Códigos únicos:', codigos);

      // PASO 2: Obtener precios DESDE productos usando IN
      const { data: preciosData, error: preciosError } = await supabase
        .from('productos')
        .select('codigo, precio_venta, cantidad')
        .in('codigo', codigos);

      if (preciosError) {
        console.warn('No precios encontrados:', preciosError);
        // Continuar sin precios (usar 0)
      }

      console.log('Paso 2 - Precios data:', preciosData);

      // Combinar datos
      const productosFinales = uniqueCatProducts.map(catProd => {
        const precioMatch = preciosData?.find(p => p.codigo === catProd.codigo);
        
        return {
          id: catProd.codigo,
          nombre: catProd.nombre || catProd.codigo,
          categoria: catProd.categoria,
          precio_usd: parseFloat(precioMatch?.precio_venta) || 0,
          cantidad: parseInt(precioMatch?.cantidad) || 0,
          disponible: (parseInt(precioMatch?.cantidad) || 0) > 0,
          codigo: catProd.codigo
        };
      });

      console.log('Productos finales:', productosFinales);

      if (reset) {
        setProductos(productosFinales);
      } else {
        setProductos(prev => [...prev, ...productosFinales]);
      }

      setHasMore((count || 0) > pageNum * PRODUCTOS_POR_PAGINA);
      
    } catch (err) {
      console.error('Error loadProductos:', err);
      setError(`Error: ${err.message}`);
      if (reset) setProductos([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setLoadingCategory(false);
    }
  };

  const handleCategoryChange = (catId) => {
    if (catId === activeCategory) return;
    setActiveCategory(catId);
    setSearchTerm('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (e, prod) => {
    e.stopPropagation();
    if (!prod.disponible) return;

    let cart = JSON.parse(localStorage.getItem('rrbikerCart') || '[]');
    const idx = cart.findIndex(item => item.id === prod.id);
    const tasa = tasaDolar?.precio_venta || tasaDolar?.promedio || 36.50;
    const precioBs = prod.precio_usd * tasa;

    if (idx >= 0) {
      cart[idx].quantity += 1;
    } else {
      cart.push({
        id: prod.id, nombre: prod.nombre, categoria: prod.categoria,
        precio_usd: prod.precio_usd, precio_bs: precioBs, tasa_usada: tasa,
        quantity: 1, addedAt: new Date().toISOString()
      });
    }

    localStorage.setItem('rrbikerCart', JSON.stringify(cart));
    window.dispatchEvent(new Event('rrbikerCartUpdated'));
    setAddedProduct(prod.id);
    setTimeout(() => setAddedProduct(null), 1500);
  };

  const formatPrecioBs = (usd) => {
    if (!usd || usd === 0) return 'Bs. 0,00';
    if (loadingTasa) return 'Cargando...';
    const tasa = tasaDolar?.precio_venta || tasaDolar?.promedio || 36.50;
    return new Intl.NumberFormat('es-VE', { 
      style: 'currency', currency: 'VES', minimumFractionDigits: 2 
    }).format(usd * tasa);
  };

  const formatUsd = (val) => {
    if (!val || val === 0) return '$ 0.00';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', currency: 'USD', minimumFractionDigits: 2 
    }).format(val);
  };

  if (error) {
    return (
      <>
        <Header />
        <div className="error-container">
          <h2><FaExclamationTriangle /> {error}</h2>
          <button className="btn-retry" onClick={() => {
            setError(null); loadCategorias(); loadProductos(activeCategory, '', 1, true);
          }}>
            Reintentar
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const catName = activeCategory === 'todos' ? 'TODOS LOS PRODUCTOS' : activeCategory.toUpperCase();

  return (
    <>
      <Header />
      <br /><br /><br />
      
      <section className="prod-hero">
        <div className="prod-hero-bg">
          <div className="grid-overlay"></div><div className="hero-glow"></div>
        </div>
        <div className="container prod-hero-content">
          <div className="hero-badge"><FaMotorcycle /> CATÁLOGO PREMIUM</div>
          <h1 className="prod-hero-title">
            <span className="title-dark">REPUESTOS &</span>
            <span className="title-red">ACCESORIOS</span>
          </h1>
          <p className="prod-hero-sub">Equipamiento profesional para motos. Marcas originales con garantía.</p>
          
          <div className="tasa-dolar-badge">
            <FaDollarSign />
            {loadingTasa ? 'Cargando...' : (
              <>
                <span>BCV: Bs. {tasaDolar?.promedio?.toFixed(2) || 'N/A'}</span>
                <span className="tasa-fecha">
                  {tasaDolar?.fechaActualizacion ? new Date(tasaDolar.fechaActualizacion).toLocaleTimeString('es-VE') : 'N/A'}
                </span>
              </>
            )}
          </div>
          
          <div className="hero-stats">
            <div className="h-stat"><span className="h-num">{totalCount.toLocaleString()}+</span><span className="h-label">PRODUCTOS</span></div>
            <div className="h-stat"><span className="h-num">{categorias.length - 1}+</span><span className="h-label">CATEGORÍAS</span></div>
            <div className="h-stat"><span className="h-num">24H</span><span className="h-label">ENVÍO</span></div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <div className="categories-header">
            <span className="cat-label">CATEGORÍAS</span>
            <div className="scroll-hint"><FaArrowRight /> Desliza →</div>
          </div>
          
          <div className="categories-scroll-container">
            <button className="scroll-btn left" onClick={() => scrollCategories('left')}><FaChevronLeft /></button>
            <div className="categories-track" ref={categoryScrollRef}>
              {categorias.map((cat, i) => (
                <button
                  key={cat.id}
                  className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                  disabled={loadingCategory}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="cat-icon">{cat.icono}</div>
                  <div className="cat-details">
                    <span className="cat-name">{cat.nombre}</span>
                    <span className="cat-count">{cat.count.toLocaleString()} productos</span>
                  </div>
                  {activeCategory === cat.id && <div className="active-indicator"></div>}
                </button>
              ))}
            </div>
            <button className="scroll-btn right" onClick={() => scrollCategories('right')}><FaChevronRight /></button>
          </div>

          {loadingCategory && page === 1 && (
            <div className="loading-bar-container">
              <div className="loading-bar"><div className="loading-progress"></div></div>
              <span className="loading-text"><FaSpinner className="spin" /> Cargando...</span>
            </div>
          )}
        </div>
      </section>

      <section className="search-section">
        <div className="container">
          <div className="search-wrapper">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input 
                placeholder={`Buscar en ${catName.toLowerCase()}...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
                disabled={loadingCategory}
              />
              {searchTerm && <button className="clear-search" onClick={() => setSearchTerm('')}>×</button>}
            </div>
            <div className="results-badge">{productos.length} de {totalCount.toLocaleString()}</div>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          {loading && !productos.length ? (
            <div className="products-grid-compact">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => <div key={i} className="skeleton-card-compact" />)}
            </div>
          ) : (
            <>
              <div className="products-grid-compact">
                {productos.map((prod, idx) => {
                  const isLast = idx === productos.length - 1;
                  return (
                    <div 
                      key={`${prod.id}-${idx}`}
                      ref={isLast ? lastProductRef : null}
                      className={`product-card-compact 
                        ${hoveredProduct === prod.id ? 'hovered' : ''} 
                        ${!prod.disponible ? 'out-of-stock' : ''} 
                        ${addedProduct === prod.id ? 'added-to-cart' : ''}`}
                      onMouseEnter={() => setHoveredProduct(prod.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <div className="card-header">
                        <span className="category-tag">{prod.categoria}</span>
                        {!prod.disponible && <span className="stock-tag">SIN STOCK</span>}
                        {addedProduct === prod.id && <span className="added-tag"><FaCheck /> AGREGADO</span>}
                      </div>
                      <div className="card-image"><FaMotorcycle /></div>
                      <div className="card-content">
                        <h4 className="product-title" title={prod.nombre}>{prod.nombre}</h4>
                        <div className="price-container">
                          <div className="price-bs">{formatPrecioBs(prod.precio_usd)}</div>
                          <div className="price-usd">{formatUsd(prod.precio_usd)} USD</div>
                        </div>
                        <button 
                          className={`btn-buy ${addedProduct === prod.id ? 'success' : ''}`}
                          onClick={e => handleAddToCart(e, prod)}
                          disabled={!prod.disponible || loadingTasa}
                        >
                          {addedProduct === prod.id ? <><FaCheck /> AGREGADO</> : 
                           <><FaShoppingCart /> {prod.disponible ? 'AGREGAR' : 'SIN STOCK'}</>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {loadingMore && (
                <div className="loading-more">
                  <FaSpinner className="spin" /> Cargando más...
                </div>
              )}
              
              {!hasMore && productos.length && (
                <div className="no-more-products">¡Ya viste todos!</div>
              )}
            </>
          )}

          {!loading && !productos.length && (
            <div className="empty-state-compact">
              <FaSearch className="empty-icon" />
              <p>No se encontraron productos</p>
              <div className="empty-actions">
                {searchTerm && <button className="btn-action" onClick={() => setSearchTerm('')}>Limpiar</button>}
                {activeCategory !== 'todos' && (
                  <button className="btn-action secondary" onClick={() => handleCategoryChange('todos')}>
                    Ver todos
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Productos;
