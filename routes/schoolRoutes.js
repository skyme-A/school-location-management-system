const express = require("express");
const router = express.Router();

const {
  addSchool,
  listSchools,
  deleteSchool,
  updateSchool,
} = require("../controllers/schoolController");

router.post("/addSchool", addSchool);
router.get("/listSchools", listSchools);
router.delete("/deleteSchool/:id", deleteSchool);
router.put("/updateSchool/:id", updateSchool);

module.exports = router;