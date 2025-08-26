const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/game", (_req, res) => res.sendFile(path.join(__dirname, "public", "game.html")));
app.get("/robbery", (_req, res) => res.sendFile(path.join(__dirname, "public", "robbery.html")));
app.get("/nightlife", (_req, res) => res.sendFile(path.join(__dirname, "public", "nightlife.html")));
app.get("/benefits", (_req, res) => res.sendFile(path.join(__dirname, "public", "benefits.html")));

app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));
