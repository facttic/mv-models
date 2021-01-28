const mongoose = require("mongoose");
const { ManifestationDAO } = require("../manifestation/dao");

const HashtagSchema = mongoose.Schema(
  {
    manifestation_id: { type: mongoose.Types.ObjectId, ref: ManifestationDAO },
    name: { type: String, trim: true, required: true },
    source: { type: String, trim: true, required: true, enum: ["twitter, instagram"] },
  },
  { collection: "hashtag" },
);

module.exports = {
  HashtagSchema,
};
