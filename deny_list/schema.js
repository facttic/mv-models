const mongoose = require("mongoose");

const DenyListSchema = mongoose.Schema(
  {
    // References manifestation who performed moderation
    manifestation_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Manifestation",
      index: true,
    },
    // References user who was banned. Maybe change field name?
    user_id_str: { type: String, trim: true, required: true },
  },
  {
    collection: "deny_list",
    timestamps: true,
    versionKey: false,
    strict: "throw",
  },
);

module.exports = {
  DenyListSchema,
};
