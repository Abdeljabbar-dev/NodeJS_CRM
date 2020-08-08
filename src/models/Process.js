const mongoose = require("mongoose");

const Process = new mongoose.Schema(
  {
    id: String,
    isRequired: Boolean,
    name: String,
    description: String,
    start_date: Date,
    end_date: Date,
    requirements: String,
    activityId: String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

//EXPORT MODEL
module.exports = mongoose.model("Process", Process);
