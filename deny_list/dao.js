/* eslint-disable no-use-before-define */
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const { DenyListSchema } = require("./model");

DenyListSchema.statics.createNew = async function createNew(denyList) {
  return await DenyListDAO.create(denyList);
};

DenyListSchema.statics.getAll = async function getAll({ skip, limit, sort, query }) {
  const denyListsCount = await this.model("DenyList").countDocuments({ deleted: false });
  const denyLists = await this.model("DenyList")
    .find({ ...query })
    .skip(skip)
    .limit(limit)
    .sort(sort);

  return {
    count: denyLists.length,
    list: denyLists,
    total: denyListsCount,
  };
};

DenyListSchema.statics.getAllByManifestationId = async function getAllByManifestationId(
  manifestationId,
  { skip, limit, sort, query },
) {
  const denyListsCount = await DenyListDAO.countDocuments({ deleted: false });
  const denyLists = await DenyListDAO.find({ manifestation_id: manifestationId, ...query })
    .skip(skip)
    .limit(limit)
    .sort(sort);

  return {
    count: denyLists.length,
    list: denyLists,
    total: denyListsCount,
  };
};

DenyListSchema.statics.getById = async function getById(_id) {
  return await DenyListDAO.findOne({ _id });
};

DenyListSchema.statics.isDenyListed = async function isDenyListed(idStr) {
  return await DenyListDAO.findOne({ user_id_str: idStr });
};

DenyListSchema.statics.isDenyListedByManifestationId = async function isDenyListedByManifestationId(
  manifestationId,
  idStr,
) {
  return await DenyListDAO.findOne({
    manifestation_id: manifestationId,
    user_id_str: idStr,
  });
};

DenyListSchema.statics.removeById = async function removeById(_id, userId = null) {
  const denyList = await DenyListDAO.findOne({ _id });
  if (!denyList) {
    throw new Error("Denylist does not exist");
  }
  return await DenyListDAO.delete({ _id }, userId);
};

DenyListSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  indexFields: ["deleted"],
});

const DenyListDAO = mongoose.model("DenyList", DenyListSchema);

module.exports = { DenyListDAO };
