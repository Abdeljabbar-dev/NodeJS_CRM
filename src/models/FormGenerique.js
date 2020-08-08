const mongoose = require("mongoose");
const FormGenerique = new mongoose.Schema(
  {
    InputText: [
      {
        name: { type: String, trim: true, default: "" },
        type: { type: String, trim: true, default: "" }
      }
    ],
    InputSelect: [
      {
        nameS: { type: String, trim: true, default: "" },
        option1: { type: String, trim: true, default: "" },
        option2: { type: String, trim: true, default: "" },

        option3: { type: String, trim: true }
      }
    ],
    InputCheck: [
      {
        typeC: { type: String, trim: true, default: "" },
        nameC: { type: String, trim: true, default: "" },
        optionC1: { type: String, trim: true, default: "" },
        optionC2: { type: String, trim: true, default: "" }
      }
    ],
    Nom: { type: String, trim: true, default: "" },
    Description: { type: String, trim: true, default: "" }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("FormGenerique", FormGenerique);
