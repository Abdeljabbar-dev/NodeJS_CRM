const mongoose = require("mongoose");
const Label = new mongoose.Schema(
  {
    id: String,
    name: { type: String, trim: true, default: "" },
    type: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Label", Label);
