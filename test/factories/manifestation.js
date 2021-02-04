const { ManifestationDAO } = require("../../manifestation/dao");

module.exports = (factory, chance) => {
  factory.define("manifestation", ManifestationDAO, {
    name: chance.name(),
    uri: chance.url(),
    title: chance.sentence(),
    subtitle: chance.sentence(),
    description: chance.paragraph(),
    footer: chance.paragraph(),
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
    metadata: {
      title: chance.sentence(),
      keywords: chance.sentence(),
      description: chance.sentence(),
    },

    crawlStatuses: chance.n(() => buildCrawlStatus(chance), chance.d20()),
    styles: {
      colors: {
        background: chance.color({ format: "hex" }),
        accent: chance.color({ format: "hex" }),
      },
      text: {
        title: {
          font: chance.url(),
          color: chance.color({ format: "hex" }),
        },
        subtitle: {
          font: chance.url(),
          color: chance.color({ format: "hex" }),
        },
        body: {
          font: chance.url(),
          color: chance.color({ format: "hex" }),
        },
      },
      thumbnails: {
        columns: chance.pickone([7, 8, 9, 10]),
        colors: {
          hover: chance.color({ format: "hex" }),
          border: chance.color({ format: "hex" }),
        },
      },
      cards: {
        darkMode: chance.bool(),
      },
    },
    images: {
      header: chance.url(),
      favicon: chance.url(),
      og: {
        twitter: chance.url(),
        facebook: chance.url(),
      },
    },
    startDate: chance.date(),
    endDate: chance.date(),
    people: chance.integer(),
  });
};

function buildCrawlStatus(chance) {
  return {
    post_id_str: chance.word(),
    post_created_at: chance.word(),
    hashtag: chance.word(),
    source: chance.pickone(["twitter", "instagram"]),
  };
}
