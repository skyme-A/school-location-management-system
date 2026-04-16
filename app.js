const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const schoolRoutes = require("./routes/schoolRoutes");
app.use("/api", schoolRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "API Running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});