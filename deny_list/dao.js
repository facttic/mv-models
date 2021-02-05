/* eslint-disable no-use-before-define */
const mongoose = require("mongoose");

const { DenyListSchema } = require("./model");

DenyListSchema.statics.createNew = async function createNew(denyList) {
  const _denyList = new DenyListDAO(denyList);
  const newDenyList = await _denyList.save();
  return newDenyList;
};

DenyListSchema.statics.getAll = async function getAll() {
  const denyListsCount = await this.model("DenyList").countDocuments({ deleted: false });
  const denyLists = await this.model("DenyList").find({});

  return {
    count: denyListsCount,
    list: denyLists,
  };
};

DenyListSchema.statics.findById = async function findById(_id) {
  return await DenyListDAO.findOne({ _id });
};

DenyListSchema.statics.isDenyListed = async function isDenyListed(idStr) {
  return await DenyListDAO.findOne({ user_id_str: idStr });
};

DenyListSchema.statics.getAllByManifestationId = async function getAllByManifestationId(
  manifestationId,
) {
  const denyListsCount = await DenyListDAO.countDocuments({ deleted: false });
  const denyLists = await DenyListDAO.find({ manifestation_id: manifestationId });

  return {
    count: denyLists.length,
    list: denyLists,
    total: denyListsCount,
  };
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

const DenyListDAO = mongoose.model("DenyList", DenyListSchema);

module.exports = { DenyListDAO };
