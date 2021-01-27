const dbHandler = require("./db_handler");

exports.mochaHooks = {
  beforeAll: async () => await dbHandler.connect(),
  afterEach: async () => await dbHandler.clearDatabase(),
  afterAll: async () => await dbHandler.closeDatabase(),
};
