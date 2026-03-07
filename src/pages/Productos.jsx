import React, { useState, useEffect, useRef } from 'react';
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
  FaCheck
} from 'react-icons/fa';
import '../css/producto.css';

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
  
  // Estado para mostrar feedback cuando se agrega al carrito
  const [addedProduct, setAddedProduct] = useState(null);
  
  const categoryScrollRef = useRef(null);
  const navigate = useNavigate();

  // Cargar datos iniciales
  useEffect(() => {
    loadCategorias();
  }, []);

  // Cargar productos cuando cambia categoría o búsqueda
  useEffect(() => {
    if (categorias.length > 0) {
      loadProductos(activeCategory, searchTerm);
    }
  }, [activeCategory, searchTerm]);

  // Scroll categorías
  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Cargar categorías
  const loadCategorias = async () => {
    try {
      const { data: categoriasData, error: catError } = await supabase
        .from('productos_categorias')
        .select('categoria');

      if (catError) throw catError;

      const conteos = {};
      const categoriasUnicas = [...new Set(categoriasData.map(item => item.categoria))];
      
      for (const cat of categoriasUnicas) {
        const { count } = await supabase
          .from('productos_categorias')
          .select('*', { count: 'exact', head: true })
          .eq('categoria', cat);
        conteos[cat] = count || 0;
      }

      const { count: totalProductos } = await supabase
        .from('productos')
        .select('*', { count: 'exact', head: true });

      const categoriasFormateadas = [
        { 
          id: 'todos', 
          nombre: 'TODOS', 
          slug: 'todos', 
          count: totalProductos || 0,
          icono: <FaBox />
        },
        ...categoriasUnicas.map((cat) => ({
          id: cat,
          nombre: cat.toUpperCase(),
          slug: cat.toLowerCase().replace(/\s+/g, '-'),
          count: conteos[cat] || 0,
          icono: <FaMotorcycle />
        }))
      ];

      setCategorias(categoriasFormateadas);
      setTotalCount(totalProductos || 0);
      loadProductos('todos');
    } catch (err) {
      console.error('Error cargando categorías:', err);
      setError('Error al cargar categorías: ' + err.message);
    }
  };

  // Cargar productos - CORREGIDO PARA ELIMINAR DUPLICADOS
  const loadProductos = async (categoria, busqueda = '') => {
    setLoading(true);
    setLoadingCategory(true);

    try {
      let productosFormateados = [];

      if (categoria === 'todos') {
        const { data: prodCatData } = await supabase
          .from('productos_categorias')
          .select('codigo, nombre, categoria');

        // ELIMINAR DUPLICADOS POR CÓDIGO - mantener solo el primero
        const uniqueProducts = [];
        const seenCodes = new Set();
        
        for (const prod of prodCatData || []) {
          if (!seenCodes.has(prod.codigo)) {
            seenCodes.add(prod.codigo);
            uniqueProducts.push(prod);
          }
        }

        const codigos = uniqueProducts.map(p => p.codigo);
        
        const { data: preciosData } = await supabase
          .from('productos')
          .select('codigo, precio_venta_bs, cantidad')
          .in('codigo', codigos);

        productosFormateados = uniqueProducts.map(prod => {
          const precioInfo = preciosData?.find(p => p.codigo === prod.codigo);
          return {
            id: prod.codigo,
            nombre: prod.nombre || prod.codigo,
            categoria: prod.categoria,
            precio_bs: parseFloat(precioInfo?.precio_venta_bs) || 0,
            cantidad: precioInfo?.cantidad || 0,
            disponible: (precioInfo?.cantidad || 0) > 0
          };
        });

        if (busqueda) {
          productosFormateados = productosFormateados.filter(p => 
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.categoria.toLowerCase().includes(busqueda.toLowerCase())
          );
        }

      } else {
        const { data: prodCatData } = await supabase
          .from('productos_categorias')
          .select('codigo, nombre, categoria')
          .eq('categoria', categoria);

        // ELIMINAR DUPLICADOS POR CÓDIGO - mantener solo el primero
        const uniqueProducts = [];
        const seenCodes = new Set();
        
        for (const prod of prodCatData || []) {
          if (!seenCodes.has(prod.codigo)) {
            seenCodes.add(prod.codigo);
            uniqueProducts.push(prod);
          }
        }

        if (uniqueProducts.length === 0) {
          setProductos([]);
          setLoading(false);
          setLoadingCategory(false);
          return;
        }

        const codigos = uniqueProducts.map(p => p.codigo);
        
        const { data: preciosData } = await supabase
          .from('productos')
          .select('codigo, precio_venta_bs, cantidad')
          .in('codigo', codigos);

        productosFormateados = uniqueProducts.map(prod => {
          const precioInfo = preciosData?.find(p => p.codigo === prod.codigo);
          return {
            id: prod.codigo,
            nombre: prod.nombre || prod.codigo,
            categoria: prod.categoria,
            precio_bs: parseFloat(precioInfo?.precio_venta_bs) || 0,
            cantidad: precioInfo?.cantidad || 0,
            disponible: (precioInfo?.cantidad || 0) > 0
          };
        });

        if (busqueda) {
          productosFormateados = productosFormateados.filter(p => 
            p.nombre.toLowerCase().includes(busqueda.toLowerCase())
          );
        }
      }

      setProductos(productosFormateados);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('Error al cargar productos: ' + err.message);
    } finally {
      setLoading(false);
      setLoadingCategory(false);
    }
  };

  const handleCategoryChange = (categoriaId) => {
    if (categoriaId === activeCategory) return;
    setActiveCategory(categoriaId);
    setSearchTerm('');
  };

  // Función mejorada para agregar al carrito
  const handleAddToCart = (e, producto) => {
    e.stopPropagation();
    
    if (!producto.disponible) return;

    // Obtener carrito actual del localStorage
    const savedCart = localStorage.getItem('rrbikerCart');
    let currentCart = savedCart ? JSON.parse(savedCart) : [];

    // Buscar si el producto ya existe en el carrito
    const existingItemIndex = currentCart.findIndex(item => item.id === producto.id);

    if (existingItemIndex >= 0) {
      // Si existe, aumentar cantidad
      currentCart[existingItemIndex].quantity += 1;
    } else {
      // Si no existe, agregar nuevo item
      currentCart.push({
        id: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio_bs: producto.precio_bs,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
    }

    // Guardar en localStorage
    localStorage.setItem('rrbikerCart', JSON.stringify(currentCart));

    // Disparar evento personalizado para notificar al Header
    window.dispatchEvent(new Event('rrbikerCartUpdated'));

    // Mostrar feedback visual
    setAddedProduct(producto.id);
    setTimeout(() => setAddedProduct(null), 1500);

    console.log('Agregado al carrito:', producto);
  };

  const formatBs = (valor) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2
    }).format(valor || 0);
  };

  if (error) {
    return (
      <>
        <Header />
        <div className="error-container">
          <h2><FaExclamationTriangle /> {error}</h2>
          <button 
            onClick={() => {
              loadCategorias();
              loadProductos(activeCategory);
            }} 
            className="btn-retry"
          >
            Reintentar
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const categoriaActivaNombre = activeCategory === 'todos' 
    ? 'TODOS LOS PRODUCTOS' 
    : activeCategory.toUpperCase();

  return (
    <>
      <Header />
      
      {/* HERO COMPACTO */}
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

      {/* CATEGORÍAS - HORIZONTAL SCROLL */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-header">
            <span className="cat-label">CATEGORÍAS</span>
            <div className="scroll-hint">
              <FaArrowRight /> Desliza para ver más
            </div>
          </div>
          
          <div className="categories-scroll-container">
            <button 
              className="scroll-btn left"
              onClick={() => scrollCategories('left')}
            >
              <FaChevronLeft />
            </button>
            
            <div className="categories-track" ref={categoryScrollRef}>
              {categorias.map((cat, index) => (
                <button
                  key={cat.id}
                  className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                  disabled={loadingCategory}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="cat-icon">
                    {cat.icono}
                  </div>
                  <div className="cat-details">
                    <span className="cat-name">{cat.nombre}</span>
                    <span className="cat-count">{cat.count} productos</span>
                  </div>
                  {activeCategory === cat.id && (
                    <div className="active-indicator"></div>
                  )}
                </button>
              ))}
            </div>
            
            <button 
              className="scroll-btn right"
              onClick={() => scrollCategories('right')}
            >
              <FaChevronRight />
            </button>
          </div>

          {/* LOADING BAR */}
          {loadingCategory && (
            <div className="loading-bar-container">
              <div className="loading-bar">
                <div className="loading-progress"></div>
              </div>
              <span className="loading-text">
                <FaSpinner className="spin" /> Cargando {categoriaActivaNombre}...
              </span>
            </div>
          )}
        </div>
      </section>

      {/* BÚSQUEDA */}
      <section className="search-section">
        <div className="container">
          <div className="search-wrapper">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder={`Buscar en ${categoriaActivaNombre.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                disabled={loadingCategory}
              />
              {searchTerm && !loadingCategory && (
                <button 
                  className="clear-search" 
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </button>
              )}
            </div>
            <div className="results-badge">
              {productos.length} productos
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS - MÁS CARDS POR FILA */}
      <section className="products-section">
        <div className="container">
          {loading ? (
            <div className="products-grid-compact">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="skeleton-card-compact" />
              ))}
            </div>
          ) : (
            <div className="products-grid-compact">
              {productos.map((prod, idx) => (
                <div 
                  key={`${prod.id}-${idx}`}  // KEY ÚNICA USANDO ÍNDICE COMO RESPALDO
                  className={`product-card-compact ${hoveredProduct === prod.id ? 'hovered' : ''} ${!prod.disponible ? 'out-of-stock' : ''} ${addedProduct === prod.id ? 'added-to-cart' : ''}`}
                  onMouseEnter={() => setHoveredProduct(prod.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  <div className="card-header">
                    <span className="category-tag">{prod.categoria}</span>
                    {!prod.disponible && <span className="stock-tag">AGOTADO</span>}
                    {addedProduct === prod.id && (
                      <span className="added-tag"><FaCheck /> AGREGADO</span>
                    )}
                  </div>
                  
                  <div className="card-image">
                    <FaMotorcycle />
                  </div>
                  
                  <div className="card-content">
                    <h4 className="product-title" title={prod.nombre}>
                      {prod.nombre}
                    </h4>
                    
                    <div className="price-tag">
                      {formatBs(prod.precio_bs)}
                    </div>
                    
                    <button 
                      className={`btn-buy ${addedProduct === prod.id ? 'success' : ''}`}
                      onClick={(e) => handleAddToCart(e, prod)}
                      disabled={!prod.disponible}
                    >
                      {addedProduct === prod.id ? (
                        <><FaCheck /> AGREGADO</>
                      ) : (
                        <><FaShoppingCart /> {prod.disponible ? 'AGREGAR' : 'SIN STOCK'}</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && productos.length === 0 && (
            <div className="empty-state-compact">
              <FaSearch className="empty-icon" />
              <p>No se encontraron productos</p>
              <div className="empty-actions">
                {searchTerm && (
                  <button className="btn-action" onClick={() => setSearchTerm('')}>
                    Limpiar búsqueda
                  </button>
                )}
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