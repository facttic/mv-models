const FactoryGirl = require("factory-girl");

const factory = FactoryGirl.factory;
const adapter = new FactoryGirl.MongooseAdapter();
const manifestationFactory = require("./manifestation");

factory.setAdapter(adapter);

manifestationFactory(factory);
require("./user")(factory);
require("./post")(factory);
require("./deny_list")(factory);

module.exports = factory;
module.exports.manifestationFactory = manifestationFactory;
