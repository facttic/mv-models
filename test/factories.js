const factory = require("fakingoose");
const { ManifestationSchema } = require("../manifestation/model");

exports.manifestationFactory = (options) => factory(ManifestationSchema, options);
