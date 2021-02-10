const mongoose = require("mongoose");

const HashtagSchema = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    source: { type: String, trim: true, required: true, enum: ["twitter", "instagram"] },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  },
);

module.exports = {
  HashtagSchema,
};
