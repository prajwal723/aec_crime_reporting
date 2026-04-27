const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, default: "Pending" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Report", ReportSchema);
