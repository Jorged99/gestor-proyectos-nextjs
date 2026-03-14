import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Revisar si hay un usuario en localStorage al cargar la app
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (router.pathname !== '/login') {
      router.push('/login');
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Petición a JSON Server para validar
      const response = await axios.get(`http://localhost:3001/users?email=${email}&password=${password}`);
      if (response.data.length > 0) {
        const loggedUser = response.data[0];
        setUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        router.push('/dashboard');
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      console.error("Error en login", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};