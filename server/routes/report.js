const express = require("express");
const Report = require("../models/Report");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { title, description, category, location, image } = req.body;
    const newReport = new Report({
      title,
      description,
      category,
      location,
      image,
      userId: req.user.id
    });

    const report = await newReport.save();
    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
