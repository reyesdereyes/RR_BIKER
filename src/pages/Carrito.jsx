import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  FaShoppingCart, 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaArrowLeft,
  FaMotorcycle,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaTruck,
  FaShieldAlt,
  FaCheck,
  FaCreditCard,
  FaStore,
  FaClock,
  FaTimes,
  FaMotorcycle as FaMoto,
  FaSpinner
} from 'react-icons/fa';
import '../css/Carrito.css';

// Configuración de Supabase (tu cliente)
import  supabase  from '../conf/supabase';

const Carrito = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [savingOrder, setSavingOrder] = useState(false);
  
  // Modal de datos del cliente
  const [showModal, setShowModal] = useState(false);
  const [customerData, setCustomerData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    estado: '',
    metodoEnvio: 'delivery',
    metodoPago: 'pago-movil',
    notas: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // NÚMERO DE WHATSAPP DE LA TIENDA (reemplaza con tu número real)
  const WHATSAPP_NUMBER = '584141234567'; // Formato: 58 + número sin 0
  const WHATSAPP_BASE_URL = 'https://wa.me';

  // Cargar carrito
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('rrbikerCart');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          setCartItems(items);
        } catch (e) {
          console.error('Error parsing cart:', e);
          setCartItems([]);
        }
      }
      setLoading(false);
    };
    loadCart();
  }, []);

  const saveCart = (newItems) => {
    localStorage.setItem('rrbikerCart', JSON.stringify(newItems));
    window.dispatchEvent(new Event('rrbikerCartUpdated'));
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      saveCart(updated);
      return updated;
    });
  };

  const removeItem = (id) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      saveCart(updated);
      return updated;
    });
  };

  const clearCart = () => {
    if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
      setCartItems([]);
      localStorage.removeItem('rrbikerCart');
      window.dispatchEvent(new Event('rrbikerCartUpdated'));
    }
  };

  const formatBs = (valor) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2
    }).format(valor || 0);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.precio_bs * item.quantity), 0);
  const iva = subtotal * 0.16;
  const envio = customerData.metodoEnvio === 'delivery' && subtotal < 500 ? 15 : 0;
  const total = subtotal + iva + envio;

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    if (!customerData.nombre.trim()) newErrors.nombre = 'Nombre requerido';
    if (!customerData.telefono.trim()) newErrors.telefono = 'Teléfono requerido';
    
    if (customerData.metodoEnvio === 'delivery') {
      if (!customerData.direccion.trim()) {
        newErrors.direccion = 'Dirección requerida para delivery';
      }
      if (!customerData.ciudad.trim()) {
        newErrors.ciudad = 'Ciudad requerida';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // FUNCIÓN PRINCIPAL: Guardar en BD y enviar a WhatsApp
  // ============================================
  const processOrder = async () => {
    if (!validateForm()) {
      console.log('Errores de validación:', errors);
      return;
    }
    
    setIsSubmitting(true);
    setSavingOrder(true);
    
    try {
      // PASO 1: Guardar/Actualizar usuario
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .upsert({
          nombre: customerData.nombre,
          correo: customerData.email || null,
          direccion: customerData.direccion || null,
          telefono: customerData.telefono,
          ciudad: customerData.ciudad || null,
          estado: customerData.estado || null
        }, {
          onConflict: 'correo', // Si el correo existe, actualiza; si no, inserta
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (userError) throw userError;
      
      const usuarioId = userData.id;
      console.log('Usuario guardado:', usuarioId);

      // PASO 2: Crear el pedido
      const pedidoData = {
        usuario_id: usuarioId,
        fecha: new Date().toISOString(),
        total: total,
        estado: 'pendiente',
        metodo_envio: customerData.metodoEnvio,
        metodo_pago: customerData.metodoPago,
        direccion_envio: customerData.metodoEnvio === 'delivery' ? customerData.direccion : 'Retiro en tienda - Guacara, Carabobo',
        ciudad_envio: customerData.ciudad || 'Guacara',
        estado_envio: customerData.estado || 'Carabobo',
        notas: customerData.notas || null,
        telefono_contacto: customerData.telefono,
        iva: iva,
        costo_envio: envio
      };

      const { data: pedidoCreado, error: pedidoError } = await supabase
        .from('pedidos')
        .insert(pedidoData)
        .select()
        .single();

      if (pedidoError) throw pedidoError;
      
      const pedidoId = pedidoCreado.id;
      console.log('Pedido creado:', pedidoId);

      // PASO 3: Guardar detalles del pedido
      const detallesData = cartItems.map(item => ({
        pedido_id: pedidoId,
        producto_id: item.id,
        nombre_producto: item.nombre, // Guardar nombre por si cambia después
        cantidad: item.quantity,
        precio_unitario: item.precio_bs
      }));

      const { error: detallesError } = await supabase
        .from('detalles_pedido')
        .insert(detallesData);

      if (detallesError) throw detallesError;
      
      console.log('Detalles guardados:', detallesData.length, 'productos');

      // PASO 4: Generar mensaje de WhatsApp con el número de pedido
      const mensajeWhatsApp = generateOrderMessage(pedidoId);
      
      // PASO 5: Enviar a WhatsApp
      await sendToWhatsApp(mensajeWhatsApp);
      
      // PASO 6: Limpiar carrito y mostrar éxito
      finishOrder();
      
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      alert('Hubo un error al guardar el pedido. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
      setSavingOrder(false);
    }
  };

  // Generar mensaje de pedido COMPLETO con número de pedido
  const generateOrderMessage = (pedidoId) => {
    const fecha = new Date().toLocaleDateString('es-VE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let message = `🛒 *NUEVO PEDIDO #${pedidoId} - RR BIKER*\n`;
    message += `📅 ${fecha}\n\n`;
    
    message += `👤 *DATOS DEL CLIENTE:*\n`;
    message += `• Nombre: ${customerData.nombre}\n`;
    message += `• Teléfono: ${customerData.telefono}\n`;
    if (customerData.email) message += `• Email: ${customerData.email}\n`;
    
    // DATOS DE ENTREGA
    message += `\n📍 *DATOS DE ENTREGA:*\n`;
    if (customerData.metodoEnvio === 'delivery') {
      message += `• Método: Delivery 🚚\n`;
      message += `• Dirección: ${customerData.direccion}\n`;
      message += `• Ciudad: ${customerData.ciudad}\n`;
      if (customerData.estado) message += `• Estado: ${customerData.estado}\n`;
    } else {
      message += `• Método: Retiro en tienda 🏪\n`;
      message += `• Dirección de retiro: Guacara, Carabobo\n`;
      message += `• Horario: Lunes a Sábado 8:00am - 6:00pm\n`;
      if (customerData.notas) {
        message += `• Notas de retiro: ${customerData.notas}\n`;
      }
    }
    
    message += `\n💳 *MÉTODO DE PAGO:*\n`;
    const pagos = {
      'pago-movil': 'Pago Móvil',
      'transferencia': 'Transferencia Bancaria',
      'efectivo': 'Efectivo'
    };
    message += `• ${pagos[customerData.metodoPago]}\n`;
    
    if (customerData.metodoEnvio === 'delivery' && customerData.notas) {
      message += `\n📝 *NOTAS ADICIONALES:*\n${customerData.notas}\n`;
    }
    
    message += `\n📦 *PRODUCTOS:*\n`;
    cartItems.forEach((item, idx) => {
      message += `${idx + 1}. ${item.nombre}\n`;
      message += `   Categoría: ${item.categoria}\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio unit: ${formatBs(item.precio_bs)}\n`;
      message += `   Subtotal: ${formatBs(item.precio_bs * item.quantity)}\n\n`;
    });
    
    message += `💰 *RESUMEN FINANCIERO:*\n`;
    message += `• Subtotal: ${formatBs(subtotal)}\n`;
    message += `• IVA (16%): ${formatBs(iva)}\n`;
    if (envio > 0) {
      message += `• Envío: ${formatBs(envio)}\n`;
    } else if (customerData.metodoEnvio === 'delivery') {
      message += `• Envío: GRATIS\n`;
    }
    message += `• *TOTAL A PAGAR: ${formatBs(total)}*\n\n`;
    
    message += `✅ Pedido #${pedidoId} registrado en sistema. Por favor confirmar disponibilidad y método de pago. ¡Gracias por preferir RR Biker! 🏍️`;
    
    return message;
  };

  // Enviar a WhatsApp
  const sendToWhatsApp = (message) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Finalizar pedido
  const finishOrder = () => {
    setCartItems([]);
    localStorage.removeItem('rrbikerCart');
    window.dispatchEvent(new Event('rrbikerCartUpdated'));
    setShowModal(false);
    setCurrentStep(4);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="cart-loading">
          <div className="spinner"></div>
          <p>Cargando carrito...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (cartItems.length === 0 && currentStep !== 4) {
    return (
      <>
        <Header />
        <div className="cart-page">
          <div className="cart-hero-empty">
            <div className="hero-glow"></div>
            <div className="cart-hero-content">
              <div className="empty-icon-float">
                <FaShoppingCart />
              </div>
              <h2>TU CARRITO ESTÁ VACÍO</h2>
              <p>Explora nuestro catálogo de repuestos premium para motos de alta cilindrada</p>
              <Link to="/productos" className="btn-primary-large">
                <FaArrowLeft /> VER CATÁLOGO
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="cart-page-premium">
        {/* HERO PREMIUM */}
        <section className="cart-hero-premium">
          <div className="hero-bg-effects">
            <div className="grid-overlay"></div>
            <div className="glow-orb"></div>
          </div>
          <div className="cart-hero-content">
            <div className="badge-pulse">
              <FaShoppingCart /> CARRITO DE COMPRAS
            </div>
            <h1 className="title-premium">
              <span className="title-line">FINALIZA TU</span>
              <span className="title-line red">COMPRA</span>
            </h1>
            <div className="progress-steps">
              <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                <div className="step-icon"><FaShoppingCart /></div>
                <span>Carrito</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                <div className="step-icon"><FaUser /></div>
                <span>Tus Datos</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
                <div className="step-icon"><FaWhatsapp /></div>
                <span>Confirmar</span>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENIDO PRINCIPAL */}
        <div className="container cart-main-container">
          {currentStep === 1 && (
            <div className="cart-layout-premium">
              {/* LISTA DE PRODUCTOS */}
              <div className="products-section">
                <div className="section-header">
                  <h3><FaMoto /> PRODUCTOS SELECCIONADOS</h3>
                  <span className="items-count">{cartItems.length} items</span>
                </div>

                <div className="products-list-premium">
                  {cartItems.map((item, index) => (
                    <div key={item.id} className="product-card-premium" style={{ animationDelay: `${index * 0.08}s` }}>
                      <div className="product-image-premium">
                        <FaMotorcycle />
                        <div className="image-glow"></div>
                      </div>
                      
                      <div className="product-info-premium">
                        <div className="product-meta">
                          <span className="category-tag">{item.categoria}</span>
                          <span className="stock-badge">✓ Disponible</span>
                        </div>
                        <h4 className="product-name-premium">{item.nombre}</h4>
                        <div className="product-sku">SKU: {item.id}</div>
                      </div>

                      <div className="product-actions-premium">
                        <div className="quantity-premium">
                          <button 
                            className="qty-btn-premium"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus />
                          </button>
                          <span className="qty-value-premium">{item.quantity}</span>
                          <button 
                            className="qty-btn-premium"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                        
                        <div className="price-premium">
                          <div className="unit-price">{formatBs(item.precio_bs)} c/u</div>
                          <div className="total-price">{formatBs(item.precio_bs * item.quantity)}</div>
                        </div>

                        <button 
                          className="btn-delete-premium"
                          onClick={() => removeItem(item.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-actions-bar">
                  <Link to="/productos" className="btn-continue-premium">
                    <FaArrowLeft /> Seguir comprando
                  </Link>
                  <button className="btn-clear-premium" onClick={clearCart}>
                    <FaTrash /> Vaciar carrito
                  </button>
                </div>
              </div>

              {/* RESUMEN DE COMPRA */}
              <div className="summary-section-premium">
                <div className="summary-card-premium">
                  <div className="summary-header">
                    <FaCreditCard />
                    <h3>RESUMEN DEL PEDIDO</h3>
                  </div>

                  <div className="summary-body">
                    <div className="summary-row-premium">
                      <span>Subtotal</span>
                      <span>{formatBs(subtotal)}</span>
                    </div>
                    <div className="summary-row-premium">
                      <span>IVA (16%)</span>
                      <span>{formatBs(iva)}</span>
                    </div>
                    <div className="summary-row-premium highlight">
                      <span><FaTruck /> Envío</span>
                      <span>{envio === 0 ? 'GRATIS' : formatBs(envio)}</span>
                    </div>
                    
                    <div className="summary-divider-premium"></div>
                    
                    <div className="summary-total-premium">
                      <span>TOTAL A PAGAR</span>
                      <span className="total-amount">{formatBs(total)}</span>
                    </div>
                  </div>

                  <div className="summary-footer">
                    <button 
                      className="btn-checkout-premium"
                      onClick={() => {
                        setCurrentStep(2);
                        setShowModal(true);
                      }}
                    >
                      <FaWhatsapp /> CONFIRMAR POR WHATSAPP
                    </button>
                    
                    <div className="secure-badges">
                      <span><FaShieldAlt /> Pago seguro</span>
                      <span><FaClock /> Entrega 24-48h</span>
                    </div>
                  </div>
                </div>

                <div className="trust-badges">
                  <div className="trust-item">
                    <FaStore />
                    <span>Retiro en tienda Guacara</span>
                  </div>
                  <div className="trust-item">
                    <FaTruck />
                    <span>Delivery en Carabobo</span>
                  </div>
                  <div className="trust-item">
                    <FaShieldAlt />
                    <span>Garantía de 30 días</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: CONFIRMACIÓN FINAL */}
          {currentStep === 4 && (
            <div className="confirmation-success">
              <div className="success-icon">
                <FaCheck />
              </div>
              <h2>¡PEDIDO ENVIADO Y GUARDADO!</h2>
              <p>Tu pedido ha sido registrado en nuestro sistema y enviado por WhatsApp. Nuestro equipo te contactará pronto para confirmar la disponibilidad.</p>
              <div className="confirmation-actions">
                <Link to="/" className="btn-primary-large">
                  VOLVER AL INICIO
                </Link>
                <Link to="/productos" className="btn-secondary-large">
                  SEGUIR COMPRANDO
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE DATOS DEL CLIENTE */}
      {showModal && (
        <div className="modal-overlay-premium" onClick={() => !isSubmitting && setShowModal(false)}>
          <div className="modal-content-premium" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={() => !isSubmitting && setShowModal(false)}
              disabled={isSubmitting}
            >
              <FaTimes />
            </button>
            
            <div className="modal-header-premium">
              <div className="modal-icon-wrapper">
                <FaWhatsapp />
              </div>
              <h2>Completa tus datos</h2>
              <p>Guardaremos tu pedido y lo enviaremos por WhatsApp</p>
            </div>

            <div className="modal-body-premium">
              {/* Sección: Información personal */}
              <div className="form-section-premium">
                <h4 className="section-title"><FaUser /> Información personal</h4>
                <div className="form-row-premium">
                  <div className="form-field-premium">
                    <label>Nombre completo *</label>
                    <input 
                      type="text" 
                      value={customerData.nombre}
                      onChange={e => setCustomerData({...customerData, nombre: e.target.value})}
                      placeholder="Ej: Juan Pérez"
                      disabled={isSubmitting}
                      className={errors.nombre ? 'error' : ''}
                    />
                    {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                  </div>
                  <div className="form-field-premium">
                    <label>Teléfono *</label>
                    <input 
                      type="tel" 
                      value={customerData.telefono}
                      onChange={e => setCustomerData({...customerData, telefono: e.target.value})}
                      placeholder="Ej: 0412-1234567"
                      disabled={isSubmitting}
                      className={errors.telefono ? 'error' : ''}
                    />
                    {errors.telefono && <span className="error-text">{errors.telefono}</span>}
                  </div>
                </div>
                
                <div className="form-field-premium full-width">
                  <label>Email (opcional)</label>
                  <input 
                    type="email" 
                    value={customerData.email}
                    onChange={e => setCustomerData({...customerData, email: e.target.value})}
                    placeholder="tu@email.com"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Sección: Método de entrega */}
              <div className="form-section-premium">
                <h4 className="section-title"><FaMapMarkerAlt /> Método de entrega</h4>
                <div className="delivery-options-premium">
                  <button 
                    type="button"
                    className={`delivery-card ${customerData.metodoEnvio === 'delivery' ? 'active' : ''}`}
                    onClick={() => setCustomerData({...customerData, metodoEnvio: 'delivery'})}
                    disabled={isSubmitting}
                  >
                    <FaTruck className="delivery-icon" />
                    <span className="delivery-title">Delivery</span>
                    <span className="delivery-desc">A domicilio</span>
                  </button>
                  <button 
                    type="button"
                    className={`delivery-card ${customerData.metodoEnvio === 'pickup' ? 'active' : ''}`}
                    onClick={() => setCustomerData({...customerData, metodoEnvio: 'pickup'})}
                    disabled={isSubmitting}
                  >
                    <FaStore className="delivery-icon" />
                    <span className="delivery-title">Retiro</span>
                    <span className="delivery-desc">En tienda</span>
                  </button>
                </div>

                {customerData.metodoEnvio === 'delivery' && (
                  <div className="delivery-fields">
                    <div className="form-field-premium full-width">
                      <label>Dirección completa *</label>
                      <textarea 
                        value={customerData.direccion}
                        onChange={e => setCustomerData({...customerData, direccion: e.target.value})}
                        placeholder="Calle, número, casa/apto, referencias..."
                        rows="2"
                        disabled={isSubmitting}
                        className={errors.direccion ? 'error' : ''}
                      />
                      {errors.direccion && <span className="error-text">{errors.direccion}</span>}
                    </div>
                    <div className="form-row-premium">
                      <div className="form-field-premium">
                        <label>Ciudad *</label>
                        <input 
                          type="text" 
                          value={customerData.ciudad}
                          onChange={e => setCustomerData({...customerData, ciudad: e.target.value})}
                          placeholder="Ej: Guacara"
                          disabled={isSubmitting}
                          className={errors.ciudad ? 'error' : ''}
                        />
                        {errors.ciudad && <span className="error-text">{errors.ciudad}</span>}
                      </div>
                      <div className="form-field-premium">
                        <label>Estado</label>
                        <input 
                          type="text" 
                          value={customerData.estado}
                          onChange={e => setCustomerData({...customerData, estado: e.target.value})}
                          placeholder="Ej: Carabobo"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {customerData.metodoEnvio === 'pickup' && (
                  <div className="pickup-info-box">
                    <FaStore className="pickup-icon" />
                    <div className="pickup-details">
                      <strong>Retiro en tienda RR Biker</strong>
                      <p>Guacara, Carabobo</p>
                      <small>Horario: Lunes a Sábado 8:00am - 6:00pm</small>
                    </div>
                  </div>
                )}
              </div>

              {/* Sección: Método de pago */}
              <div className="form-section-premium">
                <h4 className="section-title"><FaCreditCard /> Método de pago</h4>
                <div className="payment-options-premium">
                  <button 
                    type="button"
                    className={`payment-card ${customerData.metodoPago === 'pago-movil' ? 'active' : ''}`}
                    onClick={() => setCustomerData({...customerData, metodoPago: 'pago-movil'})}
                    disabled={isSubmitting}
                  >
                    <span className="payment-emoji">📱</span>
                    <span className="payment-name">Pago Móvil</span>
                  </button>
                  <button 
                    type="button"
                    className={`payment-card ${customerData.metodoPago === 'transferencia' ? 'active' : ''}`}
                    onClick={() => setCustomerData({...customerData, metodoPago: 'transferencia'})}
                    disabled={isSubmitting}
                  >
                    <span className="payment-emoji">🏦</span>
                    <span className="payment-name">Transferencia</span>
                  </button>
                  <button 
                    type="button"
                    className={`payment-card ${customerData.metodoPago === 'efectivo' ? 'active' : ''}`}
                    onClick={() => setCustomerData({...customerData, metodoPago: 'efectivo'})}
                    disabled={isSubmitting}
                  >
                    <span className="payment-emoji">💵</span>
                    <span className="payment-name">Efectivo</span>
                  </button>
                </div>
              </div>

              {/* Sección: Notas */}
              <div className="form-section-premium">
                <h4 className="section-title">
                  {customerData.metodoEnvio === 'pickup' ? 'Notas para el retiro (opcional)' : 'Notas adicionales (opcional)'}
                </h4>
                <div className="form-field-premium full-width">
                  <textarea 
                    value={customerData.notas}
                    onChange={e => setCustomerData({...customerData, notas: e.target.value})}
                    placeholder={customerData.metodoEnvio === 'pickup' 
                      ? "Ej: Voy a retirar en la tarde, llamar antes de entregar..." 
                      : "Alguna indicación especial sobre tu pedido..."}
                    rows="2"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Resumen del pedido */}
              <div className="order-summary-box">
                <h4 className="summary-title">Resumen de tu pedido</h4>
                <div className="summary-items-list">
                  {cartItems.map(item => (
                    <div key={item.id} className="summary-item-row">
                      <span className="item-name">{item.quantity}x {item.nombre}</span>
                      <span className="item-price">{formatBs(item.precio_bs * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-total-row">
                  <span className="total-label">TOTAL</span>
                  <span className="total-price-red">{formatBs(total)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer-premium">
              <button 
                type="button"
                className="btn-cancel-premium"
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button 
                type="button"
                className="btn-send-premium"
                onClick={processOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spinner-btn" />
                    <span>{savingOrder ? 'Guardando pedido...' : 'Enviando...'}</span>
                  </>
                ) : (
                  <>
                    <FaWhatsapp />
                    <span>Confirmar y Enviar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Carrito;