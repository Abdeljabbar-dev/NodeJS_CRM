const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const User = require("../models/User");

const Team = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      required: true,
      // unique: true
      uppercase: true
    },
    members: [
      {
        userId: String,
        role: String,
        isManager: Boolean
      }
    ],
    type: { type: String, trim: true, default: "", uppercase: true },
    logo: { type: String, trim: true, default: "" },
    slogan: { type: String, trim: true, default: "" },
    industry: { type: String, trim: true, default: "", uppercase: true },
    tags: [],
    activities: [{ activityId: { type: String, trim: true, default: "" } }],
    valueProp: { type: String, trim: true, default: "" },
    problem: { type: String, trim: true, default: "" },
    solution: { type: String, trim: true, default: "" },
    traction: { type: String, trim: true, default: "" },
    stage: { type: String, trim: true, default: "", uppercase: true },
    stage: { type: String, trim: true, default: "", uppercase: true },
    state: { type: String, trim: true, default: "" },
    published: { type: Boolean, default: false },
    lang: { type: String, default: "EN" },
    collaborators: [
      {
        collaboratorId: String,
        started_at: String,
        infos: String
      }
    ],
    media: [
      {
        name: { required: true, trim: true, type: String, default: "" },
        type: { required: true, trim: true, type: String, default: "" },
        url: { required: true, trim: true, type: String, default: "" }
      }
    ],
    order: Number,
    telephone: { trim: true, type: String, default: "" },
    address: { trim: true, type: String, default: "" },
    website: { trim: true, type: String, default: "" },
    video: { trim: true, type: String, default: "" },

    country: { trim: true, type: String, default: "" },
    city: { trim: true, type: String, default: "" }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Team", Team);
