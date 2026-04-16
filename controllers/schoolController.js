const db = require("../config/db");

exports.addSchool = (req, res) => {
    const { name, latitude, longitude } = req.body;

    const sql = "INSERT INTO schools (name, latitude, longitude) VALUES (?, ?, ?)";

    db.query(sql, [name, latitude, longitude], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "School added successfully" });
    });
};

exports.listSchools = (req, res) => {
    const userLat = parseFloat(req.query.latitude) || 28.7041;
    const userLng = parseFloat(req.query.longitude) || 77.1025;

    db.query("SELECT * FROM schools", (err, result) => {
        if (err) return res.status(500).json(err);

        const schoolsWithDistance = result.map((school) => {
            const distance = Math.sqrt(
                Math.pow(userLat - school.latitude, 2) +
                Math.pow(userLng - school.longitude, 2)
            );

            return {
                ...school,
                distance,
            };
        });

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json(schoolsWithDistance);
    });
};