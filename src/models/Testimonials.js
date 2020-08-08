const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const uuid = require("uuid/v4");
const TestimonialsSchema = new Schema(
  {
    name: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
    video: { type: String, trim: true, default: "" },
    quotes: { type: String, trim: true, default: "" },
    profile: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    tags: [],
    lang: { type: String, default: "EN" }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = Testimonials = mongoose.model(
  "Testimonials",
  TestimonialsSchema
);
