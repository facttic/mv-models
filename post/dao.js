/* eslint-disable no-use-before-define */
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const { PostSchema } = require("./model");

PostSchema.statics.createNew = async function createNew(post) {
  const _post = new PostDAO(post);
  const newPost = await _post.save();
  return newPost;
};

PostSchema.statics.insertMany = async function insertMany(posts) {
  const options = {
    ordered: false,
  };
  const newPosts = await this.model("Post").collection.insertMany(posts, options);
  return newPosts;
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

PostSchema.statics.removeByUserId = async function removeById(twitterUserId, userId) {
  const deleteResults = await PostDAO.delete({ "user.id_str": twitterUserId }, userId);
  return deleteResults;
};

PostSchema.statics.countUsers = async function countUsers(manifestationId) {
  const peopleCount = await PostDAO.distinct("user.id_str", {
    manifestation_id: manifestationId,
  }).exec();
  return peopleCount.length;
};

PostSchema.statics.findByIdStr = async function findByIdStr(postIdStr, source) {
  const found = await PostDAO.findOne({ post_id_str: postIdStr, source }).exec();
  return found;
};

PostSchema.statics.removeById = async function removeById(_id, userId = null) {
  const deleteResults = await PostDAO.delete({ _id }, userId);
  return deleteResults;
};

PostSchema.statics.removeByManifestationId = async function removeByManifestationId(
  manifestationId,
  _id,
  userId = null,
) {
  return await PostDAO.delete({ _id, manifestation_id: manifestationId }, userId);
};

PostSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  indexFields: ["deleted"],
});

const PostDAO = mongoose.model("Post", PostSchema);

module.exports = { PostDAO };
