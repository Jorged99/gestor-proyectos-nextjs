import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// --- Auth ---
export const loginRequest = (email, password) =>
  api.post('/auth/login', { email, password });

export const registerRequest = (name, email, password, role) =>
  api.post('/auth/register', { name, email, password, role });

// --- Proyectos ---
export const getProjects = () => api.get('/projects');
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// --- Tareas ---
export const getTasks = (params) => api.get('/tasks', { params });
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// --- Usuarios (para asignar tareas) ---
export const getUsers = () => api.get('/users');
