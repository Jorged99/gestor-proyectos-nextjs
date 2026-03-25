import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    role: 'usuario',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Completa todos los campos.');
      return;
    }
    if (form.password.length < 3) {
      setError('La contraseña debe tener al menos 3 caracteres.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      setSuccess('Cuenta creada. Redirigiendo al inicio de sesión...');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear Cuenta</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 text-sm rounded">
            {success}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
          <input
            type="text"
            name="name"
            placeholder="Tu nombre"
            className="w-full p-2 border rounded text-black focus:outline-none focus:border-blue-500"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="correo@ejemplo.com"
            className="w-full p-2 border rounded text-black focus:outline-none focus:border-blue-500"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Mínimo 3 caracteres"
            className="w-full p-2 border rounded text-black focus:outline-none focus:border-blue-500"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
          <input
            type="password"
            name="confirm"
            placeholder="Repite tu contraseña"
            className="w-full p-2 border rounded text-black focus:outline-none focus:border-blue-500"
            value={form.confirm}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
          <select
            name="role"
            className="w-full p-2 border rounded text-black focus:outline-none focus:border-blue-500"
            value={form.role}
            onChange={handleChange}
          >
            <option value="usuario">Usuario</option>
            <option value="gerente">Gerente</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {loading ? 'Registrando...' : 'Crear Cuenta'}
        </button>

        <p className="text-center text-gray-600 text-sm mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
