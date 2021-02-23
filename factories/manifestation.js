const { ManifestationDAO } = require("../manifestation/dao");
const chance = require("chance").Chance();

module.exports = (factory) => {
  factory.define("manifestation", ManifestationDAO, {
    name: chance.name(),
    uri: chance.url(),
    title: chance.sentence(),
    subtitle: chance.sentence(),
    description: chance.paragraph(),
    footer: chance.paragraph(),
    sponsors: chance.n(() => buildSponsor(), chance.d20()),
    hashtags: chance.unique(() => buildHashtag(), chance.d20()),
    metadata: {
      title: chance.sentence(),
      keywords: chance.sentence(),
      description: chance.sentence(),
    },
    crawlStatuses: chance.n(() => buildCrawlStatus(), chance.d20()),
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
      header: { src: chance.url() },
      favicon: { src: chance.url() },
      og: {
        twitter: { src: chance.url() },
        facebook: { src: chance.url() },
      },
    },
    startDate: chance.date(),
    endDate: chance.date(),
    people: chance.integer(),
  });
};

const buildCrawlStatus = function buildCrawlStatus(attrs = {}) {
  return Object.assign(
    {
      post_id_str: chance.word(),
      post_created_at: chance.word(),
      hashtag: chance.word(),
      source: chance.pickone(["twitter", "instagram"]),
    },
    attrs,
  );
};

const buildHashtag = function buildHashtag(attrs = {}) {
  return Object.assign(
    {
      name: chance.word(),
      source: chance.pickone(["twitter", "instagram"]),
    },
    attrs,
  );
};

const buildSponsor = function buildSponsor(attrs = {}) {
  return Object.assign(
    {
      name: chance.company(),
      logoUri: chance.url(),
      pageUri: chance.url(),
    },
    attrs,
  );
};

module.exports.buildCrawlStatus = buildCrawlStatus;
module.exports.buildHashtag = buildHashtag;
module.exports.buildSponsor = buildSponsor;
