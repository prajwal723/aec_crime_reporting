const express = require("express");
const mongoose = require("mongoose");
const Report = require("../models/Report");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { title, description, category, location, image } = req.body;
    const report = await Report.create({
      title, description, category, location,
      image: image || "",
      userId: req.user.id
    });
    return res.status(201).json(report);
  } catch (err) {
    console.error("Submit error:", err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/all", auth, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(reports);
  } catch (err) {
    console.error("Fetch error:", err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

router.put("/like/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const reportId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ msg: "Invalid report ID" });
    }

    const report = await Report.findById(reportId).lean();
    if (!report) return res.status(404).json({ msg: "Not found" });

    const likes = (report.likes || []).map(id => id.toString());
    const alreadyLiked = likes.includes(userId);

    await Report.updateOne(
      { _id: reportId },
      alreadyLiked
        ? { $pull: { likes: new mongoose.Types.ObjectId(userId) } }
        : { $addToSet: { likes: new mongoose.Types.ObjectId(userId) } }
    );

    const fresh = await Report.findById(reportId).select("likes").lean();
    const updatedLikes = (fresh.likes || []).map(id => id.toString());

    return res.status(200).json(updatedLikes);
  } catch (err) {
    console.error("Like error:", err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/comment/:id", auth, async (req, res) => {
  try {
    const { text } = req.body;
    const reportId = req.params.id;

    if (!text || !text.trim()) {
      return res.status(400).json({ msg: "Comment text required" });
    }
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ msg: "Invalid report ID" });
    }

    const commenter = await User.findById(req.user.id).select("name").lean();
    const name = commenter ? commenter.name : "Anonymous";

    await Report.updateOne(
      { _id: reportId },
      {
        $push: {
          comments: {
            userId: new mongoose.Types.ObjectId(req.user.id),
            name,
            text: text.trim(),
            createdAt: new Date()
          }
        }
      }
    );

    const fresh = await Report.findById(reportId).select("comments").lean();
    return res.status(200).json(fresh.comments || []);
  } catch (err) {
    console.error("Comment error:", err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
