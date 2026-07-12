// Tum backend istekleri buradan gecer.
const BASE = "/api";

function authHeaders() {
  const token = localStorage.getItem("exoteak_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Bir hata olustu");
  }
  return res.json();
}

export const api = {
  // Public
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${BASE}/products${qs ? `?${qs}` : ""}`).then(handle);
  },
  getProduct: (slug) => fetch(`${BASE}/products/${slug}`).then(handle),
  getCategories: () => fetch(`${BASE}/categories`).then(handle),

  // Auth
  login: (email, password) =>
    fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(handle),

  // Admin (korumali)
  createProduct: (data) =>
    fetch(`${BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then(handle),
  updateProduct: (id, data) =>
    fetch(`${BASE}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then(handle),
  deleteProduct: (id) =>
    fetch(`${BASE}/products/${id}`, { method: "DELETE", headers: authHeaders() }).then(handle),
  createCategory: (name) =>
    fetch(`${BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ name }),
    }).then(handle),
  uploadImage: (file) => {
    const fd = new FormData();
    fd.append("image", file);
    return fetch(`${BASE}/upload`, { method: "POST", headers: authHeaders(), body: fd }).then(handle);
  },
};

export const formatPrice = (n) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n || 0);
