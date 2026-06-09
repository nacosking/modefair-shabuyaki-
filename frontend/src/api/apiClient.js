import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,          // Send HttpOnly refresh-token cookie
  headers: { 'Content-Type': 'application/json' },
});

// ── Token storage (in-memory — never localStorage for JWTs) ──────────────────
let accessToken = null;

export const setAccessToken = (token) => { accessToken = token; };
export const clearAccessToken = () => { accessToken = null; };
export const getAccessToken = () => accessToken;

// ── Request interceptor — attach Bearer token ─────────────────────────────────
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ── Response interceptor — auto-refresh on 401 ───────────────────────────────
let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh once per failed request
    if (
      error.response?.status === 401 &&
      !originalRequest._retried &&
      !originalRequest.url.includes('/api/auth/')
    ) {
      if (isRefreshing) {
        // Queue subsequent 401s until refresh completes
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retried = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/api/auth/refresh');
        const newToken = data.data.accessToken;
        setAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        // Trigger logout event so AuthContext can react
        window.dispatchEvent(new Event('auth:session-expired'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── API methods ───────────────────────────────────────────────────────────────

// Auth
export const authApi = {
  login:   (creds) => api.post('/api/auth/login', creds),
  refresh: ()      => api.post('/api/auth/refresh'),
  logout:  ()      => api.post('/api/auth/logout'),
};

// Public
export const publicApi = {
  getMenu:   ()        => api.get('/api/menu'),
  checkout:  (payload) => api.post('/api/orders/checkout', payload),
};

// Admin — Menu
export const adminMenuApi = {
  getAll:          ()           => api.get('/api/admin/menu'),
  getById:         (id)         => api.get(`/api/admin/menu/${id}`),
  create:          (body)       => api.post('/api/admin/menu', body),
  update:          (id, body)   => api.put(`/api/admin/menu/${id}`, body),
  softDelete:      (id)         => api.delete(`/api/admin/menu/${id}`),
  restore:         (id)         => api.put(`/api/admin/menu/${id}/restore`),
  getCategories:   ()           => api.get('/api/admin/categories'),
  createCategory:  (body)       => api.post('/api/admin/categories', body),
  updateCategory:  (id, body)   => api.put(`/api/admin/categories/${id}`, body),
};

// Admin — Tables
export const adminTableApi = {
  getAll:        ()           => api.get('/api/admin/tables'),
  updateStatus:  (id, status) => api.put(`/api/admin/tables/${id}/status`, { status }),
};

// Admin — Orders
export const adminOrderApi = {
  getByTable:      (tableId)        => api.get(`/api/admin/orders/table/${tableId}`),
  getById:         (id)             => api.get(`/api/admin/orders/${id}`),
  updateStatus:    (id, status)     => api.put(`/api/admin/orders/${id}/status`, { status }),
  updatePrepStatus:(itemId, status) => api.put(`/api/admin/order-items/${itemId}/prep-status`, { prepStatus: status }),
  splitCheck:      (id, payload)    => api.post(`/api/admin/orders/${id}/split`, payload),
};

export default api;
