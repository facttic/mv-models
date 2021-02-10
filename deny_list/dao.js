/* eslint-disable no-use-before-define */
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const { DenyListSchema } = require("./model");

DenyListSchema.statics.createNew = async function createNew(denyList) {
  return await DenyListDAO.create(denyList);
};

DenyListSchema.statics.getAll = async function getAll({ skip, limit, sort, query }) {
  const denyListsCount = await DenyListDAO.countDocuments({});
  const denyLists = await DenyListDAO.find({ ...query })
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
  const denyListsCount = await DenyListDAO.countDocuments({});
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

DenyListSchema.statics.getByUserIdStr = async function getByUserIdStr(userIdStr) {
  return await DenyListDAO.findOne({ user_id_str: userIdStr });
};

DenyListSchema.statics.getByUserIdStrByManifestationId = async function getByUserIdStrByManifestationId(
  manifestationId,
  userIdStr,
) {
  return await DenyListDAO.findOne({
    manifestation_id: manifestationId,
    user_id_str: userIdStr,
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

DenyListSchema.set("toJSON", {
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

const DenyListDAO = mongoose.model("DenyList", DenyListSchema);

module.exports = { DenyListDAO };
