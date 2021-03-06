const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    post_created_at: { type: Number, trim: true, required: true, index: true },
    post_id_str: { type: String, trim: true, required: true, index: true },
    full_text: { type: String, trim: true },
    hashtags: {
      type: [{ type: String, trim: true }],
      required: true,
    },
    media: {
      type: [
        {
          media_url: { type: String, trim: true },
          media_url_https: { type: String, trim: true },
          media_url_thumb: { type: String, trim: true },
          media_url_small: { type: String, trim: true },
          media_url_medium: { type: String, trim: true },
          media_url_large: { type: String, trim: true },
          sizes: {},
        },
      ],
      required: true,
    },
    user: {
      id_str: { type: String, trim: true, required: true, index: true },
      name: { type: String, trim: true },
      screen_name: { type: String, trim: true },
      location: { type: String, trim: true },
      profile_image_url: { type: String, trim: true },
      profile_image_url_https: { type: String, trim: true },
    },
    source: { type: String, trim: true, required: true },
    geo: {},
    coordinates: {},
    manifestation_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Manifestation",
      index: true,
    },
  },
  {
    collection: "post",
    timestamps: true,
    versionKey: false,
    strict: "throw",
  },
);

module.exports = {
  PostSchema,
};
