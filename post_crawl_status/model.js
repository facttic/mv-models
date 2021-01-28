const mongoose = require("mongoose");
const { ManifestationDAO } = require("../manifestation/dao");

const PostCrawlStatusSchema = mongoose.Schema(
  {
    post_id_str: { type: String, trim: true, required: true, index: true },
    post_created_at: { type: String, trim: true, required: true },
    hashtag: { type: String, trim: true },
    source: { type: String, trim: true, required: true, enum: ["twitter", "instagram"] },
    manifestation_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: ManifestationDAO,
      index: true,
    },
  },
  { collection: "post_crawl_status" },
);

module.exports = {
  PostCrawlStatusSchema,
};
