/* eslint-disable no-use-before-define */
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const { PostSchema } = require("./schema");

PostSchema.statics.createNew = async function createNew(post) {
  return await PostDAO.create(post);
};

PostSchema.statics.createMany = async function createMany(posts) {
  return await PostDAO.insertMany(posts, { ordered: false });
};

PostSchema.statics.getAll = async function getAll({ skip, limit, sort, query }) {
  const postsTotal = await PostDAO.countDocuments({}).exec();

  const posts = await PostDAO.find({ ...query })
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .exec();

  return {
    count: posts.length,
    list: posts,
    total: postsTotal,
  };
};

PostSchema.statics.getAllByManifestationId = async function getAllByManifestationId(
  manifestationId,
  { skip, limit, sort, query },
) {
  const postsTotal = await PostDAO.countDocuments({ manifestation_id: manifestationId }).exec();

  const posts = await PostDAO.find({ ...query, manifestation_id: manifestationId })
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .exec();

  return {
    count: posts.length,
    list: posts,
    total: postsTotal,
  };
};

PostSchema.statics.getByPostIdStrBySource = async function getByPostIdStrBySource(
  postIdStr,
  source,
) {
  return await PostDAO.findOne({ post_id_str: postIdStr, source }).exec();
};

PostSchema.statics.getById = async function getById(_id) {
  return await PostDAO.findById(_id).exec();
};

PostSchema.statics.removeByUserIdStr = async function removeByUserIdStr(userIdStr, userId = null) {
  const { nModified } = await PostDAO.delete({ "user.id_str": userIdStr }, userId).exec();

  if (nModified) {
    return userIdStr;
  }
  return null;
};

PostSchema.statics.removeById = async function removeById(_id, userId = null) {
  const { nModified } = await PostDAO.deleteById(_id, userId).exec();

  if (nModified) {
    return _id;
  }
  return null;
};

PostSchema.statics.removeByIdByManifestationId = async function removeByIdByManifestationId(
  manifestationId,
  _id,
  userId = null,
) {
  const { nModified } = await PostDAO.delete(
    { _id, manifestation_id: manifestationId },
    userId,
  ).exec();

  if (nModified) {
    return _id;
  }
  return null;
};

PostSchema.statics.countUsersByManifestationId = async function countUsersByManifestationId(
  manifestationId,
) {
  const peopleCount = await PostDAO.distinct("user.id_str", {
    manifestation_id: manifestationId,
  }).exec();

  return peopleCount.length;
};

PostSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  indexFields: ["deleted"],
});

PostSchema.set("toJSON", {
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

const PostDAO = mongoose.model("Post", PostSchema);

module.exports = { PostDAO };
