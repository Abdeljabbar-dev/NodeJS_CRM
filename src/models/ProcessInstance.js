const mongoose = require("mongoose");
const ProcessInstance = new mongoose.Schema(
  {
    teamId: { type: String, trim: true, default: "" },
    processId: { type: String, trim: true, default: "" },
    status: { type: String, trim: true, default: "" },
    activities: [{ activityId: { type: String, trim: true, default: "" } }],
    messages: [
      {
        UserorId: { type: String, trim: true, default: "" },
        userId: { type: String, trim: true, default: "" },
        type: { type: String, trim: true, default: "" },
        content: { type: String, trim: true, default: "" },
        created_at: { type: Date },
      },
    ],
    media: [
      {
        name: { type: String, trim: true, default: "" },
        type: { type: String, trim: true, default: "" },
        url: { type: String, trim: true, default: "" },
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("ProcessInstance", ProcessInstance);
