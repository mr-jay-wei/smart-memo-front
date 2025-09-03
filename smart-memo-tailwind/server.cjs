// server.cjs
const express = require("express");

const app = express();
const PORT = 5000;

app.get("/api/version", (req, res) => {
  res.json({ version: "0.0.0" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
