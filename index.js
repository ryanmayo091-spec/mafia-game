const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware so we can read JSON data
app.use(express.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "public")));

// Example routes (you can expand later)
app.post("/login", (req, res) => {
  // Dummy login route
  res.json({ success: true, message: "Logged in!" });
});

app.get("/profile", (req, res) => {
  // Dummy profile route
  res.json({ name: "Player1", coins: 100, level: 1 });
});

app.post("/crime", (req, res) => {
  // Dummy crime route
  res.json({ success: true, message: "You did a crime and earned 50 coins!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
