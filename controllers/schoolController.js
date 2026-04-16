const db = require("../config/db");

const addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    const sql = `
        INSERT INTO schools (name, address, latitude, longitude)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [name, address, latitude, longitude], (err, result) => {
        if (err) {
            console.log("DB Error:", err);
            return res.status(500).json({
                success: false,
                error: err.message,
            });
        }

        res.status(201).json({
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
            return res.status(500).json({
                success: false,
                error: err.message,
            });
        }

        res.status(200).json(result);
    });
};

module.exports = {
    addSchool,
    listSchools,
};