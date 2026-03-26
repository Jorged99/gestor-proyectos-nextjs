import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* El Navbar ahora es una barra lateral izquierda */}
        <Navbar />
        
        {/* Usamos ml-64 (margin-left) para empujar el contenido hacia la derecha, dejando espacio para el menú */}
        <main className="flex-1 ml-64 w-full">
          <Component {...pageProps} />
        </main>
      </div>
    </AuthProvider>
  );
}
