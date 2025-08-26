const getToken = () => localStorage.getItem("token");
const setToken = (t) => localStorage.setItem("token", t);
const clearToken = () => localStorage.removeItem("token");

async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const t = getToken();
  if (t) headers.Authorization = "Bearer " + t;

  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  // ✅ only read once
  let data;
  try {
    data = await res.json();
  } catch (err) {
    data = { ok: false, error: "Invalid JSON response" };
  }

  if (!res.ok) throw data;
  return data;
}

function requireAuth() {
  if (!getToken()) location.replace("/");
}

async function doLogout() {
  try {
    await fetch("/logout", { method: "POST", headers: { Authorization: "Bearer " + getToken() } });
  } catch {}
  clearToken();
  location.replace("/");
}

function setActive(navId) {
  const a = document.querySelectorAll(".nav a");
  a.forEach(el => el.classList.remove("active"));
  const current = document.getElementById(navId);
  if (current) current.classList.add("active");
}
