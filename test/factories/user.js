const { UserDAO } = require("../../user/dao");
module.exports = (factory, chance) => {
  factory.define("user", UserDAO, {
    name: chance.name(),
    email: chance.email({ domain: "facttic.org.ar" }),
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
