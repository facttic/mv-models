const { UserDAO } = require("../../user/dao");
const chance = require("chance").Chance();

module.exports = (factory) => {
  factory.define("user", UserDAO, {
    name: chance.name(),
    email: factory.sequence("user.email", (n) => `dummy-user-${n}@facttic.org.ar`),
    password: chance.word({ length: 8 }),
    tokens: [
      {
        token: chance.word(),
      },
    ],
    superadmin: chance.bool(),
    manifestation_id: factory.assoc("manifestation", "_id"),
  });
};
