const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { listSchools } = require("../controllers/schoolController");

router.post("/addSchool", async (req, res) => {
    try {
        const { name, latitude, longitude } = req.body;

        const sql =
            "INSERT INTO schools (name, latitude, longitude) VALUES (?, ?, ?)";

        db.query(sql, [name, latitude, longitude], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                message: "School added successfully"
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
router.get("/listSchools", listSchools);

module.exports = router;