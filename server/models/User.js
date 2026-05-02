const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginCount: { type: Number, default: 0 },
  lastLoginAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
