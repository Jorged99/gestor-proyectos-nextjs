import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const AuthContext = createContext();

// Nuestros datos simulados para que funcione en Vercel
const MOCK_USERS = [
  { id: 1, email: "gerente@empresa.com", password: "123", role: "gerente", name: "Admin" },
  { id: 2, email: "usuario@empresa.com", password: "123", role: "usuario", name: "Empleado" }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (router.pathname !== '/login') {
      router.push('/login');
    }
  }, []);

  const login = (email, password) => {
    const loggedUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (loggedUser) {
      setUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      router.push('/dashboard');
    } else {
      alert('Credenciales incorrectas');
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