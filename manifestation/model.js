const mongoose = require("mongoose");
const { HashtagSchema } = require("../hashtag/model");

const ManifestationSchema = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    uri: { type: String, trim: true, required: true },
    title: { type: String, trim: true, required: true },
    subtitle: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    footer: { type: String, trim: true, required: true },
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
      title: { type: String, trim: true, required: true },
      keywords: { type: String, trim: true, required: true },
      description: { type: String, trim: true, required: true },
    },
    crawlStatus: [
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
        background: { type: String, trim: true, required: true },
        // se usará para texto: links, hashtags
        accent: { type: String, trim: true, required: true },
      },
      text: {
        title: {
          font: { type: String, trim: true, required: true },
          color: { type: String, trim: true, required: true },
        },
        subtitle: {
          font: { type: String, trim: true, required: true },
          color: { type: String, trim: true, required: true },
        },
        // se usará para text de cards posts body
        body: {
          font: { type: String, trim: true, required: true },
          color: { type: String, trim: true, required: true },
        },
      },
      thumbnails: {
        // TODO: habría un map entre cantidad de columnas y tamaños
        // 7: columnas 500px x 500px
        columns: { type: Number, required: true, enum: [7, 8, 9, 10] },
        colors: {
          hover: { type: String, trim: true, required: true },
          border: { type: String, trim: true, required: true },
        },
      },
      cards: {
        darkMode: { type: Boolean, default: false },
      },
    },
    images: {
      header: { type: String, trim: true, required: true },
      favicon: { type: String, trim: true, required: true },
      og: {
        twitter: { type: String, trim: true, required: true },
        facebook: { type: String, trim: true, required: true },
      },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    people: { type: Number, required: true },
  },
  { collection: "manifestation" },
);

module.exports = {
  ManifestationSchema,
};
