const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

module.exports = {
  require: ["test/hooks.js", "chai/register-expect"],
  recursive: true,
  reporter: "min",
};
