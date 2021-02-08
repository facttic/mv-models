/* eslint-disable no-use-before-define */
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const { PostSchema } = require("./model");

PostSchema.statics.createNew = async function createNew(post) {
  const _post = new PostDAO(post);
  const newPost = await _post.save();
  return newPost;
};

PostSchema.statics.createMany = async function createMany(posts) {
  return await PostDAO.createMany(posts, { ordered: false });
};

PostSchema.statics.getAll = async function getAll({ skip, limit, sort, query }) {
  const postsTotal = await PostDAO.countDocuments({});

  const posts = await PostDAO.find({ ...query })
    .skip(skip)
    .limit(limit)
    .sort(sort);

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
  const postsTotal = await PostDAO.countDocuments({ manifestation_id: manifestationId });

  const posts = await PostDAO.find({ ...query, manifestation_id: manifestationId })
    .skip(skip)
    .limit(limit)
    .sort(sort);

  return {
    count: posts.length,
    list: posts,
    total: postsTotal,
  };
};

PostSchema.statics.getByPostIdStr = async function getByPostIdStr(postIdStr, source) {
  return await PostDAO.findOne({ post_id_str: postIdStr, source }).exec();
};

PostSchema.statics.getById = async function getById(_id) {
  return await PostDAO.findOne({ _id });
};

PostSchema.statics.removeByUserId = async function removeById(userIdStr, userId) {
  return await PostDAO.delete({ "user.id_str": userIdStr }, userId);
};

PostSchema.statics.removeById = async function removeById(_id, userId = null) {
  const post = await PostDAO.findOne({ _id });
  if (!post) {
    throw new Error("Post does not exist");
  }
  return await PostDAO.delete({ _id }, userId);
};

PostSchema.statics.removeByManifestationId = async function removeByManifestationId(
  manifestationId,
  _id,
  userId = null,
) {
  return await PostDAO.delete({ _id, manifestation_id: manifestationId }, userId);
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

const PostDAO = mongoose.model("Post", PostSchema);

module.exports = { PostDAO };
