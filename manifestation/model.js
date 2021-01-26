const mongoose = require("mongoose");

const ManifestationSchema = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    uri: { type: String, trim: true, required: true },
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    footer: { type: String, trim: true, required: true },
    styles: {
      colors: {
        background: { type: String, trim: true, required: true },
        foreground: { type: String, trim: true, required: true },
        accent: { type: String, trim: true, required: true },
      },
      // que posiblemente tenga forma de uri
      font: { type: String, trim: true, required: true },

    },
    images: {
      header: { type: String, trim: true, required: true },
      header: { type: String, trim: true, required: true },
    },
    sponsors: [
      {
        name: { type: String, trim: true, required: true },
        logo: { type: String, trim: true, required: true },
        uri: { type: String, trim: true, required: true },
      }
    ]
    hashtags: [
      {
        // nota: hashtags en IG incluyen # y en TW no
        // TODO: normalizar todo sin almohadita
        // { "name": "#quesealey", "source": "instagram" }
        // tanto IG com TW tienen que tener esta forma:
        // { "name": "quesealey", "source": "twitter" }
        name: { type: String, trim: true, required: true },
        // const source_enum = ["instagram", "twitter"]
        source: { type: String, trim: true, required: true },
      }
    ],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { collection: "manifestation" },
);

module.exports = {
  ManifestationSchema,
};
