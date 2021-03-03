const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: async function (value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email address");
        }
        const user = this.constructor.findByEmail && (await this.constructor.findByEmail(value));
        if (user && this._id.toString() !== user._id.toString()) {
          throw new Error("Email is in use");
        }
      },
    },
    password: { type: String, required: true, minLength: 7 },
    tokens: [
      {
        token: { type: String, required: true },
      },
    ],
    superadmin: { type: Boolean, default: false },
    manifestation_id: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Manifestation",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  },
);

module.exports = {
  UserSchema,
};
