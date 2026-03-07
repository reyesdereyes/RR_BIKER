import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../conf/supabase';
import ProductoModal from '../components/ProductoModal';
import '../css/admin.css';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('pedidos');
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    revenue: 0,
    lowStock: 0,
    totalProducts: 0
  });
  
  // Filtros Pedidos
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filtros Productos
  const [searchProduct, setSearchProduct] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  
  // Modales
  const [editingPedido, setEditingPedido] = useState(null);
  const [editingProducto, setEditingProducto] = useState(null);
  const [isPedidoModalOpen, setIsPedidoModalOpen] = useState(false);
  const [isProductoModalOpen, setIsProductoModalOpen] = useState(false);
  const [isNewProductoModalOpen, setIsNewProductoModalOpen] = useState(false);
  
  // Estado para categorías dinámicas
  const [categorias, setCategorias] = useState([]);
  
  const pedidosPerPage = 10;
  const productosPerPage = 12;
  const navigate = useNavigate();
  
  // Refs para animaciones
  const statsRef = useRef(null);
  const tableRef = useRef(null);

  // Verificar sesión
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);
      await fetchCategorias();
      await fetchData();
    };
    init();
  }, [navigate]);

  // Animación de entrada
  useEffect(() => {
    if (!loading && statsRef.current) {
      animateStats();
    }
  }, [loading]);

  // Animación al cambiar de tab
  useEffect(() => {
    if (tableRef.current) {
      animateTableEntry();
    }
  }, [activeTab]);

  const animateStats = () => {
    const cards = statsRef.current.querySelectorAll('.stat-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px) scale(0.9)';
      setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, index * 100);
    });
  };

  const animateTableEntry = () => {
    const rows = tableRef.current?.querySelectorAll('tbody tr');
    if (rows) {
      rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-30px)';
        setTimeout(() => {
          row.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
          row.style.opacity = '1';
          row.style.transform = 'translateX(0)';
        }, index * 50);
      });
    }
  };

  // Abrir modal de nuevo producto
  const openNuevoProductoModal = () => {
    setEditingProducto({
      codigo: '',
      categoria: '',
      cantidad: 0,
      costo_unitario: 0,
      precio_venta: 0,
      factor_cambio: 36.50,
    });
    setIsNewProductoModalOpen(true);
  };

  // Cargar categorías desde Supabase
  const fetchCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('productos_categorias')
        .select('nombre, codigo')
        .order('nombre');
      
      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error('Error fetching categorías:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const productosData = await fetchProductosData();
      await fetchPedidosData(productosData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPedidosData = async (productosData) => {
    try {
      const { data: pedidosData, error } = await supabase
        .from('pedidos')
        .select(`*, usuarios (nombre, correo, telefono, direccion, ciudad, estado)`)
        .order('fecha', { ascending: false });
      
      if (error) throw error;
      
      const { data: detallesData, error: detallesError } = await supabase
        .from('detalles_pedido')
        .select('*');
      
      if (detallesError) throw detallesError;
      
      const pedidosCompletos = (pedidosData || []).map(pedido => ({
        ...pedido,
        detalles: detallesData?.filter(d => d.pedido_id === pedido.id) || [],
        cliente_nombre: pedido.usuarios?.nombre || 'N/A',
        cliente_email: pedido.usuarios?.correo || 'N/A',
        cliente_telefono: pedido.usuarios?.telefono || 'N/A',
      }));
      
      setPedidos(pedidosCompletos);
      calculateStats(pedidosCompletos, productosData || []);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
    }
  };

  const fetchProductosData = async () => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('codigo', { ascending: true });
      
      if (error) throw error;
      setProductos(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching productos:', error);
      return [];
    }
  };

  const calculateStats = (pedidosData, productosData) => {
    const lowStock = productosData?.filter(p => p.cantidad < 10).length || 0;
    
    setStats({
      total: pedidosData?.length || 0,
      pending: pedidosData?.filter(p => p.estado === 'pendiente').length || 0,
      completed: pedidosData?.filter(p => p.estado === 'completado').length || 0,
      revenue: pedidosData?.reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0) || 0,
      lowStock: lowStock,
      totalProducts: productosData?.length || 0
    });
  };

  // ============================================
  // FUNCIÓN handleSaveProducto CORREGIDA
  // ============================================
 const handleSaveProducto = async (isNew = false) => {
  try {
    // Datos base según la estructura REAL de la tabla 'productos'
    const base = {
      codigo: editingProducto.codigo,
      costo_unitario: parseFloat(editingProducto.costo_unitario) || 0,
      cantidad: parseInt(editingProducto.cantidad) || 0,
      factor_cambio: parseFloat(editingProducto.factor_cambio) || 36.50,
      precio_venta: parseFloat(editingProducto.precio_venta) || 0,
      // NOTA: La tabla 'productos' NO tiene campo 'categoria'
      // Si necesitas categorías, debes usar la tabla 'productos_categorias' separadamente
    };

    // Calcular campos derivados
    const factor = base.factor_cambio;
    const margenUsd = base.precio_venta - base.costo_unitario;
    
    const productoData = {
      ...base,
      margen_contribucion: margenUsd,
      precio_bcv: base.precio_venta * factor,
      precio_venta_bs: base.precio_venta * factor,
      margen_bruto_bs: margenUsd * factor,
      promo_en_divisas: base.precio_venta * 0.95,
      margen_bruto_usd: margenUsd,
    };

    console.log('Insertando en tabla productos:', productoData);

    if (isNew) {
      const { data, error } = await supabase
        .from('productos')
        .insert([productoData])
        .select();
      
      if (error) throw error;
      console.log('Producto creado:', data);
      
      // ============================================
      // OPCIONAL: Si quieres también guardar la categoría
      // en la tabla productos_categorias
      // ============================================
      if (editingProducto.categoria && data && data[0]) {
        const { error: catError } = await supabase
          .from('productos_categorias')
          .insert([{
            codigo: base.codigo,
            nombre: editingProducto.categoria,
            categoria: editingProducto.categoria,
            costo_unitario: base.costo_unitario,
            cantidad: base.cantidad,
            factor_cambio: base.factor_cambio,
            precio_venta: base.precio_venta,
            margen_contribucion: margenUsd,
            precio_bcv: base.precio_venta * factor,
            precio_venta_bs: base.precio_venta * factor,
            margen_bruto_bs: margenUsd * factor,
            promo_en_divisas: base.precio_venta * 0.95,
            margen_bruto_usd: margenUsd,
          }]);
        
        if (catError) {
          console.warn('Error al guardar categoría:', catError);
          // No fallamos todo si solo falla la categoría
        }
      }
      // ============================================
      
    } else {
      const { data, error } = await supabase
        .from('productos')
        .update(productoData)
        .eq('id', editingProducto.id)
        .select();
      
      if (error) throw error;
      console.log('Producto actualizado:', data);
    }
    
    await fetchData();
    setIsProductoModalOpen(false);
    setIsNewProductoModalOpen(false);
    setEditingProducto(null);
    
  } catch (error) {
    console.error('Error completo:', error);
    alert('Error al guardar producto: ' + (error.message || 'Verifica los datos'));
  }
};
  // ============================================

  const handleSavePedido = async () => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({
          estado: editingPedido.estado,
          notas: editingPedido.notas,
          direccion_envio: editingPedido.direccion_envio,
          ciudad_envio: editingPedido.ciudad_envio,
          estado_envio: editingPedido.estado_envio,
          telefono_contacto: editingPedido.telefono_contacto
        })
        .eq('id', editingPedido.id);
      
      if (error) throw error;
      setPedidos(pedidos.map(p => p.id === editingPedido.id ? editingPedido : p));
      setIsPedidoModalOpen(false);
    } catch (error) {
      alert('Error al guardar');
    }
  };

  const handleDeleteProducto = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await supabase.from('productos').delete().eq('id', id);
      await fetchData();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Filtrar Pedidos
  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = 
      pedido.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || pedido.estado === statusFilter;
    const matchesDate = !dateFilter || pedido.fecha?.startsWith(dateFilter);
    return matchesSearch && matchesStatus && matchesDate;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'date_desc': return new Date(b.fecha) - new Date(a.fecha);
      case 'date_asc': return new Date(a.fecha) - new Date(b.fecha);
      case 'total_desc': return (parseFloat(b.total) || 0) - (parseFloat(a.total) || 0);
      case 'total_asc': return (parseFloat(a.total) || 0) - (parseFloat(b.total) || 0);
      default: return 0;
    }
  });

  // Filtrar Productos
  const filteredProductos = productos.filter(prod => {
    const matchesSearch = 
      prod.codigo?.toLowerCase().includes(searchProduct.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || prod.categoria === categoryFilter;
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'low' && prod.cantidad < 10) ||
      (stockFilter === 'out' && prod.cantidad === 0) ||
      (stockFilter === 'available' && prod.cantidad > 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalPages = Math.ceil(filteredPedidos.length / pedidosPerPage);
  const paginatedPedidos = filteredPedidos.slice(
    (currentPage - 1) * pedidosPerPage,
    currentPage * pedidosPerPage
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      pendiente: { class: 'status-pending', label: 'Pendiente', icon: '⏳' },
      procesando: { class: 'status-processing', label: 'Procesando', icon: '⚙️' },
      enviado: { class: 'status-shipped', label: 'Enviado', icon: '🚚' },
      completado: { class: 'status-completed', label: 'Completado', icon: '✓' },
      cancelado: { class: 'status-cancelled', label: 'Cancelado', icon: '✕' }
    };
    const c = config[status] || config.pendiente;
    return (
      <span className={`status-badge ${c.class}`}>
        <span className="status-icon">{c.icon}</span>
        {c.label}
      </span>
    );
  };

  const getStockBadge = (cantidad) => {
    if (cantidad === 0) return <span className="stock-badge stock-out">Agotado</span>;
    if (cantidad < 10) return <span className="stock-badge stock-low">Bajo Stock</span>;
    return <span className="stock-badge stock-ok">Disponible</span>;
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Background Effects */}
      <div className="bg-effects">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Header */}
      <header className="admin-header">
        <div className="header-brand">
          <div className="logo-pulse"></div>
          <h1>ADMIN PANEL</h1>
        </div>
        
        <nav className="header-nav">
          <button 
            className={`nav-tab ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pedidos')}
          >
            <span className="tab-icon">📦</span>
            Pedidos
            {stats.pending > 0 && <span className="tab-badge">{stats.pending}</span>}
          </button>
          <button 
            className={`nav-tab ${activeTab === 'inventario' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventario')}
          >
            <span className="tab-icon">🏭</span>
            Inventario
            {stats.lowStock > 0 && <span className="tab-badge warning">{stats.lowStock}</span>}
          </button>
        </nav>

        <div className="user-section">
          <div className="user-avatar">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{user.email.split('@')[0]}</span>
            <span className="user-role">Administrador</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>Salir</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      <main className="admin-main">
        {/* Stats Grid */}
        <div className="stats-container" ref={statsRef}>
          {activeTab === 'pedidos' ? (
            <>
              <div className="stat-card highlight">
                <div className="stat-glow"></div>
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <span className="stat-value">{formatCurrency(stats.revenue)}</span>
                  <span className="stat-label">Ingresos Totales</span>
                </div>
                <div className="stat-chart">
                  <div className="chart-bar" style={{height: '70%'}}></div>
                  <div className="chart-bar" style={{height: '90%'}}></div>
                  <div className="chart-bar" style={{height: '60%'}}></div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <span className="stat-value">{stats.total}</span>
                  <span className="stat-label">Total Pedidos</span>
                </div>
              </div>
              <div className="stat-card pulse">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <span className="stat-value">{stats.pending}</span>
                  <span className="stat-label">Pendientes</span>
                </div>
              </div>
              <div className="stat-card success">
                <div className="stat-icon">✓</div>
                <div className="stat-content">
                  <span className="stat-value">{stats.completed}</span>
                  <span className="stat-label">Completados</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="stat-card highlight">
                <div className="stat-glow"></div>
                <div className="stat-icon">🏭</div>
                <div className="stat-content">
                  <span className="stat-value">{stats.totalProducts}</span>
                  <span className="stat-label">Total Productos</span>
                </div>
              </div>
              <div className="stat-card warning pulse">
                <div className="stat-icon">⚠️</div>
                <div className="stat-content">
                  <span className="stat-value">{stats.lowStock}</span>
                  <span className="stat-label">Bajo Stock</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <span className="stat-value">{productos.filter(p => p.cantidad > 0).length}</span>
                  <span className="stat-label">Disponibles</span>
                </div>
              </div>
              <div className="stat-card danger">
                <div className="stat-icon">🚫</div>
                <div className="stat-content">
                  <span className="stat-value">{productos.filter(p => p.cantidad === 0).length}</span>
                  <span className="stat-label">Agotados</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="content-section" ref={tableRef}>
          {activeTab === 'pedidos' ? (
            <>
              {/* Filtros Pedidos */}
              <div className="filters-bar">
                <div className="search-box animated">
                  <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar pedidos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="filter-chips">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="procesando">Procesando</option>
                    <option value="enviado">Enviado</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  
                  <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
                  
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="date_desc">Más reciente</option>
                    <option value="date_asc">Más antiguo</option>
                    <option value="total_desc">Mayor monto</option>
                    <option value="total_asc">Menor monto</option>
                  </select>
                </div>
              </div>

              {/* Tabla Pedidos */}
              <div className="data-table-container">
                {paginatedPedidos.length === 0 ? (
                  <div className="empty-state">
                    <p>No se encontraron pedidos</p>
                  </div>
                ) : (
                  <>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Cliente</th>
                          <th>Productos</th>
                          <th>Total</th>
                          <th>Estado</th>
                          <th>Fecha</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedPedidos.map((pedido) => (
                          <tr key={pedido.id} className="table-row-animated">
                            <td className="id-cell">#{pedido.id.toString().padStart(4, '0')}</td>
                            <td>
                              <div className="client-info">
                                <span className="client-name">{pedido.cliente_nombre}</span>
                                <span className="client-email">{pedido.cliente_email}</span>
                              </div>
                            </td>
                            <td>
                              <div className="products-preview">
                                {pedido.detalles?.map((d, i) => (
                                  <span key={i} className="product-tag">
                                    {d.cantidad}x {d.nombre_producto}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="amount-cell">{formatCurrency(pedido.total)}</td>
                            <td>{getStatusBadge(pedido.estado)}</td>
                            <td className="date-cell">{formatDate(pedido.fecha)}</td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="action-btn edit"
                                  onClick={() => {
                                    setEditingPedido(pedido);
                                    setIsPedidoModalOpen(true);
                                  }}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {totalPages > 1 && (
                      <div className="pagination">
                        <button 
                          className="page-btn"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          ←
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button 
                          className="page-btn"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Filtros Productos */}
              <div className="filters-bar">
                <div className="search-box animated">
                  <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                  />
                </div>
                
                <div className="filter-chips">
                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="all">Todas las categorías</option>
                    {categorias.map((cat) => (
                      <option key={cat.codigo || cat.nombre} value={cat.nombre}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                  
                  <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
                    <option value="all">Todo el stock</option>
                    <option value="available">Disponible</option>
                    <option value="low">Bajo stock</option>
                    <option value="out">Agotado</option>
                  </select>
                </div>

                <button 
                  className="btn-primary glow"
                  onClick={openNuevoProductoModal}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Nuevo Producto
                </button>
              </div>

              {/* Grid Productos */}
              <div className="products-grid">
                {filteredProductos.length === 0 ? (
                  <div className="empty-state">
                    <p>No se encontraron productos</p>
                  </div>
                ) : (
                  filteredProductos.map((producto) => (
                    <div key={producto.id} className="product-card">
                      <div className="product-header">
                        <span className="product-code">{producto.codigo}</span>
                        {getStockBadge(producto.cantidad)}
                      </div>
                      <h3 className="product-name">{producto.codigo}</h3>
                      <p className="product-category">{producto.categoria || 'Sin categoría'}</p>
                      
                      <div className="product-stats">
                        <div className="stat">
                          <span className="stat-label">Stock</span>
                          <span className={`stat-value ${producto.cantidad < 10 ? 'warning' : ''}`}>
                            {producto.cantidad} uds
                          </span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Precio</span>
                          <span className="stat-value price">{formatCurrency(producto.precio_venta)}</span>
                        </div>
                      </div>

                      <div className="product-actions">
                        <button 
                          className="action-btn edit"
                          onClick={() => {
                            setEditingProducto(producto);
                            setIsProductoModalOpen(true);
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Editar
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDeleteProducto(producto.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modal Pedido */}
      {isPedidoModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPedidoModalOpen(false)}>
          <div className="modal premium" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Pedido #{editingPedido?.id}</h3>
              <button className="close-btn" onClick={() => setIsPedidoModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Estado</label>
                  <select 
                    value={editingPedido?.estado} 
                    onChange={(e) => setEditingPedido({...editingPedido, estado: e.target.value})}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="procesando">Procesando</option>
                    <option value="enviado">Enviado</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input 
                    type="tel" 
                    value={editingPedido?.telefono_contacto || ''}
                    onChange={(e) => setEditingPedido({...editingPedido, telefono_contacto: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Dirección de Envío</label>
                <input 
                  type="text" 
                  value={editingPedido?.direccion_envio || ''}
                  onChange={(e) => setEditingPedido({...editingPedido, direccion_envio: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Notas</label>
                <textarea 
                  rows="3"
                  value={editingPedido?.notas || ''}
                  onChange={(e) => setEditingPedido({...editingPedido, notas: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsPedidoModalOpen(false)}>Cancelar</button>
              <button className="btn-primary glow" onClick={handleSavePedido}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          COMPONENTE MODAL DE PRODUCTO (NUEVO/EDITAR)
          ============================================ */}
      <ProductoModal
        isOpen={isNewProductoModalOpen || isProductoModalOpen}
        onClose={() => {
          setIsNewProductoModalOpen(false);
          setIsProductoModalOpen(false);
          setEditingProducto(null);
        }}
        onSave={handleSaveProducto}
        editingProducto={editingProducto}
        setEditingProducto={setEditingProducto}
        categorias={categorias}
        isNew={isNewProductoModalOpen}
      />
      {/* ============================================ */}
    </div>
  );
};

export default Admin;