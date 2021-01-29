/* eslint-disable no-use-before-define */
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const { ManifestationSchema } = require("./model");
const { PostDAO } = require("../post/dao");

// Static Methods
ManifestationSchema.statics.createNew = async function createNew(manifestation) {
  const _manifestation = new ManifestationDAO(manifestation);
  const newManifestation = await _manifestation.save();
  return newManifestation;
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
ManifestationSchema.methods.updatePersonsCount = async function updatePersonsCount() {
  const personsCount = await PostDAO.countUsers(this._id);
  this.persons = personsCount;
  return await this.save();
};

ManifestationSchema.methods.newCrawlStatus = async function newCrawlStatus(postCrawlStatus) {
  return await this.crawlStatus.create(postCrawlStatus);
};

ManifestationSchema.methods.getLastCrawlStatusByHashtag = async function getLastCrawlStatusByHashtag(
  source,
  hashtag,
) {
  console.log(source, hashtag);
  // post_id_str: -1 biggest on top
  // const lastPostCrawlStatus = await PostCrawlStatusDAO.findOne({ source, hashtag })
  //   .sort({ _id: -1 })
  //   .exec();
  // return lastPostCrawlStatus;
};

ManifestationSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  indexFields: ["deleted"],
});

const ManifestationDAO = mongoose.model("Manifestation", ManifestationSchema);

module.exports = { ManifestationDAO };
