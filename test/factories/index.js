const FactoryGirl = require("factory-girl");
const chance = require("chance").Chance();

const factory = FactoryGirl.factory;
const adapter = new FactoryGirl.MongooseAdapter();

factory.setAdapter(adapter);

require("./manifestation")(factory, chance);
require("./user")(factory, chance);
require("./post")(factory, chance);

module.exports = factory;
