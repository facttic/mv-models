const mongoose = require("mongoose");

const { DenyListDAO } = require("./deny_list/dao");
const { HashtagDAO } = require("./hashtag/dao");
const { PostDAO } = require("./post/dao");
const { PostCrawlStatusDAO } = require("./post_crawl_status/dao");
const { PostUserDAO } = require("./post_user/dao");
const { ManifestationDAO } = require("./manifestation/dao");
const { UserDAO } = require("./user/dao");

async function init(dbUri) {
  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: process.env.NODE_ENV === "development",
    useUnifiedTopology: true,
  });

  mongoose.connection
    .once("open", () => console.log("Connected!"))
    .on("error", (error) => {
      console.error(error);
    });
}

module.exports = {
  DenyListDAO,
  HashtagDAO,
  PostDAO,
  PostCrawlStatusDAO,
  PostUserDAO,
  UserDAO,
  ManifestationDAO,
  init,
};
