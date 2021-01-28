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
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: "Invalid Email address" });
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
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  },
  { collection: "user" },
);

module.exports = {
  UserSchema,
};
