const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["volunteer", "ngo"],
    },

    location: {
      type: String,
      required: function () {
        return this.role === "ngo";
      },
    },

    Bio: {
      type: String,
    },

    organisationName: {
      type: String,
      required: function () {
        return this.role === "ngo";
      },
    },

    organizationUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
