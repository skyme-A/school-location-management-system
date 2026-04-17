const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

db.query(`
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  address VARCHAR(255),
  latitude FLOAT,
  longitude FLOAT
)
`, (err) => {
  if (err) {
    console.error("Table creation error:", err);
  } else {
    console.log("Schools table ready");
  }
});

const schoolRoutes = require("./routes/schoolRoutes");
app.use("/api", schoolRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "API Running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});