/* eslint-disable no-use-before-define */
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const { ManifestationSchema } = require("./schema");
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

ManifestationSchema.statics.getAll = async function getAll(query) {
  const manifestationsTotal = await ManifestationDAO.countDocuments({ deleted: false });
  const manifestations = await ManifestationDAO.find(query.filter)
    .skip(query.skip)
    .limit(query.limit)
    .sort(query.sort);
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
  this.people = await PostDAO.countUsersByManifestationId(this._id);
  return await this.save();
};

ManifestationSchema.methods.newCrawlStatus = async function newCrawlStatus(postCrawlStatus) {
  this.crawlStatuses.push(postCrawlStatus);
  return await this.save();
};

ManifestationSchema.methods.getLastCrawlStatus = function getLastCrawlStatusByHashtag(source) {
  return _.chain(this.get("crawlStatuses"))
    .filter({ source })
    .orderBy("_id", "desc")
    .head()
    .value();
};

ManifestationSchema.methods.getLastCrawlStatusByHashtag = function getLastCrawlStatusByHashtag(
  source,
  hashtag,
) {
  return _.chain(this.get("crawlStatuses"))
    .filter({ source, hashtag })
    .orderBy("_id", "desc")
    .head()
    .value();
};

ManifestationSchema.methods.newHashtag = async function newHashtag(hashtag) {
  this.hashtags.push(hashtag);
  return await this.save();
};

ManifestationSchema.methods.getAllHashtags = function getAllHashtags() {
  const hashtags = _.chain(this.get("hashtags")).orderBy("_id", "desc").value();

  return {
    count: hashtags.length,
    list: hashtags,
  };
};

ManifestationSchema.methods.getHashtagsBySource = function getHashtagsBySource(source) {
  const hashtags = _.chain(this.get("hashtags")).filter({ source }).orderBy("_id", "desc").value();

  return {
    count: hashtags.length,
    list: hashtags,
  };
};

ManifestationSchema.methods.deleteHashtag = async function deleteHashtag(_id) {
  const existingHashtag = this.hashtags.id(_id);
  if (!existingHashtag) {
    throw new Error("Hashtag does not exist");
  }

  existingHashtag.remove();
  return await this.save();
};

ManifestationSchema.methods.updateHashtag = async function updateHashtag(_id, hashtag) {
  const existingHashtag = this.hashtags.id(_id);
  if (!existingHashtag) {
    throw new Error("Hashtag does not exist");
  }

  Object.assign(existingHashtag, hashtag);
  return await this.save();
};

ManifestationSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  indexFields: ["deleted"],
});

ManifestationSchema.set("toJSON", {
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

const ManifestationDAO = mongoose.model("Manifestation", ManifestationSchema);

module.exports = { ManifestationDAO };
