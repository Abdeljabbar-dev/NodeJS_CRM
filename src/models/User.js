const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  method: {
    type: String,
    enum: ["local", "google", "facebook", "users"],
    default: "local",
    required: true
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String
    }
  },
  google: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },

  users: {
    email: {
      type: String,
      default: ""
    },

    firstName: {
      type: String,
      default: ""
    },
    lastName: {
      type: String,
      default: ""
    },
    tel: {
      type: String
    },
    location: {
      type: String
    },
    gender: {
      type: String
    },
    image: {
      type: String
    }
  }
});

UserSchema.pre("save", async function(next) {
  try {
    if (this.method !== "local") {
      next();
    }
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(this.local.password, salt);
    // Re-assign hashed version over original, plain text password
    this.local.password = passwordHash;

    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = User = mongoose.model("User", UserSchema);
