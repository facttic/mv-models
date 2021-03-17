const mongoose = require("mongoose");

const { DenyListDAO } = require("./deny_list/dao");
const { PostDAO } = require("./post/dao");
const { ManifestationDAO, ManifestationEmmiter } = require("./manifestation/dao");
const { UserDAO } = require("./user/dao");
const factories = require("./factories");

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

async function close() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}

async function clear() {
  const collections = Object.values(mongoose.connection.collections);

  for (const collection of collections) {
    await collection.deleteMany();
  }
}

module.exports = {
  DenyListDAO,
  PostDAO,
  UserDAO,
  ManifestationDAO,
  ManifestationEmmiter,
  init,
  close,
  clear,
  factories,
};
