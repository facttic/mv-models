/* eslint-disable no-use-before-define */
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const { ManifestationSchema } = require("./model");
const { PostDAO } = require("../post/dao");

const _ = require("lodash");

// Static Methods
ManifestationSchema.statics.createNew = async function createNew(manifestation) {
  return await ManifestationDAO.create(manifestation);
};

// TODO: googlear y revisar como mergear las propiedades del objeto existente
ManifestationSchema.statics.udpate = async function udpate(_id, manifestation) {
  return await ManifestationDAO.findByIdAndUpdate({ _id }, manifestation, {
    new: true,
    runValidators: true,
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

// Instance methods
ManifestationSchema.methods.updatePeopleCount = async function updatePeopleCount() {
  this.people = await PostDAO.countUsers(this._id);
  return await this.save();
};

ManifestationSchema.methods.newCrawlStatus = async function newCrawlStatus(postCrawlStatus) {
  await this.crawlStatus.push(postCrawlStatus);
  return this.save();
};

ManifestationSchema.methods.getLastCrawlStatus = function getLastCrawlStatusByHashtag(source) {
  return _.chain(this.get("crawlStatus")).filter({ source }).orderBy("_id", "desc").head().value();
};

ManifestationSchema.methods.getLastCrawlStatusByHashtag = function getLastCrawlStatusByHashtag(
  source,
  hashtag,
) {
  return _.chain(this.get("crawlStatus"))
    .filter({ source, hashtag })
    .orderBy("_id", "desc")
    .head()
    .value();
};

ManifestationSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  indexFields: ["deleted"],
});

const ManifestationDAO = mongoose.model("Manifestation", ManifestationSchema);

module.exports = { ManifestationDAO };
