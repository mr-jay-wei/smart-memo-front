// server.js
import express from "express";

const app = express();
const PORT = 5000;

// 测试接口：返回固定版本号
app.get("/api/version", (req, res) => {
  res.json({ version: "0.0.0" });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`✅ Backend running at http://127.0.0.1:${PORT}`);
});
