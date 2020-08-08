const mongoose = require("mongoose");
const CollaboratorSchema = new mongoose.Schema(
  {
    nameC: { type: String, required: true },
    description: { type: String },
    industryId: { type: String },
    roleId: { type: String },

    media: [
      {
        created_at: { type: String, trim: true, default: "" },
        name: { type: String, trim: true, default: "" },
        type: { type: String, trim: true, default: "" },
        url: { type: String, trim: true, default: "" },
        logo: { type: String, trim: true, default: "" }
      }
    ]
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Collaborator", CollaboratorSchema);
