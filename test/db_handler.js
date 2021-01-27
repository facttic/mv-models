const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server-core");

const mongod = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
  const uri = await mongod.getUri();
  // const uri = "mongodb://localhost:27017/mv-test";

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: process.env.NODE_ENV === "development",
    useUnifiedTopology: true,
  });

  mongoose.connection.on("error", (error) => {
    console.warn("Error : ", error);
  });
};

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
  const collections = Object.values(mongoose.connection.collections);

  for (const collection of collections) {
    await collection.deleteMany();
  }
};
