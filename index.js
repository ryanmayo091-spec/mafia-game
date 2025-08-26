const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===== In-memory "database" (resets on each deploy/restart) =====
const users = {};           // { username: { password, level, money } }
const tokens = {};          // { token: username }

// ---- helpers ----
function makeToken() {
  return crypto.randomBytes(16).toString("hex");
}
function getUserFromAuth(req) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || !tokens[token]) return null;
  const username = tokens[token];
  return users[username] ? { username, ...users[username] } : null;
}

// ===== Routes =====

// Register: { username, password }
app.post("/register", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ ok: false, error: "Username and password required" });

  if (users[username])
    return res.status(409).json({ ok: false, error: "Username already exists" });

  users[username] = { password, level: 1, money: 100 };
  return res.json({ ok: true, message: "Registered! You can now log in." });
});

// Login: returns a token
app.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  const user = users[username];
  if (!user || user.password !== password)
    return res.status(401).json({ ok: false, error: "Invalid username or password" });

  const token = makeToken();
  tokens[token] = username;
  return res.json({ ok: true, token, message: "Login successful" });
});

// Profile (requires token)
app.get("/profile", (req, res) => {
  const user = getUserFromAuth(req);
  if (!user) return res.status(401).json({ ok: false, error: "Not logged in" });

  const { password, ...safe } = user; // hide password
  res.json({ ok: true, profile: safe });
});

// Crime (requires token) – 50/50 success
app.post("/crime", (req, res) => {
  const user = getUserFromAuth(req);
  if (!user) return res.status(401).json({ ok: false, error: "Not logged in" });

  const success = Math.random() < 0.5;
  const delta = success ? 50 : -30;
  users[user.username].money += delta;

  res.json({
    ok: true,
    success,
    message: success ? "You pulled off the heist! 💰 +50" : "Busted! 👮 -30",
    money: users[user.username].money
  });
});

// Logout (optional)
app.post("/logout", (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token) delete tokens[token];
  res.json({ ok: true, message: "Logged out" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server on ${PORT}`);
});
