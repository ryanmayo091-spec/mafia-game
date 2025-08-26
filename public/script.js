// ---- Elements ----
const $ = (id) => document.getElementById(id);
const userInput = $("user");
const passInput = $("pass");
const tokenBox  = $("tokenBox");
const output    = $("output");

// Buttons (optional if you wire up onclicks in HTML)
const btnRegister = $("btn-register");
const btnLogin    = $("btn-login");
const btnLogout   = $("btn-logout");
const btnProfile  = $("btn-profile");
const btnCrime    = $("btn-crime");

// ---- State ----
let token = null;

// ---- Helpers ----
function setOutput(data) {
  output.textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  tokenBox.textContent = token || "(none)";
}

async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = "Bearer " + token;

  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  // try to parse JSON, fall back to text
  let data;
  try { data = await res.json(); } catch { data = await res.text(); }
  if (!res.ok) throw data;
  return data;
}

// ---- Actions ----
async function register() {
  const username = userInput.value.trim();
  const password = passInput.value.trim();
  if (!username || !password) return setOutput("Please enter username and password.");
  try {
    const data = await api("/register", { method: "POST", body: { username, password } });
    setOutput(data);
  } catch (err) {
    setOutput(err);
  }
}

async function login() {
  const username = userInput.value.trim();
  const password = passInput.value.trim();
  if (!username || !password) return setOutput("Please enter username and password.");
  try {
    const data = await api("/login", { method: "POST", body: { username, password } });
    if (data && data.token) token = data.token;
    setOutput(data);
  } catch (err) {
    setOutput(err);
  }
}

async function logout() {
  if (!token) return setOutput("Not logged in.");
  try {
    const data = await api("/logout", { method: "POST" });
    token = null;
    setOutput(data);
  } catch (err) {
    setOutput(err);
  }
}

async function profile() {
  try {
    const data = await api("/profile");
    setOutput(data);
  } catch (err) {
    setOutput(err);
  }
}

async function crime() {
  try {
    const data = await api("/crime", { method: "POST" });
    setOutput(data);
  } catch (err) {
    setOutput(err);
  }
}

// ---- Hook up buttons if they exist ----
if (btnRegister) btnRegister.addEventListener("click", register);
if (btnLogin)    btnLogin.addEventListener("click", login);
if (btnLogout)   btnLogout.addEventListener("click", logout);
if (btnProfile)  btnProfile.addEventListener("click", profile);
if (btnCrime)    btnCrime.addEventListener("click", crime);

// Initial UI
setOutput("Ready.");
