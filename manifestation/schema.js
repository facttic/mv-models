const mongoose = require("mongoose");
const { HashtagSchema } = require("../hashtag/schema");

const ManifestationSchema = mongoose.Schema(
  {
    active: { type: Boolean, default: true },
    name: { type: String, trim: true, required: true },
    uri: { type: String, trim: true, required: true },
    title: { type: String, trim: true, default: "" },
    subtitle: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    footer: { type: String, trim: true, default: "" },
    sponsors: [
      {
        name: { type: String, trim: true, required: true },
        logoUri: { type: String, trim: true, required: true },
        pageUri: { type: String, trim: true, required: true },
      },
    ],
    hashtags: [
      {
        // nota: hashtags en IG incluyen # y en TW no
        // TODO: normalizar todo sin almohadita
        type: HashtagSchema,
        required: true,
      },
    ],
    metadata: {
      title: { type: String, trim: true, default: "" },
      keywords: { type: String, trim: true, default: "" },
      description: { type: String, trim: true, default: "" },
    },
    crawlStatuses: [
      {
        post_id_str: { type: String, trim: true, required: true, index: true },
        post_created_at: { type: String, trim: true, required: true },
        hashtag: { type: String, trim: true },
        source: { type: String, trim: true, required: true, enum: ["twitter", "instagram"] },
      },
    ],
    // podemos evaluarlo, pero por ahora no lo vamos a usar.
    // stylesOverride: { type: String, trim: true, required: true },
    styles: {
      colors: {
        background: { type: String, trim: true, default: "" },
        // se usará para texto: links, hashtags
        accent: { type: String, trim: true, default: "" },
      },
      text: {
        title: {
          font: { type: String, trim: true, default: "" },
          color: { type: String, trim: true, default: "" },
        },
        subtitle: {
          font: { type: String, trim: true, default: "" },
          color: { type: String, trim: true, default: "" },
        },
        // se usará para text de cards posts body
        body: {
          font: { type: String, trim: true, default: "" },
          color: { type: String, trim: true, default: "" },
        },
      },
      thumbnails: {
        // TODO: habría un map entre cantidad de columnas y tamaños
        // 7: columnas 500px x 500px
        columns: { type: Number, enum: [7, 8, 9, 10], default: 7 },
        colors: {
          hover: { type: String, trim: true, default: "" },
          border: { type: String, trim: true, default: "" },
        },
      },
      cards: {
        darkMode: { type: Boolean, default: false },
      },
    },
    images: {
      header: {
        src: { type: String, trim: true, default: "" },
      },
      favicon: {
        src: { type: String, trim: true, default: "" },
      },
      og: {
        twitter: {
          src: { type: String, trim: true, default: "" },
        },
        facebook: {
          src: { type: String, trim: true, default: "" },
        },
      },
      background: {
        src: { type: String, trim: true, default: "" },
      },
    },
    config: {
      twitter: {
        active: { type: Boolean, default: false },
        scheduleSchema: { type: String, default: "*/20 * * * *" },
        maxTweets: { type: Number, default: 1400 },
        maxTweetsPerQuery: { type: Number, default: 100 },
        api: {
          consumerKey: { type: String },
          consumerSecret: { type: String },
          accessTokenKey: { type: String },
          accessTokenSecret: { type: String },
        },
      },
      instagram: {
        active: { type: Boolean, default: false },
        scheduleSchema: { type: String, default: "*/20 * * * *" },
        maxPosts: { type: Number, default: 1400 },
        impersonate: {
          username: { type: String },
          password: { type: String },
        },
      },
      mediaCleaner: {
        active: { type: Boolean, default: false },
        scheduleSchema: { type: String, default: "*/20 * * * *" },
      },
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    people: { type: Number, default: 0 },
  },
  {
    collection: "manifestation",
    timestamps: true,
    versionKey: false,
    strict: "throw",
  },
);

module.exports = {
  ManifestationSchema,
};
