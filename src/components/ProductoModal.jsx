// src/components/ProductoModal.jsx
import React from 'react';
import '../css/producto-modal.css';

const ProductoModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingProducto, 
  setEditingProducto, 
  categorias,
  isNew = false 
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    setEditingProducto(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calcular valores derivados para preview
  const cantidad = parseInt(editingProducto?.cantidad) || 0;
  const costo = parseFloat(editingProducto?.costo_unitario) || 0;
  const precio = parseFloat(editingProducto?.precio_venta) || 0;
  const factor = parseFloat(editingProducto?.factor_cambio) || 36.50;
  
  const margen = precio - costo;
  const margenPorcentaje = precio > 0 ? ((margen / precio) * 100).toFixed(1) : 0;
  const precioBs = precio * factor;
  const gananciaTotal = margen * cantidad;

  return (
    <div className="producto-modal-overlay" onClick={handleOverlayClick}>
      <div className="producto-modal-container">
        {/* Header */}
        <div className="producto-modal-header">
          <div className="header-content">
            <span className="header-icon">{isNew ? '➕' : '✏️'}</span>
            <h3>{isNew ? 'Nuevo Producto' : 'Editar Producto'}</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="producto-modal-body">
          {/* Sección 1: Información General */}
          <div className="form-section">
            <h4 className="section-title">Información General</h4>
            <div className="form-grid two-columns">
              <div className="form-field">
                <label>
                  <span className="field-icon">🏷️</span>
                  Código <span className="required">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder={isNew ? "Ej: PROD-001" : ""}
                  value={editingProducto?.codigo || ''}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="form-field">
                <label>
                  <span className="field-icon">📁</span>
                  Categoría <span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <select 
                    value={editingProducto?.categoria || ''}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.codigo || cat.nombre} value={cat.nombre}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 2: Precios y Stock */}
          <div className="form-section">
            <h4 className="section-title">Precios y Stock</h4>
            <div className="form-grid four-columns">
              <div className="form-field">
                <label>
                  <span className="field-icon">📦</span>
                  Cantidad
                </label>
                <input 
                  type="number" 
                  min="0"
                  value={editingProducto?.cantidad || 0}
                  onChange={(e) => handleInputChange('cantidad', parseInt(e.target.value) || 0)}
                  className="input-field"
                />
              </div>

              <div className="form-field">
                <label>
                  <span className="field-icon">💰</span>
                  Costo USD
                </label>
                <div className="input-prefix">
                  <span className="prefix">$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={editingProducto?.costo_unitario || 0}
                    onChange={(e) => handleInputChange('costo_unitario', parseFloat(e.target.value) || 0)}
                    className="input-field with-prefix"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>
                  <span className="field-icon">🏷️</span>
                  Precio USD
                </label>
                <div className="input-prefix">
                  <span className="prefix">$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={editingProducto?.precio_venta || 0}
                    onChange={(e) => handleInputChange('precio_venta', parseFloat(e.target.value) || 0)}
                    className="input-field with-prefix"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>
                  <span className="field-icon">💱</span>
                  Factor Cambio
                </label>
                <div className="input-prefix">
                  <span className="prefix">Bs</span>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    placeholder="36.50"
                    value={editingProducto?.factor_cambio || ''}
                    onChange={(e) => handleInputChange('factor_cambio', parseFloat(e.target.value) || 0)}
                    className="input-field with-prefix"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview de cálculos */}
          {(precio > 0 || costo > 0) && (
            <div className="calculations-preview">
              <div className="calc-grid">
                <div className="calc-item">
                  <span className="calc-label">Precio en Bs:</span>
                  <span className="calc-value bs">Bs. {precioBs.toFixed(2)}</span>
                </div>
                <div className="calc-item">
                  <span className="calc-label">Margen:</span>
                  <span className={`calc-value ${margen >= 0 ? 'positive' : 'negative'}`}>
                    {margenPorcentaje}% (${margen.toFixed(2)})
                  </span>
                </div>
                {cantidad > 0 && (
                  <div className="calc-item highlight">
                    <span className="calc-label">Ganancia Total:</span>
                    <span className="calc-value positive">${gananciaTotal.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="producto-modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Cancelar
          </button>
          <button 
            className="btn-save"
            onClick={() => onSave(isNew)}
            disabled={!editingProducto?.codigo || !editingProducto?.categoria}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            {isNew ? 'Crear Producto' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoModal;