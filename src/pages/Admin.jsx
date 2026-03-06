import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import supabase from '../conf/supabase';
import '../css/admin.css';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    today: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const ordersPerPage = 10;
  const navigate = useNavigate();

  // Verificar sesión y cargar datos
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);
      await fetchOrders();
    };

    init();
  }, [navigate]);

  // Cargar pedidos desde Supabase
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setOrders(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Datos de ejemplo si no hay tabla
      const mockOrders = [
        {
          id: 1,
          customer_name: 'Juan Pérez',
          customer_email: 'juan@email.com',
          phone: '+34 612 345 678',
          product: 'Producto A',
          quantity: 2,
          total: 199.98,
          status: 'completed',
          created_at: '2024-01-15T10:30:00',
          notes: 'Entrega urgente'
        },
        {
          id: 2,
          customer_name: 'María García',
          customer_email: 'maria@email.com',
          phone: '+34 623 456 789',
          product: 'Producto B',
          quantity: 1,
          total: 89.99,
          status: 'pending',
          created_at: '2024-01-15T14:20:00',
          notes: ''
        },
        {
          id: 3,
          customer_name: 'Carlos López',
          customer_email: 'carlos@email.com',
          phone: '+34 634 567 890',
          product: 'Producto C',
          quantity: 3,
          total: 299.97,
          status: 'processing',
          created_at: '2024-01-14T09:15:00',
          notes: 'Llamar antes de entregar'
        }
      ];
      setOrders(mockOrders);
      calculateStats(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas
  const calculateStats = (ordersData) => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = ordersData.filter(o => o.created_at.startsWith(today));
    
    setStats({
      total: ordersData.length,
      pending: ordersData.filter(o => o.status === 'pending').length,
      completed: ordersData.filter(o => o.status === 'completed').length,
      today: todayOrders.length,
      revenue: ordersData.reduce((sum, o) => sum + (o.total || 0), 0)
    });
  };

  // Filtrar y ordenar pedidos
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesDate = !dateFilter || order.created_at.startsWith(dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'date_desc': return new Date(b.created_at) - new Date(a.created_at);
      case 'date_asc': return new Date(a.created_at) - new Date(b.created_at);
      case 'total_desc': return (b.total || 0) - (a.total || 0);
      case 'total_asc': return (a.total || 0) - (b.total || 0);
      default: return 0;
    }
  });

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Abrir modal de edición
  const handleEdit = (order) => {
    setEditingOrder({ ...order });
    setIsModalOpen(true);
  };

  // Guardar cambios
  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update(editingOrder)
        .eq('id', editingOrder.id);

      if (error) throw error;

      // Actualizar estado local
      setOrders(orders.map(o => o.id === editingOrder.id ? editingOrder : o));
      calculateStats(orders.map(o => o.id === editingOrder.id ? editingOrder : o));
      setIsModalOpen(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error al guardar los cambios');
    }
  };

  // Eliminar pedido
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este pedido?')) return;

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const updatedOrders = orders.filter(o => o.id !== id);
      setOrders(updatedOrders);
      calculateStats(updatedOrders);
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error al eliminar el pedido');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', label: 'Pendiente' },
      processing: { class: 'status-processing', label: 'En proceso' },
      completed: { class: 'status-completed', label: 'Completado' },
      cancelled: { class: 'status-cancelled', label: 'Cancelado' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  if (!user) return null;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <div className="user-info">
          <span className="user-email">{user.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="admin-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Pedidos</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pendientes</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completados</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-value">{stats.today}</div>
            <div className="stat-label">Hoy</div>
            <span className="stat-change">+{stats.today} nuevos</span>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por cliente, email o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label>Estado:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="processing">En proceso</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Fecha:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Ordenar:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date_desc">Más reciente</option>
              <option value="date_asc">Más antiguo</option>
              <option value="total_desc">Mayor total</option>
              <option value="total_asc">Menor total</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="orders-section">
          <div className="section-header">
            <h3>Listado de Pedidos</h3>
            <button className="btn-primary" onClick={fetchOrders}>
              ↻ Actualizar
            </button>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              Cargando pedidos...
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Contacto</th>
                      <th>Producto</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.length > 0 ? (
                      paginatedOrders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>
                            <strong>{order.customer_name}</strong>
                          </td>
                          <td>
                            <div>{order.customer_email}</div>
                            <small style={{ color: 'var(--white-muted)' }}>{order.phone}</small>
                          </td>
                          <td>
                            {order.product} x{order.quantity}
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--primary-red)' }}>
                            {formatCurrency(order.total)}
                          </td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td>{formatDate(order.created_at)}</td>
                          <td>
                            <div className="action-btns">
                              <button 
                                className="action-btn" 
                                onClick={() => handleEdit(order)}
                                title="Editar"
                              >
                                ✎
                              </button>
                              <button 
                                className="action-btn" 
                                onClick={() => handleDelete(order.id)}
                                title="Eliminar"
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="empty-state">
                          <div className="empty-state-icon">📭</div>
                          <h4>No se encontraron pedidos</h4>
                          <p>Intenta ajustar los filtros de búsqueda</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
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
                      key={i + 1}
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
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingOrder && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Pedido #{editingOrder.id}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Cliente</label>
                  <input
                    type="text"
                    value={editingOrder.customer_name}
                    onChange={(e) => setEditingOrder({...editingOrder, customer_name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editingOrder.customer_email}
                    onChange={(e) => setEditingOrder({...editingOrder, customer_email: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={editingOrder.phone || ''}
                    onChange={(e) => setEditingOrder({...editingOrder, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={editingOrder.status}
                    onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value})}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="processing">En proceso</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Producto</label>
                  <input
                    type="text"
                    value={editingOrder.product}
                    onChange={(e) => setEditingOrder({...editingOrder, product: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={editingOrder.quantity}
                    onChange={(e) => setEditingOrder({...editingOrder, quantity: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Total (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingOrder.total}
                  onChange={(e) => setEditingOrder({...editingOrder, total: parseFloat(e.target.value)})}
                />
              </div>

              <div className="form-group">
                <label>Notas</label>
                <textarea
                  value={editingOrder.notes || ''}
                  onChange={(e) => setEditingOrder({...editingOrder, notes: e.target.value})}
                  placeholder="Notas adicionales sobre el pedido..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleSave}>
                💾 Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;