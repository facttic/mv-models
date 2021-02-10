const mongoose = require("mongoose");
const { HashtagSchema } = require("../hashtag/model");

const ManifestationSchema = mongoose.Schema(
  {
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
        columns: { type: Number, enum: [7, 8, 9, 10] },
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
      header: { type: String, trim: true, default: "" },
      favicon: { type: String, trim: true, default: "" },
      og: {
        twitter: { type: String, trim: true, default: "" },
        facebook: { type: String, trim: true, default: "" },
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
  },
);

module.exports = {
  ManifestationSchema,
};
