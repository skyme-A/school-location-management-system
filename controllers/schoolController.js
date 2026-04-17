const db = require("../config/db");

/* Add School */
const addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({
      success: false,
      error: "All fields are required",
    });
  }

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

/* List Schools */
const listSchools = (req, res) => {
  const sql = "SELECT * FROM schools ORDER BY id DESC";

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

/* Delete School */
const deleteSchool = (req, res) => {
  const sql = "DELETE FROM schools WHERE id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.log("Delete Error:", err);
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      message: "School deleted successfully",
    });
  });
};

/* Update School */
const updateSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  const sql = `
    UPDATE schools
    SET name=?, address=?, latitude=?, longitude=?
    WHERE id=?
  `;

  db.query(
    sql,
    [name, address, latitude, longitude, req.params.id],
    (err, result) => {
      if (err) {
        console.log("Update Error:", err);
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        message: "School updated successfully",
      });
    }
  );
};

module.exports = {
  addSchool,
  listSchools,
  deleteSchool,
  updateSchool,
};