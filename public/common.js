// Token helpers
const getToken = () => localStorage.getItem("token");
const setToken = (t) => localStorage.setItem("token", t);
const clearToken = () => localStorage.removeItem("token");

// Simple API wrapper
async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const t = getToken();
  if (t) headers.Authorization = "Bearer " + t;

  const res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

// Guard: redirect to login if no token
function requireAuth() {
  if (!getToken()) location.replace("/");
}

// Logout everywhere
async function doLogout() {
  try { await fetch("/logout", { method:"POST", headers:{ Authorization:"Bearer "+getToken() }}); } catch {}
  clearToken();
  location.replace("/");
}

// Navbar active link
function setActive(navId) {
  const a = document.querySelectorAll(".nav a");
  a.forEach(el => el.classList.remove("active"));
  const current = document.getElementById(navId);
  if (current) current.classList.add("active");
}
