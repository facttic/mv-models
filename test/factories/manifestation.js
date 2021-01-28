const { ManifestationDAO } = require("../../manifestation/dao");

module.exports = (factory, chance) => {
  factory.define("manifestation", ManifestationDAO, {
    name: chance.name(),
    uri: chance.url(),
    title: chance.sentence(),
    description: chance.paragraph(),
    footer: chance.paragraph(),
    stylesOverride: chance.url(),
    styles: {
      colors: {
        background: chance.color({ format: "hex" }),
        foreground: chance.color({ format: "hex" }),
        accent: chance.color({ format: "hex" }),
      },
      font: chance.url(),
      cards: {
        columns: chance.integer({ min: 1, max: 20 }),
        width: chance.integer({ min: 1, max: 20 }),
        height: chance.integer({ min: 1, max: 20 }),
        colors: {
          hover: chance.color({ format: "hex" }),
          border: chance.color({ format: "hex" }),
        },
      },
    },
    images: {
      header: chance.url(),
    },
    sponsors: [
      {
        name: chance.company(),
        logoUri: chance.url(),
        pageUri: chance.url(),
      },
    ],
    hashtags: [
      {
        name: chance.hashtag(),
        source: chance.pickone(["twitter", "instagram"]),
      },
    ],
    metadata: [
      {
        name: chance.word(),
        value: chance.sentence(),
      },
    ],
    startDate: chance.date(),
    endDate: chance.date(),
    people: chance.integer(),
    crawlStatus: [
      {
        post_id_str: chance.word(),
        post_created_at: chance.word(),
        hashtag: chance.word(),
        source: chance.pickone(["twitter", "instagram"]),
      },
    ],
  });
};
