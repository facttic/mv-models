const mongoose = require("mongoose");

const { DenyListDAO } = require("./deny_list/dao");
const { PostDAO } = require("./post/dao");
const { ManifestationDAO } = require("./manifestation/dao");
const { UserDAO } = require("./user/dao");

async function init(dbUri) {
  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: process.env.NODE_ENV === "development",
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  mongoose.connection
    .once("open", () => console.log("Connected!"))
    .on("error", (error) => {
      console.error(error);
    });
}

module.exports = {
  DenyListDAO,
  PostDAO,
  UserDAO,
  ManifestationDAO,
  init,
};
