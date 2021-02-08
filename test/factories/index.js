const FactoryGirl = require("factory-girl");

const factory = FactoryGirl.factory;
const adapter = new FactoryGirl.MongooseAdapter();

factory.setAdapter(adapter);

require("./manifestation")(factory);
require("./user")(factory);
require("./post")(factory);
require("./deny_list")(factory);

module.exports = factory;
