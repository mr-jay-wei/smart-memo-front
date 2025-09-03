// server.js
import express from "express";
import fs from "fs";

const app = express();
const PORT = 5000; // 后端监听端口

// API: 返回项目版本号
app.get("/api/version", (req, res) => {
  const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
  res.json({ version: pkg.version });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
