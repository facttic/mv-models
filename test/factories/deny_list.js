const { DenyListDAO } = require("../../deny_list/dao");
const chance = require("chance").Chance();

module.exports = (factory) => {
  factory.define("deny_list", DenyListDAO, {
    user_id_str: chance.string({ length: 20 }),
    manifestation_id: factory.assoc("manifestation", "_id"),
  });
};
