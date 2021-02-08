const mongoose = require("mongoose");

const HashtagSchema = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    source: { type: String, trim: true, required: true, enum: ["twitter", "instagram"] },
  },
  {
    collection: "hashtag",
    timestamps: true,
  },
);

module.exports = {
  HashtagSchema,
};
