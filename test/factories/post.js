const { PostDAO } = require("../../post/dao");
const chance = require("chance").Chance();

module.exports = (factory) => {
  factory.define("post", PostDAO, {
    post_created_at: chance.timestamp(),
    post_id_str: chance.string({ length: 20 }),
    full_text: chance.paragraph(),
    hashtags: chance.n(chance.word, chance.d20()),
    media: [
      {
        media_url: chance.url(),
        media_url_https: chance.url(),
        media_url_thumb: chance.url(),
        media_url_small: chance.url(),
        media_url_medium: chance.url(),
        media_url_large: chance.url(),
        sizes: {},
      },
    ],
    user: {
      id_str: chance.string({ length: 20 }),
      name: chance.name(),
      screen_name: chance.twitter(),
      location: chance.coordinates(),
      profile_image_url: chance.avatar({ protocol: "http" }),
      profile_image_url_https: chance.avatar({ protocol: "https" }),
    },
    source: chance.pickone(["twitter", "instagram"]),
    geo: {},
    coordinates: {},
    manifestation_id: factory.assoc("manifestation", "_id"),
  });
};
