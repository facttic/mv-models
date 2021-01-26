const factory = require("fakingoose");
const { ManifestationSchema } = require("../manifestation/model");

exports.manifestationFactory = (options = {}, values = {}) => {
  return factory(ManifestationSchema, options).generate(values);
};
