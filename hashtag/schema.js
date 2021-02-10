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
    collection: "hashtag",
    timestamps: true,
    versionKey: false,
  },
);

module.exports = {
  HashtagSchema,
};
