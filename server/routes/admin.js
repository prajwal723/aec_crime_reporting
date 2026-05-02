const express = require("express");
const User = require("../models/User");
const Report = require("../models/Report");

const router = express.Router();

function requireAdmin(req, res, next) {
  const authHeader = req.header("Authorization") || "";
  if (authHeader !== "Bearer admin") {
    return res.status(401).json({ msg: "Admin access denied" });
  }
  next();
}

router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [totalUsers, recentLoginUsers, totalLoginAgg, totalPosts, recentPosts, topLocations] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastLoginAt: { $gte: since } }),
      User.aggregate([{ $group: { _id: null, total: { $sum: "$loginCount" } } }]),
      Report.countDocuments(),
      Report.countDocuments({ createdAt: { $gte: since } }),
      Report.aggregate([
        { $match: { location: { $exists: true, $ne: "" } } },
        { $group: { _id: "$location", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    return res.json({
      totalUsers,
      loginsLast24Hours: recentLoginUsers,
      totalLogins: totalLoginAgg[0]?.total || 0,
      postsLast24Hours: recentPosts,
      totalPosts,
      topLocations: topLocations.map((item) => ({ location: item._id, count: item.count }))
    });
  } catch (err) {
    console.error("Admin stats error:", err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;