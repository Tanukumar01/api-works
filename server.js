import express from "express";

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * POST  /api/add
 * Body  { "a": 4, "b": 6 }
 * Returns { "sum": 10 }
 */
app.post("/api/add", (req, res) => {
  const { a, b } = req.body;

  // Basic validation
  if (![a, b].every(Number.isInteger)) {
    return res.status(400).json({ error: "Both a and b must be integers." });
  }

  return res.json({ sum: a + b });
});

/**
 * use the GET request  /ping
 * Used to check if the server is up
 */
app.get("/ping", (req, res) => {
  console.log("Hello Calculator");
  res.status(200).send("Hello Calculator");
});

app.listen(PORT, () =>
  console.log(`Adder API running on http://localhost:${PORT}`)
);
