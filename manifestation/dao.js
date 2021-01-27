/* eslint-disable no-use-before-define */
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const { ManifestationSchema } = require("./model");

ManifestationSchema.statics.createNew = async function createNew(manifestation) {
  const _manifestation = new ManifestationDAO(manifestation);
  const newManifestation = await _manifestation.save();
  return newManifestation;
};

// TODO: googlear y revisar como mergear las propiedades del objeto existente
ManifestationSchema.statics.udpate = async function udpate(_id, manifestation) {
  return await ManifestationDAO.findByIdAndUpdate({ _id }, manifestation, {
    new: true,
  }).exec();
};

ManifestationSchema.statics.getAll = async function getAll({ skip, limit, sort, query }) {
  const manifestationsTotal = await ManifestationDAO.countDocuments({});
  const manifestations = await ManifestationDAO.find({ ...query })
    .skip(skip)
    .limit(limit)
    .sort(sort);

  return {
    count: manifestations.length,
    list: manifestations,
    total: manifestationsTotal,
  };
};

ManifestationSchema.statics.getById = async function getById(_id) {
  return await ManifestationDAO.findOne({ _id }).exec();
};

ManifestationSchema.statics.removeById = async function removeById(_id, userId = null) {
  return await ManifestationDAO.delete({ _id }, userId);
};

ManifestationSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  indexFields: ["deleted"],
});

const ManifestationDAO = mongoose.model("Manifestation", ManifestationSchema);

module.exports = { ManifestationDAO };
