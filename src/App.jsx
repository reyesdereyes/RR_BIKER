import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Inicio from './pages/Inicio';
import Productos from './pages/Productos';
import Contacto from './pages/Contacto';
import Servicio from './pages/Servicio';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Carrito from './pages/carrito';
import ProductosCategoria from './pages/ProductosCategoria';




function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/inicio' element={<Navigate to="/" replace />} />
        <Route path='/productos' element={<Productos />} />
        <Route path='/catalogo' element={<Navigate to="/productos" replace />} />
        <Route path='/contacto' element={<Contacto />} />
        <Route path='/servicio' element={<Servicio />} />
        <Route path='/productos-categoria' element={<ProductosCategoria />} />
        <Route path='/carrito'element={<Carrito />} />
        {/* Alias plural para evitar errores de navegación */}
        <Route path='/servicios' element={<Navigate to="/servicio" replace />} />
        {/* auth routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App