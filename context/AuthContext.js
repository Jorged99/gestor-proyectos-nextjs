import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { loginRequest, registerRequest } from '../lib/api';

export const AuthContext = createContext();

// Rutas públicas que no requieren autenticación
const PUBLIC_PATHS = ['/login', '/register', '/'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  // Recuperar sesión guardada en localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setAuthLoading(false);
  }, []);

  // Protección de rutas: redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !user && !PUBLIC_PATHS.includes(router.pathname)) {
      router.push('/login');
    }
  }, [authLoading, user, router.pathname]);

  // Login usando axios contra la API /api/auth/login
  const login = async (email, password) => {
    const res = await loginRequest(email, password);
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
    router.push('/dashboard');
  };

  // Registro usando axios contra la API /api/auth/register
  const register = async (name, email, password, role) => {
    await registerRequest(name, email, password, role);
    router.push('/login');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};