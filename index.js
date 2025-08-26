const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Simple homepage
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Mafia Game 🎭</h1><p>Game coming soon...</p>");
});

app.listen(PORT, () => {
  console.log(`Mafia Game running on http://localhost:${PORT}`);
});
