const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

const messages = [
  {
    id: 1,
    author: "Docker",
    text: "Backend container is ready.",
    createdAt: new Date().toISOString()
  }
];

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "server",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/messages", (req, res) => {
  res.json({ messages });
});

app.post("/api/messages", (req, res) => {
  const author = String(req.body.author || "Student").trim();
  const text = String(req.body.text || "").trim();

  if (!text) {
    return res.status(400).json({ error: "Message text is required." });
  }

  const message = {
    id: messages.length + 1,
    author,
    text,
    createdAt: new Date().toISOString()
  };

  messages.push(message);
  return res.status(201).json({ message });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
