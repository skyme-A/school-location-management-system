const db = require("../config/db");

const addSchool = (req, res) => {
    const { name, latitude, longitude } = req.body;

    const sql =
        "INSERT INTO schools (name, latitude, longitude) VALUES (?, ?, ?)";

    db.query(sql, [name, latitude, longitude], (err, result) => {
        if (err) {
            console.log("DB Error:", err);
            return res.status(500).json(err);
        }

        res.json({
            success: true,
            message: "School added successfully",
        });
    });
};

const listSchools = (req, res) => {
    const sql = "SELECT * FROM schools";

    db.query(sql, (err, result) => {
        if (err) {
            console.log("DB Error:", err);
            return res.status(500).json(err);
        }

        res.json(result);
    });
};

module.exports = {
    addSchool,
    listSchools,
};