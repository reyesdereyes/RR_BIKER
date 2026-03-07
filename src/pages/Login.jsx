import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../conf/supabase';
import '../css/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isRegistering, setIsRegistering] = useState(false);
  const [nombre, setNombre] = useState('');
  const [session, setSession] = useState(null);
  const formRef = useRef(null);
  const navigate = useNavigate();

  // Efecto de partículas rojas y líneas de energía
  useEffect(() => {
    const createEffects = () => {
      const container = document.querySelector('.login-container');
      if (!container) return;
      
      // Limpiar efectos existentes
      const existingParticles = container.querySelector('.particles');
      const existingLines = container.querySelector('.energy-lines');
      if (existingParticles) existingParticles.remove();
      if (existingLines) existingLines.remove();

      // Crear partículas de chispas
      const particlesContainer = document.createElement('div');
      particlesContainer.className = 'particles';
      
      for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
      }
      
      container.appendChild(particlesContainer);

      // Crear líneas de energía
      const linesContainer = document.createElement('div');
      linesContainer.className = 'energy-lines';
      
      for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'energy-line';
        line.style.left = (20 + i * 15) + '%';
        line.style.animationDelay = (i * 1.5) + 's';
        linesContainer.appendChild(line);
      }
      
      container.appendChild(linesContainer);
    };

    createEffects();
  }, []);

  // Efecto de tilt en el formulario
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!formRef.current) return;
      
      const rect = formRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 25;
      const y = (e.clientY - rect.top - rect.height / 2) / 25;
      
      setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    const form = formRef.current;
    if (form) {
      form.addEventListener('mousemove', handleMouseMove);
      form.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (form) {
        form.removeEventListener('mousemove', handleMouseMove);
        form.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Verificar sesión
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session && !isRegistering) {
        navigate('/admin');
      }
    };
    checkSession();
  }, [navigate, isRegistering]);

  // Efecto de onda roja en inputs
  const createRipple = (e) => {
    const input = e.target;
    const rect = input.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = 20;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    ripple.classList.add('ripple');
    
    const wrapper = input.parentElement;
    if (wrapper && wrapper.classList.contains('input-wrapper')) {
      wrapper.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Animación de éxito roja
      if (formRef.current) {
        formRef.current.classList.add('success-animation');
      }
      
      setTimeout(() => {
        navigate('/admin');
      }, 500);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Crear usuario en Authentication de Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Insertar en la tabla administradores
      const { error: dbError } = await supabase
        .from('administradores')
        .insert([
          {
            id: authData.user.id,
            nombre: nombre,
            correo: email,
            contrasena: password, // Nota: en producción considera no guardar esto
            contrasena_hash: 'managed_by_supabase_auth'
          }
        ]);

      if (dbError) throw dbError;

      // Éxito
      if (formRef.current) {
        formRef.current.classList.add('success-animation');
      }
      
      setTimeout(() => {
        setIsRegistering(false);
        setNombre('');
        setEmail('');
        setPassword('');
        setLoading(false);
        alert('Administrador creado exitosamente');
      }, 500);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Si hay sesión activa, mostrar opción de registro
  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
    setError(null);
    setNombre('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-container">
      <form 
        ref={formRef}
        className="login-form" 
        onSubmit={isRegistering ? handleRegister : handleLogin}
        style={{
          transform: `perspective(1000px) rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg) translateY(${mousePosition.y * 0.5}px)`
        }}
      >
        <h2>{isRegistering ? 'Registrar Administrador' : 'Iniciar sesión'}</h2>
        
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {isRegistering && (
          <div className="input-wrapper">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onClick={createRipple}
              placeholder="Nombre del administrador"
              required
            />
          </div>
        )}

        <div className="input-wrapper">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onClick={createRipple}
            placeholder="tu@email.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onClick={createRipple}
            placeholder="••••••••"
            required
            autoComplete={isRegistering ? "new-password" : "current-password"}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={loading ? 'loading' : ''}
        >
          {loading ? 'Cargando...' : (isRegistering ? 'Crear Administrador' : 'Entrar')}
        </button>

        {/* Solo mostrar toggle si hay sesión activa */}
        {session && (
          <div className="register-toggle">
            <button 
              type="button" 
              className="toggle-btn"
              onClick={toggleRegister}
            >
              {isRegistering ? '← Volver al Login' : '+ Registrar nuevo administrador'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;