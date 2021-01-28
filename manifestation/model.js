const mongoose = require("mongoose");
const { HashtagSchema } = require("../hashtag/model");

const ManifestationSchema = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    uri: { type: String, trim: true, required: true },
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    footer: { type: String, trim: true, required: true },
    stylesOverride: { type: String, trim: true, required: true },
    styles: {
      colors: {
        background: { type: String, trim: true, required: true },
        foreground: { type: String, trim: true, required: true },
        accent: { type: String, trim: true, required: true },
      },
      // que posiblemente tenga forma de uri
      font: { type: String, trim: true, required: true },
      cards: {
        columns: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        colors: {
          hover: { type: String, trim: true, required: true },
          border: { type: String, trim: true, required: true },
        },
      },
    },
    images: {
      header: { type: String, trim: true, required: true },
    },
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
        // { "name": "#quesealey", "source": "instagram" }
        // tanto IG com TW tienen que tener esta forma:
        // { "name": "quesealey", "source": "twitter" }
        // name: { type: String, trim: true, required: true },
        // const source_enum = ["instagram", "twitter"]
        // source: { type: String, trim: true, required: true },
        type: HashtagSchema,
        required: true,
      },
    ],
    metadata: [
      {
        name: { type: String, trim: true, required: true },
        value: { type: String, trim: true, required: true },
      },
    ],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    // TODO: mover de postuserDAO a manifestationDAO los métodos de DAO correspondientes
    people: { type: Number, required: true },
    // TODO: mover de postcrawlstatusrDAO a manifestationDAO los métodos de DAO correspondientes
    crawlStatus: [
      {
        post_id_str: { type: String, trim: true, required: true, index: true },
        post_created_at: { type: String, trim: true, required: true },
        hashtag: { type: String, trim: true },
        source: { type: String, trim: true, required: true, enum: ["twitter", "instagram"] },
      },
    ],
  },
  { collection: "manifestation" },
);

module.exports = {
  ManifestationSchema,
};
