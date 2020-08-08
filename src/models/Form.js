const mongoose = require("mongoose");
const Form = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    url: { type: String, trim: true, default: "" },
    activityId: { type: String, trim: true, default: "" },
    updated_at: { type: Date, trim: true, default: "" },
    created_at: { type: Date, trim: true, default: new Date() }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Form", Form);
